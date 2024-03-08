import React from "react";
import {useTimelineWidth} from "../hook/timeline/useTimelineWidth";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {ScheduleImpl} from "../../../core/structs/schedule-struct";
import {useScheduleSelector} from "../../../core/state/schedule-hook";
import {ScheduleGanttChartView} from "../schedule-gantt-chart-view";

type Props = {
    schedule: ScheduleImpl;
}
export const ScheduleGanttChartDrawingBoard: React.FC<Props> = ({schedule}) => {
    const timeline = schedule.getTimeline();
    const timelineWidth = useTimelineWidth(timeline);
    const scheduleView = new ScheduleGanttChartView(schedule);
    const collapseResourceIds = useScheduleSelector((state) => state.scheduleState.collapseResourceIds);
    return (
        <table aria-hidden={true} id={`schedule-drawing-board`} className={`schedule-scrollgrid-sync-table`} style={{width: ScheduleUtil.numberToPixels(timelineWidth)}}>
            {scheduleView.renderTimelineElements(collapseResourceIds, timelineWidth)}
        </table>
    )
}

export default ScheduleGanttChartDrawingBoard;