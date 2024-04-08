import {ScheduleImpl} from "../../../core/structs/schedule-struct";
import {TimelineViewStrategy} from "./timeline-view-strategy";
import React from "react";
import {
    ScheduleGanttChartTimelineSlotFrame
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-slot-frame";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {DateRange} from "../../../core/datelib/date-range";
import {Position} from "../../../core/types/public-types";

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

    calculateEventPosition(timelineWidth: number, dateRange: DateRange): Position {
        const timeline = this.schedule.getTimeline();
        const quarters = timeline.getQuarters();
        const quarterCellWidth = timelineWidth / quarters.length;

        // Determine the start and end dates within the timeline range;
        const start = dateRange.start.isBefore(timeline.getStart()) ? timeline.getStart() : dateRange.start;
        const end = dateRange.end.isAfter(timeline.getEnd()) ? timeline.getEnd() : dateRange.end;

        // Calculate ratio;
        const ratio = quarterCellWidth / 3;

        // Calculate left position;
        const startMonth = start.startOf("quarter").month();
        const startMonths = [startMonth, startMonth + 1, startMonth + 2];
        const startIndex = startMonths.findIndex(value => value === start.month());
        const quarterLeft = timeline.getQuarterPosition(start) * quarterCellWidth;
        const left = dateRange.start.isSameOrBefore(timeline.getStart(), "month") ? quarterLeft : quarterLeft + startIndex * ratio;

        // Calculate right position;
        const endMonth = end.startOf("quarter").month();
        const endMonths = [endMonth, endMonth + 1, endMonth + 2];
        const endIndex = endMonths.findIndex(value => value === end.month());
        const quarterRight = (timeline.getQuarterPosition(end) + 1) * quarterCellWidth * -1;
        const right = dateRange.end.isBefore(timeline.getEnd(), "month") ? quarterRight + (2 - endIndex) * ratio : quarterRight;

        return {left, right};
    }
}