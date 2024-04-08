import {ScheduleViewType} from "../../core/structs/schedule-view-struct";
import {ScheduleImpl} from "../../core/structs/schedule-struct";
import {ScheduleUtil} from "../../utils/schedule-util";
import React from "react";
import {ResourceImpl} from "../../core/structs/resource-struct";
import {
    ScheduleGanttChartResourceTableColgroup
} from "./common/schedule-gantt-chart-table-colgroup/schedule-gantt-chart-resource-table-colgroup";
import {
    ScheduleGanttChartDatagridLabelCellFrame
} from "./common/schedule-gantt-chart-label/schedule-gantt-chart-datagrid-label-cell-frame";
import {
    ScheduleGanttChartDatagridLaneCellFrame
} from "./common/schedule-gantt-chart-lane/schedule-gantt-chart-datagrid-lane-cell-frame";
import {TimelineViewStrategy} from "./strategies/timeline-view-strategy";
import {DayViewStrategy} from "./strategies/day-view-strategy";
import {WeekViewStrategy} from "./strategies/week-view-strategy";
import {MonthViewStrategy} from "./strategies/month-view-strategy";
import {QuarterViewStrategy} from "./strategies/quarter-view-strategy";
import {YearViewStrategy} from "./strategies/year-view-strategy";

export class ScheduleGanttChartView {

    private readonly schedule: ScheduleImpl;

    private readonly scheduleViewType: ScheduleViewType;

    private readonly timelineViewStrategy: TimelineViewStrategy;

    constructor(schedule: ScheduleImpl) {
        this.schedule = schedule;
        this.scheduleViewType = schedule.getScheduleViewType();
        switch (this.scheduleViewType) {
            case "Day":
                this.timelineViewStrategy = new DayViewStrategy(schedule);
                break;
            case "Week":
                this.timelineViewStrategy = new WeekViewStrategy(schedule);
                break;
            case "Month":
                this.timelineViewStrategy = new MonthViewStrategy(schedule);
                break;
            case "Quarter":
                this.timelineViewStrategy = new QuarterViewStrategy(schedule);
                break;
            case "Year":
                this.timelineViewStrategy = new YearViewStrategy(schedule);
                break;
            default:
                this.timelineViewStrategy = new DayViewStrategy(schedule);
                break;
        }
    }

    renderDatagridColgroup(): React.JSX.Element {
        const resourceAreaColumns = this.schedule.getResourceAreaColumns();
        return <ScheduleGanttChartResourceTableColgroup resourceAreaColumns={resourceAreaColumns}/>;
    }

    renderDatagridHeader(): React.JSX.Element {
        const resourceAreaColumns = this.schedule.getResourceAreaColumns();
        return (
            <thead>
                <tr role={`row`}>
                    {
                        resourceAreaColumns.map((column, index) => (
                            <th key={column.field} role={`columnheader`} className={`schedule-datagrid-cell`}>
                                <ScheduleGanttChartDatagridLabelCellFrame schedule={this.schedule} showIndentation={index === 0} resourceAreaColumn={column} />
                            </th>
                        ))
                    }
                </tr>
            </thead>
        )
    }

    renderDatagridBody(collapseResourceIds: Array<string>): React.JSX.Element {
        const renderResource = (resource: ResourceImpl) => {
            return this.schedule.getResourceAreaColumns().map((column, index) => (
                <td key={column.field} role={`gridcell`} data-resource-id={resource.id} className={`schedule-datagrid-cell schedule-resource`}>
                    <ScheduleGanttChartDatagridLaneCellFrame schedule={this.schedule} showIndentation={true} showButton={index === 0} currentResource={resource} resourceAreaColumn={column} />
                </td>
            ))
        }
        const renderTableRows = (resource: ResourceImpl): Array<React.JSX.Element> => {
            if (!collapseResourceIds.some((resourceId: string) => resourceId === resource.id) && resource.children.length > 0) {
                const children = resource.children;
                return [<tr key={resource.id} role={`row`}>{renderResource(resource)}</tr>, ...children.flatMap(child => renderTableRows(child))];
            } else {
                return [<tr key={resource.id} role={`row`}>{renderResource(resource)}</tr>];
            }
        }
        return (
            <tbody>
            {
                this.schedule.getResourcesTree().flatMap(resource => renderTableRows(resource))
            }
            </tbody>
        )
    }

    renderTimelineColgroup(): React.ReactNode {
        return this.timelineViewStrategy.renderColgroup();
    }

    renderTimelineHeaderSlots(): React.ReactNode {
        return this.timelineViewStrategy.renderHeaderSlots()
    }

    renderTimelineBodySlots(): React.ReactNode {
        return this.timelineViewStrategy.renderBodySlots()
    }

    renderTimelineElements(collapseResourceIds: Array<string>, timelineWidth: number): React.JSX.Element {
        const draw_elements = (resource: ResourceImpl) => {
            const targetMilestones = resource.milestones;
            const lineHeight = targetMilestones.length > 0 ? this.schedule.getLineHeight() * 1.5 : this.schedule.getLineHeight();
            return (
                <tr key={resource.id}>
                    <td data-resource-id={resource.id} className={`schedule-timeline-lane schedule-resource`}>
                        <div className={`schedule-timeline-lane-frame`} style={{height: ScheduleUtil.numberToPixels(lineHeight)}}>
                            <div className={`schedule-timeline-lane-misc`}></div>
                            <div className={`schedule-timeline-bg`}></div>
                            {this.timelineViewStrategy.renderEvents(resource, timelineWidth)}
                            {this.timelineViewStrategy.renderMilestones(resource, timelineWidth)}
                            {this.timelineViewStrategy.renderCheckpoints(resource, timelineWidth)}
                        </div>
                    </td>
                </tr>
            )
        }
        const render = (resource: ResourceImpl): Array<React.JSX.Element> => {
            if (!collapseResourceIds.some(resourceId => resourceId === resource.id) && resource.children.length > 0) {
                const children = resource.children;
                return [draw_elements(resource), ...children.flatMap(child => render(child))];
            } else {
                return [draw_elements(resource)];
            }
        }
        return (
            <tbody>
            {this.schedule.getResourcesTree().flatMap(resource => render(resource))}
            </tbody>
        )
    }
}