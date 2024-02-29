import React from "react";
import {ScheduleImpl} from "../../../core/structs/schedule-struct";
import {ScheduleGanttChartView} from "../schedule-gantt-chart-view";
type Props = {
    schedule: ScheduleImpl;
}
export const ScheduleGanttChartTimelineSlots: React.FC<Props> = ({schedule}) => {
    const scheduleView = new ScheduleGanttChartView(schedule);
    return (
        <table aria-hidden={true}>
            {scheduleView.renderTimelineColgroup()}
            {scheduleView.renderTimelineBodySlots()}
        </table>
    )
}
export default ScheduleGanttChartTimelineSlots;