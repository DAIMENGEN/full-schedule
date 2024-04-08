import React from "react";
import {TimelineViewStrategy} from "./timeline-view-strategy";
import {ScheduleImpl} from "../../../core/structs/schedule-struct";
import {
    ScheduleGanttChartTimelineSlotFrame
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-slot-frame";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {DateRange} from "../../../core/datelib/date-range";
import {Position} from "../../../core/types/public-types";
import {ResourceImpl} from "../../../core/structs/resource-struct";

export class WeekViewStrategy extends TimelineViewStrategy {
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
        const weeks = timeline.getWeeks();
        const years = timeline.populateYearsWithWeeks();
        return (
            <tbody>
            <tr className={`schedule-timeline-header-row`}>
                {
                    years.map(date => (
                        <th key={date.year.format("YYYY")}
                            colSpan={date.weeks.length}
                            data-date={date.year.format("YYYY")}
                            className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                            <ScheduleGanttChartTimelineSlotFrame level={1}
                                                                 date={date.year}
                                                                 schedule={this.schedule}
                                                                 timeText={date.year.format("YYYY")}
                                                                 classNames={["schedule-week"]}/>
                        </th>
                    ))
                }
            </tr>
            <tr className={`schedule-timeline-header-row`}>
                {
                    weeks.map(week => (
                        <th key={week.format("YYYY-MM-DD")}
                            colSpan={1}
                            data-date={week.format("YYYY-MM-DD")}
                            className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                            <ScheduleGanttChartTimelineSlotFrame level={2}
                                                                 date={week}
                                                                 schedule={this.schedule}
                                                                 timeText={week.week().toString()}
                                                                 classNames={["schedule-month"]}/>
                        </th>
                    ))
                }
            </tr>
            </tbody>
        );
    }

    renderBodySlots(): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const weeks = timeline.getWeeks();
        return (
            <tbody>
            <tr>
                {
                    weeks.map(week => <td key={week.format("YYYY-MM-DD")}
                                          data-date={week.format("YYYY-MM-DD")}
                                          className={`schedule-timeline-slot schedule-timeline-slot-lane`}>
                        <ScheduleGanttChartTimelineSlotFrame date={week}
                                                             schedule={this.schedule}
                                                             classNames={["schedule-week"]}/>
                    </td>)
                }
            </tr>
            </tbody>
        );
    }

    renderColgroup(): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const slotMinWidth = this.schedule.getSlotMinWidth();
        const weeks = timeline.getWeeks();
        const weeks_cols = weeks.map(week => <col key={week.format("YYYY-MM-DD")} style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
        return <colgroup>{weeks_cols}</colgroup>;
    }

    calculatePosition(timelineWidth: number, dateRange: DateRange): Position {
        const timeline = this.schedule.getTimeline();
        const weeks = timeline.getWeeks();
        const weekCellWidth = timelineWidth / weeks.length;

        // Determine the start and end dates within the timeline range;
        const start = dateRange.start.isBefore(timeline.getStart()) ? timeline.getStart() : dateRange.start;
        const end = dateRange.end.isAfter(timeline.getEnd()) ? timeline.getEnd() : dateRange.end;

        // Calculate ratio
        const ratio = weekCellWidth / 7;

        // Calculate left position;
        const startDate = start.day();
        const weekLeft = timeline.getWeekPosition(start) * weekCellWidth;
        const left = dateRange.start.isSameOrBefore(timeline.getStart()) ? weekLeft : weekLeft + (startDate * ratio)

        // Calculate right position;
        const endDate = 6 - end.day();
        const weekRight = (timeline.getWeekPosition(end) + 1) * weekCellWidth * -1;
        const right = dateRange.end.isBefore(timeline.getEnd()) ? weekRight + (endDate * ratio) : weekRight;

        return {left, right};
    }

    renderMilestones(resource: ResourceImpl, timelineWidth: number): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const cellWidth = timelineWidth / timeline.getWeeks().length;
        const targetMilestones = resource.milestones;
        const lineHeight = targetMilestones.length > 0 ? this.schedule.getLineHeight() * 1.5 : this.schedule.getLineHeight();
        return (
            <div className={`schedule-timeline-milestones schedule-scrollgrid-sync-inner`}>
                {
                    targetMilestones.filter(milestone => (milestone.range.start.isAfter(timeline.getStart(), "day") || milestone.range.start.isSame(timeline.getStart(), "day")) && milestone.range.end.isSameOrBefore(timeline.getEnd(),"day")).map(milestone => {
                        const position = this.calculatePosition(timelineWidth, milestone.range);
                        const diffWeek = milestone.range.start.diff(timeline.getStart(), "week");
                        const diff = position.left - diffWeek * cellWidth;
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
        const cellWidth = timelineWidth / timeline.getWeeks().length;
        const lineHeight = targetMilestones.length > 0 ? this.schedule.getLineHeight() * 1.5 : this.schedule.getLineHeight();
        return (
            <div className={`schedule-timeline-checkpoints schedule-scrollgrid-sync-inner`}>
                {
                    targetCheckpoints.filter(checkpoint => (checkpoint.range.start.isAfter(timeline.getStart(), "day") || checkpoint.range.start.isSame(timeline.getStart(), "day")) && checkpoint.range.end.isSameOrBefore(timeline.getEnd(),"day")).map(checkpoint => {
                        const position = this.calculatePosition(timelineWidth, checkpoint.range);
                        const diffWeek = checkpoint.range.start.diff(timeline.getStart(), "week");
                        const diff = position.left - diffWeek * cellWidth;
                        const condition = diff < cellWidth / 2;
                        return super.renderCheckpoint(checkpoint, lineHeight, position, condition);
                    })
                }
            </div>
        )
    }
}