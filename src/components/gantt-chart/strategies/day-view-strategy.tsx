import React from "react";
import {TimelineViewStrategy} from "./timeline-view-strategy";
import {
    ScheduleGanttChartTimelineSlotFrame
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-slot-frame";
import {ScheduleImpl} from "../../../core/structs/schedule-struct";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {DateRange} from "../../../core/datelib/date-range";
import {Position} from "../../../core/types/public-types";
import {ResourceImpl} from "../../../core/structs/resource-struct";
import {
    ScheduleGanttChartTimelineMilestone
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-milestone";
import {
    ScheduleGanttChartTimelineCheckpoint
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-checkpoint";

export class DayViewStrategy extends TimelineViewStrategy {
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
        const days = timeline.getDays();
        const months = timeline.populateMonthsWithDays();
        const years = timeline.populateYearsWithDays();
        return (
            <tbody>
            <tr className={`schedule-timeline-header-row`}>
                {
                    years.map(date => (
                        <th key={date.year.format("YYYY")}
                            colSpan={date.days.length}
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
                    months.map(date => (
                        <th key={date.month.format("YYYY-MM")}
                            colSpan={date.days.length}
                            data-date={date.month.format("YYYY-MM")}
                            className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                            <ScheduleGanttChartTimelineSlotFrame level={2}
                                                                 date={date.month}
                                                                 schedule={this.schedule}
                                                                 timeText={date.month.format("MMM")}
                                                                 classNames={["schedule-month"]}/>
                        </th>
                    ))
                }
            </tr>
            <tr className={`schedule-timeline-header-row`}>
                {
                    days.map(day => (
                        <th key={day.format("YYYY-MM-DD")}
                            colSpan={1}
                            data-date={day.format("YYYY-MM-DD")}
                            className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                            <ScheduleGanttChartTimelineSlotFrame level={3}
                                                                 date={day}
                                                                 schedule={this.schedule}
                                                                 timeText={day.format("ddd")}
                                                                 classNames={["schedule-day", `${timeline.isHoliday(day) ? "schedule-holiday" : ""}`]}/>
                        </th>
                    ))
                }
            </tr>
            <tr className={`schedule-timeline-header-row`}>
                {
                    days.map(day => (
                        <th key={day.format("YYYY-MM-DD")}
                            colSpan={1} data-date={day.format("YYYY-MM-DD")}
                            className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                            <ScheduleGanttChartTimelineSlotFrame level={4}
                                                                 date={day}
                                                                 schedule={this.schedule}
                                                                 timeText={day.format("DD")}
                                                                 classNames={["schedule-day", `${timeline.isHoliday(day) ? "schedule-holiday" : ""}`]}/>
                        </th>
                    ))
                }
            </tr>
            </tbody>
        );
    }

    renderBodySlots(): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const days = timeline.getDays();
        return (
            <tbody>
            <tr>
                {
                    days.map(day => <td key={day.format("YYYY-MM-DD")}
                                        data-date={day.format("YYYY-MM-DD")}
                                        className={`schedule-timeline-slot schedule-timeline-slot-lane`}>
                        <ScheduleGanttChartTimelineSlotFrame date={day}
                                                             schedule={this.schedule}
                                                             classNames={["schedule-day", `${timeline.isHoliday(day) ? "schedule-holiday" : ""}`]}/>
                    </td>)
                }
            </tr>
            </tbody>
        );
    }

    renderColgroup(): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const slotMinWidth = this.schedule.getSlotMinWidth();
        const days = timeline.getDays();
        const days_cols = days.map(day => <col key={day.format("YYYY-MM-DD")}
                                               style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
        return <colgroup>{days_cols}</colgroup>;
    }

    calculateEventPosition(timelineWidth: number, range: DateRange): Position {
        const timeline = this.schedule.getTimeline();
        const dayCellWidth = timelineWidth / timeline.getDays().length;
        const dayLeft = timeline.getDayPosition(range.start.isBefore(timeline.getStart()) ? timeline.getStart() : range.start) * dayCellWidth;
        const dayRight = (timeline.getDayPosition(range.end.isAfter(timeline.getEnd()) ? timeline.getEnd() : range.end) + 1) * dayCellWidth * -1;
        return {left: dayLeft, right: dayRight};
    }

    renderMilestones(resource: ResourceImpl, timelineWidth: number): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const targetMilestones = resource.milestones;
        const lineHeight = targetMilestones.length > 0 ? this.schedule.getLineHeight() * 1.5 : this.schedule.getLineHeight();
        return (
            <div className={`schedule-timeline-milestones schedule-scrollgrid-sync-inner`}>
                {
                    targetMilestones.filter(milestone => (milestone.range.start.isAfter(timeline.getStart(), "day") || milestone.range.start.isSame(timeline.getStart(), "day")) && milestone.range.end.isSameOrBefore(timeline.getEnd(), "day")).map(milestone => {
                        const top = lineHeight * 0.3 * -1;
                        const position = this.calculateEventPosition(timelineWidth, milestone.range);
                        return (
                            <div className={`schedule-timeline-milestone-harness`} style={{
                                left: ScheduleUtil.numberToPixels(position.left),
                                right: ScheduleUtil.numberToPixels(position.right),
                                top: ScheduleUtil.numberToPixels(top),
                                height: ScheduleUtil.numberToPixels(lineHeight),
                                lineHeight: ScheduleUtil.numberToPixels(lineHeight)
                            }} key={milestone.id}>
                                <ScheduleGanttChartTimelineMilestone milestone={milestone} schedule={this.schedule}/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    renderCheckpoints(resource: ResourceImpl, timelineWidth: number): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const targetMilestones = resource.milestones;
        const targetCheckpoints = resource.checkpoints;
        const lineHeight = targetMilestones.length > 0 ? this.schedule.getLineHeight() * 1.5 : this.schedule.getLineHeight();
        return (
            <div className={`schedule-timeline-checkpoints schedule-scrollgrid-sync-inner`}>
                {
                    targetCheckpoints.filter(checkpoint => (checkpoint.range.start.isAfter(timeline.getStart(), "day") || checkpoint.range.start.isSame(timeline.getStart(), "day")) && checkpoint.range.end.isSameOrBefore(timeline.getEnd(), "day")).map(checkpoint => {
                        const height = this.schedule.getLineHeight() * 0.7;
                        const top = (lineHeight - height) / 8;
                        const position = this.calculateEventPosition(timelineWidth, checkpoint.range);
                        return (
                            <div className={`schedule-timeline-checkpoint-harness`} style={{
                                left: ScheduleUtil.numberToPixels(position.left),
                                right: ScheduleUtil.numberToPixels(position.right),
                                top: ScheduleUtil.numberToPixels(top),
                                height: ScheduleUtil.numberToPixels(height),
                                lineHeight: ScheduleUtil.numberToPixels(lineHeight)
                            }} key={checkpoint.id}>
                                <ScheduleGanttChartTimelineCheckpoint checkpoint={checkpoint} schedule={this.schedule}/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}