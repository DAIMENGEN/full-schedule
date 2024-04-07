import {ScheduleApi} from "../../../core/structs/schedule-struct";
import {TimelineViewStrategy} from "./timeline-view-strategy";
import React from "react";
import {
    ScheduleGanttChartTimelineSlotFrame
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-slot-frame";
import {ScheduleUtil} from "../../../utils/schedule-util";

export class QuarterViewStrategy implements TimelineViewStrategy {
    private readonly schedule: ScheduleApi;

    constructor(schedule: ScheduleApi) {
        this.schedule = schedule;
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
        const quarters_cols = quarters.map(quarter => <col key={quarter.format("YYYY-MM")} style={{minWidth: ScheduleUtil.numberToPixels(slotMinWidth)}}/>);
        return <colgroup>{quarters_cols}</colgroup>;
    }
}