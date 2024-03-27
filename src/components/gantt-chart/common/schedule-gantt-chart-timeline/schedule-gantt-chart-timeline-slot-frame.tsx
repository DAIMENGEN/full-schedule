import React, {useEffect, useRef} from "react";
import {ScheduleApi} from "../../../../core/structs/schedule-struct";
import dayjs, {OpUnitType} from "dayjs";

type Props = {
    date: dayjs.Dayjs;
    level?: number;
    timeText?: string;
    schedule: ScheduleApi;
    classNames?: Array<string>;
}
export const ScheduleGanttChartTimelineSlotFrame:React.FC<Props> = ({date, level, timeText, schedule, classNames}) => {
    const timelineSlot = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const element = timelineSlot.current;
        if (element) {
            const viewType = schedule.getScheduleViewType();
            const dateUnit = viewType.toLowerCase() as OpUnitType;
            const isToday = date.isSame(dayjs(), dateUnit);
            const isPast = date.isBefore(dayjs(), dateUnit);
            const isFuture = date.isAfter(dayjs(), dateUnit);
            if (timeText) {
                schedule.timelineSlotLabelDidMount({
                    el: element,
                    schedule: schedule,
                    date: date,
                    level: level,
                    timeText: timeText,
                    isPast: isPast,
                    isFuture: isFuture,
                    isToday: isToday,
                    slotType: schedule.getScheduleViewType()
                });
            } else {
                schedule.timelineSlotLaneDidMount({
                    el: element,
                    schedule: schedule,
                    date: date,
                    isPast: isPast,
                    isFuture: isFuture,
                    isToday: isToday,
                    slotType: schedule.getScheduleViewType()
                });
            }
            return () => {
                if (timeText) {
                    schedule.timelineSlotLabelWillUnmount({
                        el: element,
                        schedule: schedule,
                        date: date,
                        level: level,
                        timeText: timeText,
                        isPast: isPast,
                        isFuture: isFuture,
                        isToday: isToday,
                        slotType: schedule.getScheduleViewType()
                    });
                } else {
                    schedule.timelineSlotLaneWillUnmount({
                        el: element,
                        schedule: schedule,
                        date: date,
                        isPast: isPast,
                        isFuture: isFuture,
                        isToday: isToday,
                        slotType: schedule.getScheduleViewType()
                    });
                }

            }
        } else {
            return () => {}
        }
    }, [schedule, date, level, timeText]);

    return (
        <div className={`schedule-timeline-slot-frame ${classNames?.join(" ")}`} ref={timelineSlot}>
            {timeText && <span className={`schedule-timeline-slot-cushion schedule-scrollgrid-sync-inner`}>{timeText}</span>}
        </div>
    );
}