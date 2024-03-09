import React from "react";
import {
    ScheduleGanttChartResourceTable
} from "../schedule-gantt-chart-resource-table/schedule-gantt-chart-resource-table";
import {ScheduleImpl} from "../../../core/structs/schedule-struct";
import {useScheduleSelector} from "../../../core/features/schedule-hook";
import {ScheduleGanttChartView} from "../schedule-gantt-chart-view";

type Props = {
    schedule: ScheduleImpl;
}
export const ScheduleGanttChartDatagridBody: React.FC<Props> = ({schedule}) => {
    const scheduleView = new ScheduleGanttChartView(schedule);
    const collapseResourceIds = useScheduleSelector((state) => state.resourceState.collapseIds);
    return (
        <ScheduleGanttChartResourceTable id={`schedule-datagrid-body`}
                                         className={`schedule-datagrid-body`}
                                         scheduleView={scheduleView}
                                         children={scheduleView.renderDatagridBody(collapseResourceIds)}/>
    )
}