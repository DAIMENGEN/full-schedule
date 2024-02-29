import React, {useEffect, useRef} from "react";
import {ScheduleUtil} from "../../../../utils/schedule-util";

type Props = {
    resourceAreaColumns: Array<{ field: string, headerContent: string }>;
}
export const ScheduleGanttChartResourceTableColgroup: React.FC<Props> = (props) => {
    const {resourceAreaColumns} = props;

    const resizerIndex = useRef<number>(0);
    const colgroupRef = useRef<HTMLTableColElement>(null);

    useEffect(() => {
        const resizers = document.getElementsByClassName("schedule-datagrid-cell-resizer");
        const mousedownListener = (index: number) => (_: Event) => colgroupRef.current && (resizerIndex.current = index + 1);
        const mouseupListener = (_: Event) => resizerIndex.current && (resizerIndex.current = 0);
        const mousedownListeners: EventListenerOrEventListenerObject[] = [];
        const colgroup = colgroupRef.current;
        const cols = colgroup?.children;
        const mousemoveListener = (event: MouseEvent) => {
            const current = resizerIndex.current;
            if (current && cols) {
                const index = current - 1;
                const col = cols[index] as HTMLTableColElement;
                const offset = event.clientX - col.offsetLeft;
                col.style.width = ScheduleUtil.numberToPixels(offset);
            }
        }
        for (let i = 0; i < resizers.length - 1; i++) {
            const resizer = resizers[i];
            const listener = mousedownListener(i);
            mousedownListeners.push(listener);
            resizer.addEventListener("mousedown", listener);
            resizer.addEventListener("mouseup", mouseupListener);
        }
        document.addEventListener("mousemove", mousemoveListener);
        document.addEventListener("mouseup", mouseupListener);

        return () => {
            for (let i = 0; i < resizers.length; i++) {
                const resizer = resizers[i];
                resizer.removeEventListener("mousedown", mousedownListeners[i]);
                resizer.removeEventListener("mouseup", mouseupListener);
            }
            document.removeEventListener("mousemove", mousemoveListener);
            document.removeEventListener("mouseup", mouseupListener);
        }
    }, [resourceAreaColumns]);

    if (resourceAreaColumns.length === 0) {
        return (
            <colgroup ref={colgroupRef}>
                <col/>
            </colgroup>
        )
    } else {
        const cols = resourceAreaColumns.map(column => <col key={column.field} style={{minWidth: "100px"}} />)
        return (
            <colgroup ref={colgroupRef}>
                {cols}
            </colgroup>
        )
    }
}