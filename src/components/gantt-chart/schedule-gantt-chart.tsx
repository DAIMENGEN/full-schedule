import React, {useMemo, useRef} from "react";
import {useSyncScroll} from "./hooks/scroll/useSyncScroll";
import {SCROLL_LEFT, SCROLL_TOP} from "./hooks/scroll/scroll-type";
import ScheduleGanttChartDatagridHeader
    from "./schedule-gantt-chart-datagrid-header/schedule-gantt-chart-datagrid-header";
import {
    ScheduleGanttChartDatagridTimeline
} from "./schedule-gantt-chart-datagrid-timeline/schedule-gantt-chart-datagrid-timeline";
import {ScheduleGanttChartDatagridBody} from "./schedule-gantt-chart-datagrid-body/schedule-gantt-chart-datagrid-body";
import ScheduleGanttChartTimelineSlots from "./schedule-gantt-chart-timeline-slots/schedule-gantt-chart-timeline-slots";
import ScheduleGanttChartDrawingBoard from "./schdeule-gantt-chart-drawing-board/schedule-gantt-chart-drawing-board";
import "./schedule-gantt-chart.scss";
import "./schedule-gantt-chart-capture.scss";
import {ScheduleImpl, ScheduleProps} from "../../core/structs/schedule-struct";
import {useScheduleHeight} from "./hooks/useScheduleHeight";
import {
    ScheduleGanttChartTableColgroup
} from "./schedule-gantt-chart-table-colgroup/schedule-gantt-chart-table-colgroup";

const ScheduleGanttChart: React.FC<ScheduleProps> = (props) => {
    const schedule = useMemo(() => new ScheduleImpl(props), [props]);

    const scheduleHeaderLeftScrollerRef = useRef<HTMLDivElement>(null);
    const scheduleHeaderRightScrollerRef = useRef<HTMLDivElement>(null);
    const scheduleBodyRightScrollerRef = useRef<HTMLDivElement>(null);
    const scheduleBodyLeftScrollerRef = useRef<HTMLDivElement>(null);

    useSyncScroll(scheduleBodyRightScrollerRef, Array.of(scheduleHeaderRightScrollerRef), SCROLL_LEFT);
    useSyncScroll(scheduleBodyRightScrollerRef, Array.of(scheduleBodyLeftScrollerRef), SCROLL_TOP);
    useSyncScroll(scheduleBodyLeftScrollerRef, Array.of(scheduleBodyRightScrollerRef), SCROLL_TOP);
    useSyncScroll(scheduleBodyLeftScrollerRef, Array.of(scheduleHeaderLeftScrollerRef), SCROLL_LEFT);

    useScheduleHeight(schedule.getScheduleMaxHeight(), schedule.getScheduleViewType());
    return (
        <div className={`schedule`}>
            <div id={`schedule-view-harness`} className={`schedule-view-harness`}>
                <div className={`schedule-view schedule-timeline`}>
                    <table role={`grid`} className={`schedule-scrollgrid schedule-scrollgrid-liquid`}>
                        <ScheduleGanttChartTableColgroup/>
                        <thead>
                        <tr role={`presentation`}
                            className={`schedule-scrollgrid-section schedule-scrollgrid-section-header`}>
                            <th role={`presentation`}>
                                <div className={`schedule-scroller-harness`}>
                                    <div className={`schedule-scroller`}
                                         style={{overflow: "hidden"}}
                                         ref={scheduleHeaderLeftScrollerRef}>
                                        <ScheduleGanttChartDatagridHeader schedule={schedule}/>
                                    </div>
                                </div>
                            </th>
                            <td role={`presentation`} className={`schedule-resource-timeline-divider`}></td>
                            <th role={`presentation`}>
                                <div className={`schedule-scroller-harness`}>
                                    <div className={`schedule-scroller`}
                                         style={{overflow: "hidden scroll"}}
                                         ref={scheduleHeaderRightScrollerRef}>
                                        <div id={`schedule-timeline-header`} className={`schedule-timeline-header`}>
                                            <ScheduleGanttChartDatagridTimeline schedule={schedule}/>
                                        </div>
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr role={`presentation`}
                            className={`schedule-scrollgrid-section schedule-scrollgrid-section-body schedule-scrollgrid-section-liquid`}>
                            <td role={`presentation`}>
                                <div className={`schedule-scroller-harness schedule-scroller-harness-liquid`}>
                                    <div className={`schedule-scroller schedule-scroller-liquid-absolute`}
                                         style={{overflow: "scroll", right: "-10px"}} ref={scheduleBodyLeftScrollerRef}>
                                        <ScheduleGanttChartDatagridBody schedule={schedule}/>
                                    </div>
                                </div>
                            </td>
                            <td role={`presentation`} className={`schedule-resource-timeline-divider`}></td>
                            <td role={`presentation`}>
                                <div className={`schedule-scroller-harness schedule-scroller-harness-liquid`}>
                                    <div className={`schedule-scroller schedule-scroller-liquid-absolute`}
                                         style={{overflow: "scroll"}} ref={scheduleBodyRightScrollerRef}>
                                        <div className={`schedule-timeline-body`}>
                                            <div id={`schedule-timeline-slots`} className={`schedule-timeline-slots`}>
                                                <ScheduleGanttChartTimelineSlots schedule={schedule}/>
                                            </div>
                                            <div className={`schedule-timeline-bg`}></div>
                                            <ScheduleGanttChartDrawingBoard schedule={schedule}/>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ScheduleGanttChart;