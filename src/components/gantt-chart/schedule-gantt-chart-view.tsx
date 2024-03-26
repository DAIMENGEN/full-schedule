import {ScheduleViewType} from "../../core/structs/schedule-view-struct";
import {ScheduleImpl} from "../../core/structs/schedule-struct";
import {ScheduleUtil} from "../../utils/schedule-util";
import React from "react";
import {
    ScheduleGanttChartTimelineSlotFrame
} from "./common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-slot-frame";
import {ResourceImpl} from "../../core/structs/resource-struct";
import {
    ScheduleGanttChartTimelineLaneEvent
} from "./common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-lane-event";
import {
    ScheduleGanttChartTimelineMilestone
} from "./common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-milestone";
import {
    ScheduleGanttChartResourceTableColgroup
} from "./common/schedule-gantt-chart-table-colgroup/schedule-gantt-chart-resource-table-colgroup";
import {
    ScheduleGanttChartDatagridLabelCellFrame
} from "./common/schedule-gantt-chart-label/schedule-gantt-chart-datagrid-label-cell-frame";
import {
    ScheduleGanttChartDatagridLaneCellFrame
} from "./common/schedule-gantt-chart-lane/schedule-gantt-chart-datagrid-lane-cell-frame";
import {
    ScheduleGanttChartTimelineCheckpoint
} from "./common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-checkpoint";

export class ScheduleGanttChartView {

    private readonly schedule: ScheduleImpl;

    private readonly scheduleViewType: ScheduleViewType;

    constructor(schedule: ScheduleImpl) {
        this.schedule = schedule;
        this.scheduleViewType = schedule.getScheduleViewType();
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

    renderTimelineColgroup(): React.JSX.Element {
        const timeline = this.schedule.getTimeline();
        const slotMinWidth = this.schedule.getSlotMinWidth();
        switch (this.scheduleViewType) {
            case "Day":
                const days = timeline.getDays();
                const days_cols = days.map(day => <col key={day.format("YYYY-MM-DD")} style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
                return <colgroup>{days_cols}</colgroup>;
            case "Week":
                const weeks = timeline.getWeeks();
                const weeks_cols = weeks.map(week => <col key={week.format("YYYY-MM-DD")} style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
                return <colgroup>{weeks_cols}</colgroup>;
            case "Month":
                const months = timeline.getMonths();
                const months_cols = months.map(month => <col key={month.format("YYYY-MM")} style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
                return <colgroup>{months_cols}</colgroup>;
            case "Quarter":
                const quarters = timeline.getQuarters();
                const quarters_cols = quarters.map(quarter => <col key={quarter.format("YYYY-MM")} style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
                return <colgroup>{quarters_cols}</colgroup>
            case "Year":
                const years = timeline.getYears();
                const years_cols = years.map(year => <col key={year.format("YYYY")} style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
                return <colgroup>{years_cols}</colgroup>;
            default:
                return <></>;
        }
    }

    renderTimelineHeaderSlots(): React.JSX.Element {
        const timeline = this.schedule.getTimeline();
        switch (this.scheduleViewType) {
            case "Day":
                const days = timeline.getDays();
                const monthsAndDays = timeline.getMonthsAndDays();
                const yearsAndDays = timeline.getYearsAndDays();
                return (
                    <tbody>
                    <tr className={`schedule-timeline-header-row`}>
                        {
                            yearsAndDays.map(yearAndDays => (
                                <th key={yearAndDays.year.format("YYYY")} colSpan={yearAndDays.days.length} data-date={yearAndDays.year.format("YYYY")} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                    <ScheduleGanttChartTimelineSlotFrame date={yearAndDays.year} schedule={this.schedule} level={1} timeText={yearAndDays.year.format("YYYY")} classNames={["schedule-year"]}/>
                                </th>
                            ))
                        }
                    </tr>
                    <tr className={`schedule-timeline-header-row`}>
                        {
                            monthsAndDays.map(monthAndDays => (
                                <th key={monthAndDays.month.format("YYYY-MM")} colSpan={monthAndDays.days.length} data-date={monthAndDays.month.format("YYYY-MM")} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                    <ScheduleGanttChartTimelineSlotFrame date={monthAndDays.month} schedule={this.schedule} level={2} timeText={monthAndDays.month.format("MMM")} classNames={["schedule-month"]} />
                                </th>
                            ))
                        }
                    </tr>
                    <tr className={`schedule-timeline-header-row`}>
                        {
                            days.map(day => (
                                <th key={day.format("YYYY-MM-DD")} colSpan={1} data-date={day.format("YYYY-MM-DD")} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                    <ScheduleGanttChartTimelineSlotFrame date={day} schedule={this.schedule} level={3} timeText={day.format("ddd")} classNames={["schedule-day", `${timeline.isHoliday(day) ? "schedule-holiday": ""}`]} />
                                </th>
                            ))
                        }
                    </tr>
                    <tr className={`schedule-timeline-header-row`}>
                        {
                            days.map(day => (
                                <th key={day.format("YYYY-MM-DD")} colSpan={1} data-date={day.format("YYYY-MM-DD")} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                    <ScheduleGanttChartTimelineSlotFrame date={day} schedule={this.schedule} level={4} timeText={day.format("DD")} classNames={["schedule-day", `${timeline.isHoliday(day) ? "schedule-holiday": ""}`]}/>
                                </th>
                            ))
                        }
                    </tr>
                    </tbody>
                );
            case "Week":
                const weeks = timeline.getWeeks();
                const yearsAndWeeks = timeline.getYearsAndWeeks();
                return (
                    <tbody>
                        <tr className={`schedule-timeline-header-row`}>
                            {
                                yearsAndWeeks.map(yearAndWeeks => (
                                    <th key={yearAndWeeks.year.format("YYYY")} colSpan={yearAndWeeks.weeks.length} data-date={yearAndWeeks.year.format("YYYY")} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                        <ScheduleGanttChartTimelineSlotFrame date={yearAndWeeks.year} schedule={this.schedule} level={1} timeText={yearAndWeeks.year.format("YYYY")} classNames={["schedule-week"]}/>
                                    </th>
                                ))
                            }
                        </tr>
                        <tr className={`schedule-timeline-header-row`}>
                            {
                                weeks.map(week => (
                                    <th key={week.format("YYYY-MM-DD")} colSpan={1} data-date={week.format("YYYY-MM-DD")} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                        <ScheduleGanttChartTimelineSlotFrame date={week} schedule={this.schedule} level={2} timeText={week.startOf("week").format("MM/DD")} classNames={["schedule-week"]}/>
                                    </th>
                                ))
                            }
                        </tr>
                        <tr className={`schedule-timeline-header-row`}>
                            {
                                weeks.map(week => (
                                    <th key={week.format("YYYY-MM-DD")} colSpan={1} data-date={week.format("YYYY-MM-DD")} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                        <ScheduleGanttChartTimelineSlotFrame date={week} schedule={this.schedule} level={3} timeText={week.endOf("week").format("MM/DD")} classNames={["schedule-week"]}/>
                                    </th>
                                ))
                            }
                        </tr>
                    </tbody>
                )
            case "Month":
                const months = timeline.getMonths();
                const yearsAndMonths = timeline.getYearsAndMonths();
                return (
                    <tbody>
                    <tr className={`schedule-timeline-header-row`}>
                        {
                            yearsAndMonths.map(yearAndMonths => (
                                <th key={yearAndMonths.year.format("YYYY")} colSpan={yearAndMonths.months.length} data-date={yearAndMonths.year.format("YYYY")} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                    <ScheduleGanttChartTimelineSlotFrame date={yearAndMonths.year} schedule={this.schedule} level={1} timeText={yearAndMonths.year.format("YYYY")} classNames={["schedule-year"]}/>
                                </th>
                            ))
                        }
                    </tr>
                    <tr className={`schedule-timeline-header-row`}>
                        {
                            months.map(month => (
                                <th key={month.format("YYYY-MM")} colSpan={1} data-date={month.format("YYYY-MM")} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                    <ScheduleGanttChartTimelineSlotFrame date={month} schedule={this.schedule} level={2} timeText={month.format("MMM")} classNames={["schedule-month"]}/>
                                </th>
                            ))
                        }
                    </tr>
                    </tbody>
                )
            case "Quarter":
                const quarters = timeline.getQuarters();
                const yearsAndQuarters = timeline.getYearsAndQuarters();
                return (
                    <tbody>
                    <tr className={`schedule-timeline-header-row`}>
                        {
                            yearsAndQuarters.map(yearAndQuarters => (
                                <th key={yearAndQuarters.year.format("YYYY")} colSpan={yearAndQuarters.quarters.length} data-date={yearAndQuarters.year.format("YYYY")} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                    <ScheduleGanttChartTimelineSlotFrame date={yearAndQuarters.year} schedule={this.schedule} level={1} timeText={yearAndQuarters.year.format("YYYY")} classNames={["schedule-year"]}/>
                                </th>
                            ))
                        }
                    </tr>
                    <tr className={`schedule-timeline-header-row`}>
                        {
                            quarters.map(quarter => (
                                <th key={quarter.year() + "-Q" + quarter.quarter()} colSpan={1} data-date={quarter.year() + "-Q" + quarter.quarter()} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                    <ScheduleGanttChartTimelineSlotFrame date={quarter} schedule={this.schedule} level={2} timeText={`Q${quarter.quarter()}`} classNames={["schedule-quarter"]}/>
                                </th>
                            ))
                        }
                    </tr>
                    </tbody>
                )
            case "Year":
                const years = timeline.getYears();
                return (
                    <tbody>
                    <tr className={`schedule-timeline-header-row`}>
                        {
                            years.map(year => (
                                <th key={year.format("YYYY")} colSpan={1} data-date={year.format("YYYY")} className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                                    <ScheduleGanttChartTimelineSlotFrame date={year} schedule={this.schedule} level={1} timeText={year.format("YYYY")} classNames={["schedule-year"]}/>
                                </th>
                            ))
                        }
                    </tr>
                    </tbody>
                );
        }
    }

    renderTimelineBodySlots(): React.JSX.Element {
        const timeline = this.schedule.getTimeline();
        switch (this.scheduleViewType) {
            case "Day":
                const days = timeline.getDays();
                return (
                    <tbody>
                    <tr>
                        {
                            days.map(day => <td key={day.format("YYYY-MM-DD")} data-date={day.format("YYYY-MM-DD")} className={`schedule-timeline-slot schedule-timeline-slot-lane`}>
                                <ScheduleGanttChartTimelineSlotFrame schedule={this.schedule} date={day} classNames={["schedule-day", `${timeline.isHoliday(day) ? "schedule-holiday": ""}`]}/>
                            </td>)
                        }
                    </tr>
                    </tbody>
                )
            case "Week":
                const weeks = timeline.getWeeks();
                return (
                    <tbody>
                    <tr>
                        {
                            weeks.map(week => <td key={week.format("YYYY-MM-DD")} data-date={week.format("YYYY-MM-DD")} className={`schedule-timeline-slot schedule-timeline-slot-lane`}>
                                <ScheduleGanttChartTimelineSlotFrame schedule={this.schedule} date={week} classNames={["schedule-week"]}/>
                            </td>)
                        }
                    </tr>
                    </tbody>
                )
            case "Month":
                const months = timeline.getMonths();
                return (
                    <tbody>
                    <tr>
                        {
                            months.map(month => <td key={month.format("YYYY-MM")} data-date={month.format("YYYY-MM")} className={`schedule-timeline-slot schedule-timeline-slot-lane`}>
                                <ScheduleGanttChartTimelineSlotFrame schedule={this.schedule} date={month} classNames={["schedule-month"]}/>
                            </td>)
                        }
                    </tr>
                    </tbody>
                )
            case "Quarter":
                const quarters = timeline.getQuarters();
                return (
                    <tbody>
                    <tr>
                        {
                            quarters.map(quarter => <td key={quarter.year() + "-Q" + quarter.quarter()} data-date={quarter.year() + "-Q" + quarter.quarter()} className={`schedule-timeline-slot schedule-timeline-slot-lane`}>
                                <ScheduleGanttChartTimelineSlotFrame schedule={this.schedule} date={quarter} classNames={["schedule-quarter"]}/>
                            </td>)
                        }
                    </tr>
                    </tbody>
                )
            case "Year":
                const years = timeline.getYears();
                return (
                    <tbody>
                    <tr>
                        {
                            years.map(year => <td key={year.format("YYYY")} data-date={year.format("YYYY")} className={`schedule-timeline-slot schedule-timeline-slot-lane`}>
                                <ScheduleGanttChartTimelineSlotFrame schedule={this.schedule} date={year} classNames={["schedule-year"]}/>
                            </td>)
                        }
                    </tr>
                    </tbody>
                )
        }
    }

    renderTimelineElements(collapseResourceIds: Array<string>, timelineWidth: number): React.JSX.Element {

        const timeline = this.schedule.getTimeline();
        const draw_elements = (resource: ResourceImpl) => {
            const targetEvents = resource.events;
            const targetMilestones = resource.milestones;
            const targetCheckpoints = resource.checkpoints;
            const lineHeight = targetMilestones.length > 0 ? this.schedule.getLineHeight() * 1.5 : this.schedule.getLineHeight();
            return (
                <tr key={resource.id}>
                    <td data-resource-id={resource.id} className={`schedule-timeline-lane schedule-resource`}>
                        <div className={`schedule-timeline-lane-frame`} style={{height: ScheduleUtil.numberToPixels(lineHeight)}}>
                            <div className={`schedule-timeline-lane-misc`}></div>
                            <div className={`schedule-timeline-bg`}></div>
                            <div className={`schedule-timeline-events schedule-scrollgrid-sync-inner`}>
                                {
                                    targetEvents.filter(event => !event.range.start.isAfter(timeline.getEnd()) && !event.range.end.isBefore(timeline.getStart())).map(event => {
                                        const height = this.schedule.getLineHeight() * 0.7;
                                        const top = (lineHeight - height) / 2;
                                        const position = this.schedule.calculatePosition(event.range.start, event.range.end, timelineWidth, this.scheduleViewType);
                                        return (
                                            <div className={`schedule-timeline-event-harness`} style={{
                                                left: ScheduleUtil.numberToPixels(position.left),
                                                right: ScheduleUtil.numberToPixels(position.right),
                                                top: ScheduleUtil.numberToPixels(top),
                                                height: ScheduleUtil.numberToPixels(height),
                                                lineHeight: ScheduleUtil.numberToPixels(height)}} key={event.id}>
                                                <ScheduleGanttChartTimelineLaneEvent event={event} schedule={this.schedule} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={`schedule-timeline-milestones schedule-scrollgrid-sync-inner`}>
                                {
                                    targetMilestones.filter(milestone => (milestone.range.start.isAfter(timeline.getStart(), "day") || milestone.range.start.isSame(timeline.getStart(), "day")) && milestone.range.end.isSameOrBefore(timeline.getEnd(),"day")).map(milestone => {
                                        const top = lineHeight * 0.3 * -1;
                                        const position = this.schedule.calculatePosition(milestone.range.start, milestone.range.end, timelineWidth, this.scheduleViewType);
                                        return (
                                            <div className={`schedule-timeline-milestone-harness`} style={{
                                                left: ScheduleUtil.numberToPixels(position.left),
                                                right: ScheduleUtil.numberToPixels(position.right),
                                                top: ScheduleUtil.numberToPixels(top),
                                                height: ScheduleUtil.numberToPixels(lineHeight),
                                                lineHeight: ScheduleUtil.numberToPixels(lineHeight)
                                            }} key={milestone.id}>
                                                <ScheduleGanttChartTimelineMilestone milestone={milestone} schedule={this.schedule} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={`schedule-timeline-checkpoints schedule-scrollgrid-sync-inner`}>
                                {
                                    targetCheckpoints.filter(checkpoint => (checkpoint.range.start.isAfter(timeline.getStart(), "day") || checkpoint.range.start.isSame(timeline.getStart(), "day")) && checkpoint.range.end.isSameOrBefore(timeline.getEnd(),"day")).map(checkpoint => {
                                        const height = this.schedule.getLineHeight() * 0.7;
                                        const top = (lineHeight - height) / 8;
                                        const position = this.schedule.calculatePosition(checkpoint.range.start, checkpoint.range.end, timelineWidth, this.scheduleViewType);
                                        return (
                                            <div className={`schedule-timeline-checkpoint-harness`} style={{
                                                left: ScheduleUtil.numberToPixels(position.left),
                                                right: ScheduleUtil.numberToPixels(position.right),
                                                top: ScheduleUtil.numberToPixels(top),
                                                height: ScheduleUtil.numberToPixels(height),
                                                lineHeight: ScheduleUtil.numberToPixels(lineHeight)
                                            }} key={checkpoint.id}>
                                                <ScheduleGanttChartTimelineCheckpoint checkpoint={checkpoint} schedule={this.schedule} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
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