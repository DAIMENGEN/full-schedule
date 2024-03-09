import {useCallback, useEffect, useState} from "react";
import {TimelineImpl} from "../../../../core/structs/timeline-struct";
import {useScheduleSelector} from "../../../../core/features/schedule-hook";

export const useTimelineWidth = (scheduleTimeline: TimelineImpl) => {
    const getTimelineWidth = useCallback(() => {
        const elements = document.getElementsByClassName("schedule-timeline-header");
        const element = elements.item(0) as HTMLElement;
        const table = element.getElementsByTagName("table").item(0);
        const timelineWidth = table?.offsetWidth;
        return timelineWidth ? timelineWidth : 0;
    }, []);
    const [width, setWidth] = useState(0);
    const resourceAreaWidth = useScheduleSelector(state => state.resourceState.resourceAreaWidth);
    useEffect(() => {
        setWidth(getTimelineWidth());
        const windowResizeListener = (_: UIEvent) => setWidth(getTimelineWidth());
        window.addEventListener("resize", windowResizeListener);
        return () => {
            window.removeEventListener("resize", windowResizeListener);
        }
    }, [getTimelineWidth, scheduleTimeline, resourceAreaWidth]);
    return width;
}