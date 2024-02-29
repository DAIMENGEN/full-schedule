import React, {useEffect, useRef} from "react";
import dayjs from "dayjs";
import {ScheduleImpl} from "../../../../core/structs/schedule-struct";
import {EventImpl} from "../../../../core/structs/event-struct";
import {Dropdown, Progress, Tooltip} from "antd";
import {ScheduleUtil} from "../../../../utils/schedule-util";

type Props = {
    event: EventImpl;
    schedule: ScheduleImpl;
}
export const ScheduleGanttChartTimelineLaneEvent: React.FC<Props> = ({event,schedule}) => {
    
    const title = event.title;
    const color = event.color;
    const start = event.range.start;
    const end = event.range.end;
    const timelineLaneEvent = useRef<HTMLDivElement>(null);

    const isPast = event.range.end.isBefore(dayjs(), "day");
    const isFuture = event.range.start.isAfter(dayjs(), "day");
    const isProcess = event.range.start.isSameOrBefore(dayjs(), "day") && (event.range.end.isAfter(dayjs(), "day") || event.range.end.isSame(dayjs(), "day"));
    
    useEffect(() => {
        if (timelineLaneEvent.current) {
            const element = timelineLaneEvent.current;
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
            <div className={`schedule-timeline-event`} style={{backgroundColor: color}} ref={timelineLaneEvent}>
                <Tooltip title={
                    <div>
                        <div style={{color: "#000000", fontSize: 18}}>
                            <div>
                                <span>{title}</span>
                            </div>
                            <div>
                                <span>start:&nbsp; {start.format("YYYY-MM-DD")}</span>
                            </div>
                            <div>
                                <span>end&nbsp;:&nbsp; {end.format("YYYY-MM-DD")}</span>
                            </div>
                        </div>
                        <Progress strokeColor={color} percent={ScheduleUtil.calculateDatePercent(start, end)} />
                    </div>
                } color={"#FFFFFF"} key={color} overlayStyle={{maxWidth: 600, minWidth: 300}}>
                    <div className={`schedule-event-main`}>
                        {title}
                    </div>
                </Tooltip>
            </div>
        </Dropdown>
    );
}