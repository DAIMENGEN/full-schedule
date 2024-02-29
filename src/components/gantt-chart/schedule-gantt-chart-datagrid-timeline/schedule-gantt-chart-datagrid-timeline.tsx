import React from "react";
import {ScheduleImpl} from "../../../core/structs/schedule-struct";
import {ScheduleGanttChartView} from "../schedule-gantt-chart-view";
type Props = {
    schedule: ScheduleImpl;
}
export const ScheduleGanttChartDatagridTimeline: React.FC<Props> = ({schedule}) => {
    const scheduleView = new ScheduleGanttChartView(schedule);
    return (
        <table aria-hidden={true} className={`schedule-scrollgrid-sync-table`}>
            {scheduleView.renderTimelineColgroup()}
            {scheduleView.renderTimelineHeaderSlots()}
        </table>
    )
}