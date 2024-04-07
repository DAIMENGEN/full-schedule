import React from "react";
import {TimelineViewStrategy} from "./timeline-view-strategy";
import {ScheduleApi} from "../../../core/structs/schedule-struct";
import {
    ScheduleGanttChartTimelineSlotFrame
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-slot-frame";
import {ScheduleUtil} from "../../../utils/schedule-util";

export class MonthViewStrategy implements TimelineViewStrategy {
    private readonly schedule: ScheduleApi;

    constructor(schedule: ScheduleApi) {
        this.schedule = schedule;
    }
    renderHeaderSlots(): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const months = timeline.getMonths();
        const years = timeline.populateYearsWithMonths();
        return (
            <tbody>
            <tr className={`schedule-timeline-header-row`}>
                {
                    years.map(date => (
                        <th key={date.year.format("YYYY")}
                            colSpan={date.months.length}
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
                    months.map(month => (
                        <th key={month.format("YYYY-MM")}
                            colSpan={1}
                            data-date={month.format("YYYY-MM")}
                            className={`schedule-timeline-slot schedule-timeline-slot-label`}>
                            <ScheduleGanttChartTimelineSlotFrame level={2}
                                                                 date={month}
                                                                 schedule={this.schedule}
                                                                 timeText={month.format("MMM")}
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
        const months = timeline.getMonths();
        return (
            <tbody>
            <tr>
                {
                    months.map(month => <td key={month.format("YYYY-MM")}
                                            data-date={month.format("YYYY-MM")}
                                            className={`schedule-timeline-slot schedule-timeline-slot-lane`}>
                        <ScheduleGanttChartTimelineSlotFrame date={month}
                                                             schedule={this.schedule}
                                                             classNames={["schedule-month"]}/>
                    </td>)
                }
            </tr>
            </tbody>
        );
    }

    renderColgroup(): React.ReactNode {
        const timeline = this.schedule.getTimeline();
        const slotMinWidth = this.schedule.getSlotMinWidth();
        const months = timeline.getMonths();
        const months_cols = months.map(month => <col key={month.format("YYYY-MM")} style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
        return <colgroup>{months_cols}</colgroup>;
    }
}