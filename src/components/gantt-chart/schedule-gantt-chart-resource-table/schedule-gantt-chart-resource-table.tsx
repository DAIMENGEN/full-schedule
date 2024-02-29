import React, {useCallback, useEffect, useState} from "react";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {useScheduleSelector} from "../../../core/state/schedule-hook";
import {ScheduleGanttChartView} from "../schedule-gantt-chart-view";

type Props = {
    id?: string;
    className: string;
    children: React.ReactNode;
    scheduleView: ScheduleGanttChartView;
}
export const ScheduleGanttChartResourceTable: React.FC<Props> = ({id, className, children, scheduleView}) => {
    const [resourceTableWidth, setResourceTableWidth] = useState(0);
    const getResourceTableWidth = useCallback((): number => {
        const element = document.getElementsByClassName("schedule-scrollgrid-liquid").item(0) as HTMLTableElement;
        const row = element?.rows.item(0);
        const cell = row?.cells.item(0);
        return cell ? cell.clientWidth : 0;
    }, []);
    const resourceAreaWidth = useScheduleSelector((state) => state.scheduleState.resourceAreaWidth);
    useEffect(() => {
        setResourceTableWidth(getResourceTableWidth);
        const resizeListener = (_: UIEvent) => setResourceTableWidth(getResourceTableWidth);
        window.addEventListener("resize", resizeListener);
        return () => {
            window.removeEventListener("resize", resizeListener);
        }
    }, [getResourceTableWidth, resourceAreaWidth]);
    return (
        <table role={`presentation`} id={id} className={`${className} schedule-scrollgrid-sync-table`} style={{width: ScheduleUtil.numberToPixels(resourceTableWidth)}}>
            {scheduleView.renderDatagridColgroup()}
            {children}
        </table>
    )
}