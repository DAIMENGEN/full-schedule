import {TimelineViewStrategy} from "./timeline-view-strategy";
import React from "react";
import {ScheduleImpl} from "../../../core/structs/schedule-struct";
import {
    ScheduleGanttChartTimelineSlotFrame
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-slot-frame";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {DateRange} from "../../../core/datelib/date-range";
import {Position} from "../../../core/types/public-types";
import {ResourceImpl} from "../../../core/structs/resource-struct";

export class YearViewStrategy extends TimelineViewStrategy {

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
        const years = timeline.getYears();
        return (
            <tbody>
            <tr className={`schedule-timeline-header-row`}>
                {
                    years.map(year => (
                        <th key={year.format("YYYY")}
                            colSpan={1}
                            data-date={year.format("YYYY")}
                            className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                            <ScheduleGanttChartTimelineSlotFrame level={1}
                                                                 date={year}
                                                                 schedule={this.schedule}
                                                                 timeText={year.format("YYYY")}
                                                                 classNames={["schedule-year"]}/>
                        </th>
                    ))
                }
            </tr>
            </tbody>
        );
    }

    renderBodySlots(): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const years = timeline.getYears();
        return (
            <tbody>
            <tr>
                {
                    years.map(year => <td key={year.format("YYYY")}
                                          data-date={year.format("YYYY")}
                                          className={`schedule-timeline-slot schedule-timeline-slot-lane`}>
                        <ScheduleGanttChartTimelineSlotFrame date={year}
                                                             schedule={this.schedule}
                                                             classNames={["schedule-year"]}/>
                    </td>)
                }
            </tr>
            </tbody>
        );
    }

    renderColgroup(): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const slotMinWidth = this.schedule.getSlotMinWidth();
        const years = timeline.getYears();
        const years_cols = years.map(year => <col key={year.format("YYYY")}
                                                  style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
        return <colgroup>{years_cols}</colgroup>;
    }

    calculatePosition(timelineWidth: number, dateRange: DateRange): Position {
        const timeline = this.schedule.getTimeline();
        const years = timeline.getYears();
        const yearCellWidth = timelineWidth / years.length;

        // Determine the start and end dates within the timeline range;
        const start = dateRange.start.isBefore(timeline.getStart()) ? timeline.getStart() : dateRange.start;
        const end = dateRange.end.isAfter(timeline.getEnd()) ? timeline.getEnd() : dateRange.end;

        // Calculate ratio;
        const ratio = yearCellWidth / 12;

        // Calculate left position;
        const startMonth = start.month();
        const yearLeft = timeline.getYearPosition(start) * yearCellWidth;
        const left = dateRange.start.isSameOrBefore(timeline.getStart(), "month") ? yearLeft : yearLeft + startMonth * ratio;

        // Calculate right position;
        const endMonth = end.month();
        const yearRight = (timeline.getYearPosition(end) + 1) * yearCellWidth * -1;
        const right = dateRange.end.isBefore(timeline.getEnd(), "month") ? yearRight + (11 - endMonth) * ratio : yearRight;

        return {left, right};
    }

    renderMilestones(resource: ResourceImpl, timelineWidth: number): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const targetMilestones = resource.milestones;
        const cellWidth = timelineWidth / timeline.getYears().length;
        const lineHeight = targetMilestones.length > 0 ? this.schedule.getLineHeight() * 1.5 : this.schedule.getLineHeight();
        return (
            <div className={`schedule-timeline-milestones schedule-scrollgrid-sync-inner`}>
                {
                    targetMilestones.filter(milestone => (milestone.range.start.isAfter(timeline.getStart(), "day") || milestone.range.start.isSame(timeline.getStart(), "day")) && milestone.range.end.isSameOrBefore(timeline.getEnd(),"day")).map(milestone => {
                        const position = this.calculatePosition(timelineWidth, milestone.range);
                        const diffYears = milestone.range.start.diff(timeline.getStart(), "year");
                        const diff = position.left - diffYears * cellWidth;
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
        const cellWidth = timelineWidth / timeline.getYears().length;
        const lineHeight = targetMilestones.length > 0 ? this.schedule.getLineHeight() * 1.5 : this.schedule.getLineHeight();
        return (
            <div className={`schedule-timeline-checkpoints schedule-scrollgrid-sync-inner`}>
                {
                    targetCheckpoints.filter(checkpoint => (checkpoint.range.start.isAfter(timeline.getStart(), "day") || checkpoint.range.start.isSame(timeline.getStart(), "day")) && checkpoint.range.end.isSameOrBefore(timeline.getEnd(),"day")).map(checkpoint => {
                        const position = this.calculatePosition(timelineWidth, checkpoint.range);
                        const diffYears = checkpoint.range.start.diff(timeline.getStart(), "year");
                        const diff = position.left - diffYears * cellWidth;
                        const condition = diff < cellWidth / 2;
                        return super.renderCheckpoint(checkpoint, lineHeight, position, condition);
                    })
                }
            </div>
        )
    }
}