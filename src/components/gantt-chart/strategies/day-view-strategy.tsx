import React from "react";
import {TimelineViewStrategy} from "./timeline-view-strategy";
import {
    ScheduleGanttChartTimelineSlotFrame
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-slot-frame";
import {ScheduleApi} from "../../../core/structs/schedule-struct";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {DateRange} from "../../../core/datelib/date-range";
import {Position} from "../../../core/types/public-types";

export class DayViewStrategy implements TimelineViewStrategy {
    private readonly schedule: ScheduleApi;

    constructor(schedule: ScheduleApi) {
        this.schedule = schedule;
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
        const days_cols = days.map(day => <col key={day.format("YYYY-MM-DD")} style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
        return <colgroup>{days_cols}</colgroup>;
    }

    calculatePosition(timelineWidth: number, range: DateRange): Position {
        const timeline = this.schedule.getTimeline();
        const dayCellWidth = timelineWidth / timeline.getDays().length;
        const dayLeft = timeline.getDayPosition(range.start.isBefore(timeline.getStart()) ? timeline.getStart() : range.start) * dayCellWidth;
        const dayRight = (timeline.getDayPosition(range.end.isAfter(timeline.getEnd()) ? timeline.getEnd() : range.end) + 1) * dayCellWidth * -1;
        return {left: dayLeft, right: dayRight};
    }
}