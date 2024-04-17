import {Dictionary, MenuArg, MenuItems, MountArg} from "../types/public-types";
import {EventApi, EventImpl} from "./event-struct";
import {ScheduleApi} from "./schedule-struct";
import {MilestoneApi, MilestoneImpl} from "./milestone-struct";
import {ScheduleUtil} from "../../utils/schedule-util";
import {CheckpointApi, CheckpointImpl} from "./checkpoint-struct";

export type ResourceContextMenuItems = MenuItems;

export type ResourceAreaColumn = {
    field: string;
    headerContent: string;
}

export interface ResourceLaneArg {
    label: ResourceAreaColumn;
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

export interface Resource {
    id: string;
    title: string;
    type?: number;
    parentId?: string;
    extendedProps?: Dictionary;
}

export interface ResourceImplProps {
    depth: number;
    resource: Resource;
    parent?: ResourceImpl;
    events: Array<EventImpl>;
    children: Array<ResourceImpl>;
    milestones: Array<MilestoneImpl>;
    checkpoints: Array<CheckpointImpl>;

}

export interface ResourceApi {
    getId(): string;
    getTitle(): string;
    getDepth(): number;
    getParent(): ResourceApi | undefined;
    getChildren(): Array<ResourceApi>;
    getEvents(): Array<EventApi>;
    getMilestones(): Array<MilestoneApi>;
    getCheckpoints(): Array<CheckpointApi>;
    getExtendProps(): Dictionary | undefined;
}

export class ResourceImpl implements ResourceApi {
    id: string;
    title: string;
    parentId?: string;
    depth: number;
    parent?: ResourceImpl;
    events: Array<EventImpl>;
    milestones: Array<MilestoneImpl>;
    checkpoints: Array<CheckpointImpl>;
    extendedProps?: Dictionary;
    children: Array<ResourceImpl>;
    constructor(props: ResourceImplProps) {
        const {resource, events, milestones, checkpoints, children, depth, parent} = props;
        this.id = resource.id;
        this.title = resource.title;
        this.depth = depth;
        this.parent = parent;
        this.parentId = resource.parentId;
        this.events = events;
        this.children = children;
        this.milestones = milestones;
        this.checkpoints = checkpoints;
        this.extendedProps = resource.extendedProps;
    }

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
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

    getCheckpoints(): Array<CheckpointApi> {
        return this.checkpoints;
    }

    getExtendProps(): Dictionary | undefined {
        return this.extendedProps;
    }
}

export class ResourceImplBuilder {
    private readonly resources: Map<string, Array<Resource>>;
    private readonly events: Map<string, Array<EventImpl>>;
    private readonly milestones?: Map<string, Array<MilestoneImpl>>;
    private readonly checkpoints?: Map<string, Array<CheckpointImpl>>;

    constructor(resources: Array<Resource>, events: Array<EventImpl>, milestones?: Array<MilestoneImpl>, checkpoints?: Array<CheckpointImpl>) {
        this.resources = new Map(Object.entries(ScheduleUtil.groupArray(resources, (resource: Resource) => resource.parentId || "undefined")));
        this.events = new Map(Object.entries(ScheduleUtil.groupArray(events, (event: EventImpl) => event.resourceId)));
        this.milestones = milestones ? new Map(Object.entries(ScheduleUtil.groupArray(milestones, (milestone: MilestoneImpl) => milestone.resourceId))) : undefined;
        this.checkpoints = checkpoints ? new Map(Object.entries(ScheduleUtil.groupArray(checkpoints, (checkpoint: CheckpointImpl) => checkpoint.resourceId))) : undefined;
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
                            const node: ResourceImpl = new ResourceImpl({
                                depth: depth,
                                resource: child,
                                children: [],
                                events: this.events.get(child.id) || [],
                                milestones: this.milestones?.get(child.id) || [],
                                checkpoints: this.checkpoints?.get(child.id) || []
                            });
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