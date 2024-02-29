import {ScheduleImpl} from "../../../../core/structs/schedule-struct";
import React, {useEffect, useRef} from "react";
import {Dropdown, Space} from "antd";
import {ResourceAreaColumn} from "../../../../core/structs/resource-struct";

type Props = {
    schedule: ScheduleImpl;
    showIndentation: Boolean;
    resourceAreaColumn: ResourceAreaColumn;
}
export const ScheduleGanttChartDatagridLabelCellFrame: React.FC<Props> = ({
                                                                              schedule,
                                                                              showIndentation,
                                                                              resourceAreaColumn
                                                                          }) => {
    const datagridCell = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (datagridCell.current) {
            const element = datagridCell.current;
            const label = resourceAreaColumn;
            schedule.resourceLabelDidMount({
                el: element,
                label: label
            });
            return () => {
                schedule.resourceLabelWillUnmount({
                    el: element,
                    label: label
                });
            }
        } else {
            return () => {
            }
        }
    }, [schedule, resourceAreaColumn]);
    return (
        <Dropdown disabled={!schedule.resourceLabelContextMenu()}
                  destroyPopupOnHide={true}
                  menu={{
                      items: schedule.resourceLabelContextMenuItems(),
                      onClick: (arg) => {
                          const {key, keyPath, domEvent} = arg;
                          schedule.resourceLabelContextMenuClick({
                              label: resourceAreaColumn,
                              key: key,
                              keyPath: keyPath,
                              domEvent: domEvent
                          });
                      }
                  }} trigger={["contextMenu"]}>
            <div className={`schedule-datagrid-cell-frame`} ref={datagridCell}>
                <div className={`schedule-datagrid-cell-cushion schedule-scrollgrid-sync-inner`}>
                    <Space size={"small"}>
                        {
                            showIndentation && (
                                <span className={`schedule-datagrid-expander schedule-datagrid-expander-placeholder`}>
                                    <span className={`schedule-icon`}></span>
                                </span>
                            )
                        }
                        <span className={`schedule-datagrid-cell-main`}>{resourceAreaColumn.headerContent}</span>
                    </Space>
                </div>
                <div className={`schedule-datagrid-cell-resizer`}></div>
            </div>
        </Dropdown>
    );
}