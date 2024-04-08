import {TimelineViewStrategy} from "./timeline-view-strategy";
import React from "react";
import {ScheduleApi} from "../../../core/structs/schedule-struct";
import {
    ScheduleGanttChartTimelineSlotFrame
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-slot-frame";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {DateRange} from "../../../core/datelib/date-range";
import {Position} from "../../../core/types/public-types";

export class YearViewStrategy implements TimelineViewStrategy {

    private readonly schedule: ScheduleApi;

    constructor(schedule: ScheduleApi) {
        this.schedule = schedule;
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
        const years_cols = years.map(year => <col key={year.format("YYYY")} style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
        return <colgroup>{years_cols}</colgroup>;
    }

    calculatePosition(timelineWidth: number, dateRange: DateRange): Position {
        const timeline = this.schedule.getTimeline();
        const yearCellWidth = timelineWidth / timeline.getYears().length;
        const yearLeft = timeline.getYearPosition(dateRange.start.isBefore(timeline.getStart()) ? timeline.getStart() : dateRange.start) * yearCellWidth;
        const yearRight = (timeline.getYearPosition(dateRange.end.isAfter(timeline.getEnd()) ? timeline.getEnd() : dateRange.end) + 1) * yearCellWidth * -1;
        return {left: yearLeft, right: yearRight};
    }
}