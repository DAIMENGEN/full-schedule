import {Dictionary, MenuArg, MenuItems, MountArg} from "../types/public-types";
import {EventApi, EventImpl} from "./event-struct";
import {ScheduleApi} from "./schedule-struct";
import {MilestoneImpl} from "./milestone-struct";
import {ScheduleUtil} from "../../utils/schedule-util";

export type ResourceContextMenuItems = MenuItems;

export type ResourceAreaColumn = {
    field: string;
    headerContent: string;
}

export interface ResourceLaneArg {
    schedule: ScheduleApi;
    resource: ResourceApi;
}

export interface ResourceLabelArg {
    label: ResourceAreaColumn;
}

export type ResourceLaneMountArg = MountArg<ResourceLaneArg>;

export type ResourceLabelMountArg = MountArg<ResourceLabelArg>;

export type ResourceLaneContextMenuArg = MenuArg<ResourceLaneArg>;

export type ResourceLabelContextMenuArg = MenuArg<ResourceLabelArg>;

export enum ResourceType {
    MILESTONE = 1,
    CHECKPOINT = 2,
    RECURRING = 3,
    ROUTINE = 4,
}

export interface Resource {
    id: string;
    title: string;
    type?: number;
    parentId?: string;
    extendedProps?: Dictionary;
}

export interface ResourceApi {
    getId(): string;
    getTitle(): string;
    getType(): ResourceType;
    getDepth(): number;
    getParent(): ResourceApi | undefined;
    getChildren(): Array<ResourceApi>;
    getEvents(): Array<EventApi>;
    getMilestones(): Array<MilestoneImpl>;
    getExtendProps(): Dictionary | undefined;
}

export class ResourceImpl implements ResourceApi {
    id: string;
    title: string;
    type: ResourceType;
    parentId?: string;
    depth: number;
    parent?: ResourceImpl;
    events: Array<EventImpl>;
    milestones: Array<MilestoneImpl>;
    extendedProps?: Dictionary;
    children: Array<ResourceImpl>;
    constructor(resource: Resource, events: Array<EventImpl>, milestones: Array<MilestoneImpl>, children: Array<ResourceImpl>, depth: number, parent?: ResourceImpl) {
        this.id = resource.id;
        this.title = resource.title;
        this.depth = depth;
        this.parent = parent;
        this.parentId = resource.parentId;
        this.events = events;
        this.children = children;
        this.milestones = milestones;
        this.extendedProps = resource.extendedProps;
        switch (resource.type) {
            case 1:
                this.type = ResourceType.MILESTONE;
                break;
            case 2:
                this.type = ResourceType.CHECKPOINT;
                break;
            case 3:
                this.type = ResourceType.RECURRING;
                break;
            case 4:
                this.type = ResourceType.ROUTINE;
                break;
            default:
                this.type = ResourceType.ROUTINE;
                break;
        }
    }

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getType(): ResourceType {
        return this.type;
    }

    getDepth(): number {
        return this.depth;
    }

    getParent(): ResourceApi | undefined {
        return this.parent;
    }

    getChildren(): Array<ResourceApi> {
        return this.children;
    }

    getEvents(): Array<EventApi> {
        return this.events;
    }

    getMilestones(): Array<MilestoneImpl> {
        return this.milestones;
    }

    getExtendProps(): Dictionary | undefined {
        return this.extendedProps;
    }
}

export class ResourceImplBuilder {
    private readonly resources: Map<string, Array<Resource>>;
    private readonly events: Map<string, Array<EventImpl>>;
    private readonly milestones?: Map<string, Array<MilestoneImpl>>;

    constructor(resources: Array<Resource>, events: Array<EventImpl>, milestones?: Array<MilestoneImpl>) {
        this.resources = new Map(Object.entries(ScheduleUtil.groupArray(resources, (resource) => resource.parentId || "undefined")));
        this.events = new Map(Object.entries(ScheduleUtil.groupArray(events, (event) => event.resourceId)));
        this.milestones = milestones ? new Map(Object.entries(ScheduleUtil.groupArray(milestones, (milestone) => milestone.resourceId))) : undefined;
    }

    builderTree(): Array<ResourceImpl> {
        const rootId = "undefined";
        const stack = [{parentId: rootId, depth: 0}];
        const resourceNodes = new Map<string, ResourceImpl>();
        const childrenNodes = new Map<string, Array<ResourceImpl>>();
        while (stack.length > 0) {
            const current = stack.pop();
            if (current) {
                const {parentId, depth} = current;
                const children = this.resources.get(parentId);
                if (children) {
                    children.sort((prev, next) => (prev.extendedProps?.order || 0) - (next.extendedProps?.order || 0))
                        .forEach(child => {
                            const node: ResourceImpl = new ResourceImpl(
                                child,
                                this.events.get(child.id) || [],
                                this.milestones?.get(child.id) || [],
                                [],
                                depth
                            );
                            !childrenNodes.has(parentId) && childrenNodes.set(parentId, []);
                            childrenNodes.get(parentId)?.push(node);
                            resourceNodes.set(child.id, node);
                            stack.push({parentId: child.id, depth: depth + 1});
                        });
                }
            }
        }
        resourceNodes.forEach(node => {
            if (node.parentId) {
                const parent = resourceNodes.get(node.parentId);
                node.parent = parent;
                parent?.children.push(node);
            }
        });
        return childrenNodes.get(rootId) || [];
    }
}