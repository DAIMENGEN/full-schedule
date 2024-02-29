import React, {useEffect, useRef} from "react";
import {ScheduleApi} from "../../../../core/structs/schedule-struct";
import dayjs from "dayjs";
import {ScheduleUtil} from "../../../../utils/schedule-util";

type Props = {
    date: dayjs.Dayjs;
    level?: number;
    timeText?: string;
    schedule: ScheduleApi;
    classNames?: Array<string>;
}
export const ScheduleGanttChartTimelineSlotFrame:React.FC<Props> = ({date, level, timeText, schedule, classNames}) => {
    const timelineSlot = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (timelineSlot.current) {
            const element = timelineSlot.current;
            const isToday = date.isSame(dayjs(), ScheduleUtil.getDateUnitByScheduleViewType(schedule.getScheduleViewType()));
            const isPast = date.isBefore(dayjs(), ScheduleUtil.getDateUnitByScheduleViewType(schedule.getScheduleViewType()));
            const isFuture = date.isAfter(dayjs(), ScheduleUtil.getDateUnitByScheduleViewType(schedule.getScheduleViewType()));
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