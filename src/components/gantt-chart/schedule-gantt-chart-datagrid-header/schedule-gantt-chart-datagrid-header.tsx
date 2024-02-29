import React from "react";
import {
    ScheduleGanttChartResourceTable
} from "../schedule-gantt-chart-resource-table/schedule-gantt-chart-resource-table";
import {ScheduleImpl} from "../../../core/structs/schedule-struct";
import {ScheduleGanttChartView} from "../schedule-gantt-chart-view";

type Props = {
    schedule: ScheduleImpl;
}
export const ScheduleGanttChartDatagridHeader: React.FC<Props> = ({schedule}) => {
    const scheduleView = new ScheduleGanttChartView(schedule);
    return (
        <ScheduleGanttChartResourceTable className={`schedule-datagrid-header`}
                                         scheduleView={scheduleView}
                                         children={scheduleView.renderDatagridHeader()}/>
    )
}

export default ScheduleGanttChartDatagridHeader;