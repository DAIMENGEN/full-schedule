import React, {useEffect, useRef} from "react";
import {MilestoneImpl} from "../../../../core/structs/milestone-struct";
import {ScheduleImpl} from "../../../../core/structs/schedule-struct";
import {Dropdown, Tooltip} from "antd";
import {ScheduleUtil} from "../../../../utils/schedule-util";
import {ScheduleFlagIconSvg} from "../../../../core/icon/svg-icon/schedule-flag-icon-svg";

type Props = {
    milestone: MilestoneImpl;
    schedule: ScheduleImpl;
}
export const ScheduleGanttChartTimelineMilestone: React.FC<Props> = ({milestone, schedule}) => {

    const timelineMilestone = useRef<HTMLDivElement>(null);
    const status = milestone.status;
    const tooltip = milestone.tooltip || milestone.title;
    const milestoneColor = status === "Success" ? "#00B050" : (status === "Failure" ? "#FF0000" : (status === "Warning" ? "#FFC000" : "#91003c"));
    const flag02Icon = new ScheduleFlagIconSvg(milestoneColor, ScheduleUtil.numberToPixels(schedule.getLineHeight() * 0.7), ScheduleUtil.numberToPixels(schedule.getLineHeight() * 0.7));

    useEffect(() => {
        const element = timelineMilestone.current;
        if (element) {
            schedule.milestoneDidMount({
                el: element,
                milestone: milestone,
                achieved: milestone.achieved,
                schedule: schedule
            });
            return () => {
                schedule.milestoneWillUnmount({
                    el: element,
                    milestone: milestone,
                    achieved: milestone.achieved,
                    schedule: schedule
                });
            }
        } else {
            return () => {}
        }
    }, [milestone, schedule]);

    return (
        <Dropdown disabled={!schedule.milestoneContextMenu()}
                  destroyPopupOnHide={true}
                  menu={{
                      items: schedule.milestoneContextMenuItems(),
                      onClick: (arg) => {
                          const {key, keyPath, domEvent} = arg;
                          schedule.milestoneContextMenuClick({
                              schedule: schedule,
                              milestone: milestone,
                              achieved: milestone.isAchieved(),
                              key: key,
                              keyPath: keyPath,
                              domEvent: domEvent,
                          });
                      }
                  }} trigger={["contextMenu"]}>
            <div className={`schedule-timeline-milestone`} ref={timelineMilestone}>
                <Tooltip title={tooltip} color={`#ffffff`} overlayStyle={{maxWidth: 1000, minWidth: 50}}>
                    <div className={`schedule-milestone-main`}>
                        {flag02Icon.render()}
                    </div>
                </Tooltip>
            </div>
        </Dropdown>
    )
}