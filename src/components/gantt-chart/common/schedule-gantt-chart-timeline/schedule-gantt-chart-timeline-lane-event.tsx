import React, {useEffect, useRef} from "react";
import dayjs from "dayjs";
import {ScheduleImpl} from "../../../../core/structs/schedule-struct";
import {EventImpl} from "../../../../core/structs/event-struct";
import {Dropdown, Tooltip} from "antd";

type Props = {
    event: EventImpl;
    schedule: ScheduleImpl;
}
export const ScheduleGanttChartTimelineLaneEvent: React.FC<Props> = ({event,schedule}) => {

    const timelineLaneEvent = useRef<HTMLDivElement | null>(null);
    const isPast = event.range.end.isBefore(dayjs(), "day");
    const isFuture = event.range.start.isAfter(dayjs(), "day");
    const isProcess = event.range.start.isSameOrBefore(dayjs(), "day") && (event.range.end.isAfter(dayjs(), "day") || event.range.end.isSame(dayjs(), "day"));
    
    useEffect(() => {
        const element = timelineLaneEvent.current;
        if (element) {
            schedule.eventDidMount({
                el: element,
                event: event,
                isPast: isPast,
                isFuture: isFuture,
                isProcess: isProcess,
                schedule: schedule,
            });
            return () => {
                schedule.eventWillUnmount({
                    el: element,
                    event: event,
                    isPast: isPast,
                    isFuture: isFuture,
                    isProcess: isProcess,
                    schedule: schedule,
                });
            }
        } else {
            return () => {}
        }
    }, [schedule, event, isPast, isFuture, isProcess]);

    return (
        <Dropdown disabled={!schedule.eventContextMenu()}
                  destroyPopupOnHide={true}
                  menu={{
                      items: schedule.eventContextMenuItems(),
                      onClick: (arg) => {
                          const {key, keyPath, domEvent} = arg;
                          schedule.eventContextMenuClick({
                              schedule: schedule,
                              event: event,
                              isPast: isPast,
                              isFuture: isFuture,
                              isProcess: isProcess,
                              key: key,
                              keyPath: keyPath,
                              domEvent: domEvent
                          });
                      }
                  }} trigger={["contextMenu"]}>
            <div className={`schedule-timeline-event`} style={{backgroundColor: event.color}} ref={timelineLaneEvent}>
                <Tooltip title={event.tooltip} color={"#ffffff"} overlayStyle={{maxWidth: 1000, minWidth: 300}}>
                    <div className={`schedule-event-main`}>
                        {event.title}
                    </div>
                </Tooltip>
            </div>
        </Dropdown>
    );
}