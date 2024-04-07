import React from "react";
import {TimelineViewStrategy} from "./timeline-view-strategy";
import {ScheduleApi} from "../../../core/structs/schedule-struct";
import {
    ScheduleGanttChartTimelineSlotFrame
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-slot-frame";
import {ScheduleUtil} from "../../../utils/schedule-util";

export class WeekViewStrategy implements TimelineViewStrategy {
    private readonly schedule: ScheduleApi;

    constructor(schedule: ScheduleApi) {
        this.schedule = schedule;
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
}