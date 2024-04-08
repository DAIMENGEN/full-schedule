import {ScheduleImpl} from "../../../core/structs/schedule-struct";
import {TimelineViewStrategy} from "./timeline-view-strategy";
import React from "react";
import {
    ScheduleGanttChartTimelineSlotFrame
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-slot-frame";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {DateRange} from "../../../core/datelib/date-range";
import {Position} from "../../../core/types/public-types";
import {ResourceImpl} from "../../../core/structs/resource-struct";

export class QuarterViewStrategy extends TimelineViewStrategy {
    private readonly schedule: ScheduleImpl;

    constructor(schedule: ScheduleImpl) {
        super();
        this.schedule = schedule;
    }

    get getSchedule(): ScheduleImpl {
        return this.schedule;
    }

    renderHeaderSlots(): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const quarters = timeline.getQuarters();
        const years = timeline.populateYearsWithQuarters();
        return (
            <tbody>
            <tr className={`schedule-timeline-header-row`}>
                {
                    years.map(date => (
                        <th key={date.year.format("YYYY")}
                            colSpan={date.quarters.length}
                            data-date={date.year.format("YYYY")}
                            className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                            <ScheduleGanttChartTimelineSlotFrame level={1}
                                                                 date={date.year}
                                                                 schedule={this.schedule}
                                                                 timeText={date.year.format("YYYY")}
                                                                 classNames={["schedule-year"]}/>
                        </th>
                    ))
                }
            </tr>
            <tr className={`schedule-timeline-header-row`}>
                {
                    quarters.map(quarter => (
                        <th key={quarter.year() + "-Q" + quarter.quarter()}
                            colSpan={1} data-date={quarter.year() + "-Q" + quarter.quarter()}
                            className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                            <ScheduleGanttChartTimelineSlotFrame level={2}
                                                                 date={quarter}
                                                                 schedule={this.schedule}
                                                                 timeText={`Q${quarter.quarter()}`}
                                                                 classNames={["schedule-quarter"]}/>
                        </th>
                    ))
                }
            </tr>
            </tbody>
        );
    }

    renderBodySlots(): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const quarters = timeline.getQuarters();
        return (
            <tbody>
            <tr>
                {
                    quarters.map(quarter => <td key={quarter.year() + "-Q" + quarter.quarter()}
                                                data-date={quarter.year() + "-Q" + quarter.quarter()}
                                                className={`schedule-timeline-slot schedule-timeline-slot-lane`}>
                        <ScheduleGanttChartTimelineSlotFrame date={quarter}
                                                             schedule={this.schedule}
                                                             classNames={["schedule-quarter"]}/>
                    </td>)
                }
            </tr>
            </tbody>
        );
    }

    renderColgroup(): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const slotMinWidth = this.schedule.getSlotMinWidth();
        const quarters = timeline.getQuarters();
        const quarters_cols = quarters.map(quarter => <col key={quarter.format("YYYY-MM")}
                                                           style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
        return <colgroup>{quarters_cols}</colgroup>;
    }

    calculatePosition(timelineWidth: number, dateRange: DateRange): Position {
        const timeline = this.schedule.getTimeline();
        const quarters = timeline.getQuarters();
        const quarterCellWidth = timelineWidth / quarters.length;

        // Determine the start and end dates within the timeline range;
        const start = dateRange.start.isBefore(timeline.getStart()) ? timeline.getStart() : dateRange.start;
        const end = dateRange.end.isAfter(timeline.getEnd()) ? timeline.getEnd() : dateRange.end;

        // Calculate left position;
        const start_total_days = start.endOf("quarter").diff(start.startOf("quarter"), "day");
        const startDate = start.diff(start.startOf("quarter"), "day");
        const width_1 = quarterCellWidth / start_total_days;
        const quarterLeft = timeline.getQuarterPosition(start) * quarterCellWidth;
        const left = dateRange.start.isSameOrBefore(timeline.getStart(), "month") ? quarterLeft : quarterLeft + startDate * width_1;

        // Calculate right position;
        const end_total_days = end.endOf("quarter").diff(end.startOf("quarter"), "day");
        const endDate = end.endOf("quarter").diff(end, "day");
        const width_2 = quarterCellWidth / end_total_days;
        const quarterRight = (timeline.getQuarterPosition(end) + 1) * quarterCellWidth * -1;
        const right = dateRange.end.isBefore(timeline.getEnd(), "month") ? quarterRight + endDate * width_2 : quarterRight;

        return {left, right};
    }

    renderMilestones(resource: ResourceImpl, timelineWidth: number): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const targetMilestones = resource.milestones;
        const cellWidth = timelineWidth / timeline.getQuarters().length;
        const lineHeight = targetMilestones.length > 0 ? this.schedule.getLineHeight() * 1.5 : this.schedule.getLineHeight();
        return (
            <div className={`schedule-timeline-milestones schedule-scrollgrid-sync-inner`}>
                {
                    targetMilestones.filter(milestone => (milestone.range.start.isAfter(timeline.getStart(), "day") || milestone.range.start.isSame(timeline.getStart(), "day")) && milestone.range.end.isSameOrBefore(timeline.getEnd(),"day")).map(milestone => {
                        const position = this.calculatePosition(timelineWidth, milestone.range);
                        const diffQuarter = milestone.range.start.diff(timeline.getStart(), "quarter");
                        const diff = position.left - diffQuarter * cellWidth;
                        const condition = diff < cellWidth / 2;
                        return super.renderMilestone(milestone, lineHeight, position, condition);
                    })
                }
            </div>
        )
    }

    renderCheckpoints(resource: ResourceImpl, timelineWidth: number): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const targetMilestones = resource.milestones;
        const targetCheckpoints = resource.checkpoints;
        const cellWidth = timelineWidth / timeline.getQuarters().length;
        const lineHeight = targetMilestones.length > 0 ? this.schedule.getLineHeight() * 1.5 : this.schedule.getLineHeight();
        return (
            <div className={`schedule-timeline-checkpoints schedule-scrollgrid-sync-inner`}>
                {
                    targetCheckpoints.filter(checkpoint => (checkpoint.range.start.isAfter(timeline.getStart(), "day") || checkpoint.range.start.isSame(timeline.getStart(), "day")) && checkpoint.range.end.isSameOrBefore(timeline.getEnd(),"day")).map(checkpoint => {
                        const position = this.calculatePosition(timelineWidth, checkpoint.range);
                        const diffQuarter = checkpoint.range.start.diff(timeline.getStart(), "quarter");
                        const diff = position.left - diffQuarter * cellWidth;
                        const condition = diff < cellWidth / 2;
                        return super.renderCheckpoint(checkpoint, lineHeight, position, condition);
                    })
                }
            </div>
        )
    }
}