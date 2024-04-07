import {useEffect} from "react";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {ScheduleViewType} from "../../../core/structs/schedule-view-struct";

export const useScheduleHeight = (scheduleMaxHeight: number, scheduleViewType: ScheduleViewType) => {
    useEffect(() => {
        const scheduleViewHarness = document.getElementById("schedule-view-harness");
        const scheduleDataGridBody = document.getElementById("schedule-datagrid-body");
        const scheduleTimelineHeader = document.getElementById("schedule-timeline-header");
        const bodyHeight = scheduleDataGridBody ? scheduleDataGridBody.getBoundingClientRect().height : 0;
        const headerHeight = scheduleTimelineHeader ? scheduleTimelineHeader.getBoundingClientRect().height : 0;
        const height = bodyHeight + headerHeight + 13;
        const scheduleHeight = scheduleMaxHeight - height > 0 ? height : scheduleMaxHeight;
        scheduleViewHarness && (scheduleViewHarness.style.height = ScheduleUtil.numberToPixels(scheduleHeight));
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const newHeight = entry.contentRect.height + headerHeight + 13;
                const scheduleHeight = scheduleMaxHeight - newHeight > 0 ? newHeight : scheduleMaxHeight;
                scheduleViewHarness && (scheduleViewHarness.style.height = ScheduleUtil.numberToPixels(scheduleHeight));
            }
        });
        scheduleDataGridBody && resizeObserver.observe(scheduleDataGridBody);
        return () => {
            resizeObserver.disconnect();
        }
    }, [scheduleMaxHeight, scheduleViewType]);
}