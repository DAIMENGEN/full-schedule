import React, {useEffect, useRef} from "react";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {useScheduleDispatch, useScheduleSelector} from "../../../core/features/schedule-hook";
import {changeResourceAreaWidth} from "../../../core/features/resource/resource-slice";

export const ScheduleGanttChartTableColgroup = () => {
    const resourceAreaWidth = useScheduleSelector(state => state.resourceState.resourceAreaWidth);
    const isResizing = useRef<boolean>(false);
    const colRef = useRef<HTMLTableColElement | null>(null)
    const scheduleDispatch = useScheduleDispatch();
    useEffect(() => {
        const dividers = document.getElementsByClassName("schedule-resource-timeline-divider");
        const mousedownListener = (_: Event) => colRef.current && (isResizing.current = true);
        const mouseupListener = (_: Event) => isResizing.current = false;
        const mousemoveListener = (event: MouseEvent) => {
            const col = colRef.current;
            if (col && isResizing.current) {
                const offset = event.clientX - col.offsetLeft;
                col.style.width = ScheduleUtil.numberToPixels(offset);
                scheduleDispatch(changeResourceAreaWidth(ScheduleUtil.numberToPixels(offset)));
            }
        }
        for (let i = 0; i < dividers.length; i++) {
            dividers[i].addEventListener("mousedown", mousedownListener);
            dividers[i].addEventListener("mouseup", mouseupListener);
        }
        document.addEventListener("mousemove", mousemoveListener);
        document.addEventListener("mouseup", mouseupListener);
        return () => {
            for (let i = 0; i < dividers.length; i++) {
                dividers[i].removeEventListener("mousedown", mousedownListener);
                dividers[i].removeEventListener("mouseup", mouseupListener);
            }
            document.removeEventListener("mousemove", mousemoveListener);
            document.removeEventListener("mouseup", mouseupListener);
        }
    }, [scheduleDispatch]);
    return (
        <colgroup>
            <col style={{width: resourceAreaWidth}} ref={colRef}/>
            <col/>
            <col/>
        </colgroup>
    )
}