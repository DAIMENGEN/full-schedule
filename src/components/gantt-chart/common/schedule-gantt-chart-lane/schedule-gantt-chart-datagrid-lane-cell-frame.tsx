import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {ScheduleImpl} from "../../../../core/structs/schedule-struct";
import {useScheduleDispatch, useScheduleSelector} from "../../../../core/features/schedule-hook";
import {ScheduleUtil} from "../../../../utils/schedule-util";
import {Dropdown, Space} from "antd";
import {Resource, ResourceAreaColumn, ResourceImpl, ResourceType} from "../../../../core/structs/resource-struct";
import {MinusSquareOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {ScheduleMilestoneIconSvg} from "../../../../core/icon/svg-icon/schedule-milestone-icon-svg";
import {ScheduleRecurringIconSvg} from "../../../../core/icon/svg-icon/schedule-recurring-icon-svg";
import {collapseResource, expandedResource} from "../../../../core/features/resource/resource-slice";

type Props = {
    schedule: ScheduleImpl;
    showButton: Boolean;
    showIndentation: Boolean;
    currentResource: ResourceImpl;
    resourceAreaColumn: ResourceAreaColumn;
}
export const ScheduleGanttChartDatagridLaneCellFrame: React.FC<Props> = ({
                                                                             schedule,
                                                                             showButton,
                                                                             showIndentation = true,
                                                                             currentResource,
                                                                             resourceAreaColumn
                                                                         }) => {
    const datagridCell = useRef<HTMLDivElement>(null);
    const collapseResourceIds = useScheduleSelector((state) => state.resourceState.collapseIds);
    const scheduleDispatch = useScheduleDispatch();
    const getResourceColumnValue = (column: string, resource: Resource): string | number | undefined => {
        const properties = Object.keys(resource);
        if (properties.includes(column)) {
            const property = column as keyof Resource;
            return property !== "extendedProps" ? resource[property] : undefined
        } else {
            const extendedProps = resource.extendedProps;
            return extendedProps ? extendedProps[column] : undefined;
        }
    }
    const lineHeight = currentResource.getMilestones().length > 0 ? schedule.getLineHeight() * 1.5 : schedule.getLineHeight();
    const milestone = useMemo(() => new ScheduleMilestoneIconSvg(), []);
    const recurring = useMemo(() => new ScheduleRecurringIconSvg(), []);
    const renderResourceType = useCallback((resource: ResourceImpl) => {
        if (resource.milestones.length > 0) return milestone.render();
        // TODO MILESTONE 和 CHECKPOINT 需要从 ResourceType 中移除或删除。
        switch (resource.type) {
            // case ResourceType.MILESTONE:
            // return milestone.render();
            // case ResourceType.CHECKPOINT:
            //     return checkpoint.render();
            case ResourceType.RECURRING:
                return recurring.render();
            case ResourceType.ROUTINE:
                return <></>;
            default:
                return <></>;
        }
    }, [milestone, recurring]);

    useEffect(() => {
        if (datagridCell.current) {
            const element = datagridCell.current;
            const resource = currentResource;
            schedule.resourceLaneDidMount({
                el: element,
                resource: resource,
                schedule: schedule,
            });
            return () => {
                schedule.resourceLaneWillUnmount({
                    el: element,
                    resource: resource,
                    schedule: schedule,
                });
            }
        } else {
            return () => {
            }
        }
    }, [schedule, currentResource]);

    return (
        <Dropdown disabled={!schedule.resourceLaneContextMenu()}
                  destroyPopupOnHide={true}
                  menu={{
                      items: schedule.resourceLaneContextMenuItems(),
                      onClick: (arg) => {
                          const {key, keyPath, domEvent} = arg;
                          schedule.resourceLaneContextMenuClick({
                              schedule: schedule,
                              resource: currentResource,
                              key: key,
                              keyPath: keyPath,
                              domEvent: domEvent
                          });
                      }
                  }} trigger={["contextMenu"]}>
            <div className={`schedule-datagrid-cell-frame`}
                 style={{height: ScheduleUtil.numberToPixels(lineHeight)}} ref={datagridCell}>
                <div className={`schedule-datagrid-cell-cushion schedule-scrollgrid-sync-inner`}>
                    <Space size={"small"}>
                        {
                            showButton && (
                                <span className={`schedule-datagrid-expander schedule-datagrid-expander-placeholder`}>
                                {
                                    showIndentation && Array.from({length: currentResource.depth}, (_, index) => <span
                                        key={index + 1} className={`schedule-icon`}/>)
                                }
                                    <span className={`schedule-icon`}>
                                    {
                                        collapseResourceIds.some((resourceId: string) => resourceId === currentResource.id) ?
                                            <PlusSquareOutlined
                                                onClick={() => scheduleDispatch(expandedResource(currentResource.id))}/> :
                                            currentResource.children.length > 0 ? <MinusSquareOutlined
                                                onClick={() => scheduleDispatch(collapseResource(currentResource.id))}/> : ""
                                    }
                                </span>
                            </span>
                            )
                        }
                        <span
                            className={`schedule-datagrid-cell-main`}>{getResourceColumnValue(resourceAreaColumn.field, currentResource)}</span>
                        {
                            showButton && <span
                                title={ScheduleUtil.capitalizeFirstLetter(ResourceType[currentResource.type])}>{renderResourceType(currentResource)}</span>
                        }
                    </Space>
                </div>
            </div>
        </Dropdown>
    );
}