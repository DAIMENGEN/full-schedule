import React, {useEffect, useRef} from "react";
import {CheckpointImpl} from "../../../../core/structs/checkpoint-struct";
import {ScheduleImpl} from "../../../../core/structs/schedule-struct";
import {ScheduleCheckpointIconSvg} from "../../../../core/icon/svg-icon/schedule-checkpoint-icon-svg";
import {ScheduleUtil} from "../../../../utils/schedule-util";
import {Dropdown, Tooltip} from "antd";
import dayjs from "dayjs";

type Props = {
    checkpoint: CheckpointImpl;
    schedule: ScheduleImpl;
}
export const ScheduleGanttChartTimelineCheckpoint: React.FC<Props> = ({checkpoint, schedule}) => {

    const timelineCheckpoint = useRef<HTMLDivElement | null>(null);
    const checkpointColor = checkpoint.color || "#FFA500"
    const checkpointIcon = new ScheduleCheckpointIconSvg(checkpointColor, ScheduleUtil.numberToPixels(schedule.getLineHeight() * 0.6), ScheduleUtil.numberToPixels(schedule.getLineHeight() * 0.6));

    const isPast = checkpoint.range.end.isBefore(dayjs(), "day");
    const isFuture = checkpoint.range.start.isAfter(dayjs(), "day");
    const isProcess = checkpoint.range.start.isSameOrBefore(dayjs(), "day") && (checkpoint.range.end.isAfter(dayjs(), "day") || checkpoint.range.end.isSame(dayjs(), "day"));

    useEffect(() => {
        const element = timelineCheckpoint.current;
        if (element) {
            schedule.checkpointDidMount({
                el: element,
                checkpoint: checkpoint,
                schedule: schedule,
                isPast: isPast,
                isFuture: isFuture,
                isProcess: isProcess,
            });
            return () => {
                schedule.checkpointWillUnmount({
                    el: element,
                    checkpoint: checkpoint,
                    schedule: schedule,
                    isPast: isPast,
                    isFuture: isFuture,
                    isProcess: isProcess,
                });
            }
        } else {
            return () => {}
        }
    }, [checkpoint, schedule]);


    return (
        <Dropdown disabled={!schedule.checkpointContextMenu()}
                  destroyPopupOnHide={true}
                  menu={{
                      items: schedule.checkpointContextMenuItems(),
                      onClick: (arg) => {
                          const {key, keyPath, domEvent} = arg;
                          schedule.checkpointContextMenuClick({
                              schedule: schedule,
                              checkpoint: checkpoint,
                              key: key,
                              keyPath: keyPath,
                              domEvent: domEvent,
                              isPast: isPast,
                              isFuture: isFuture,
                              isProcess: isProcess,
                          });
                      }
                  }}>
            <div className={`schedule-timeline-checkpoint`} ref={timelineCheckpoint}>
                <Tooltip title={checkpoint.tooltip} color={`#ffffff`} overlayStyle={{maxWidth: 1000, minWidth: 50}}>
                    <div className={`schedule-checkpoint-main`}>
                        {checkpointIcon.render()}
                    </div>
                </Tooltip>
            </div>
        </Dropdown>
    );
}