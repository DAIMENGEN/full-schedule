import {Event, EventApi, EventContextMenuArg, EventContextMenuItems, EventImpl, EventMountArg} from "./event-struct";
import {
    Resource,
    ResourceApi,
    ResourceAreaColumn,
    ResourceContextMenuItems,
    ResourceImpl,
    ResourceImplBuilder,
    ResourceLabelContextMenuArg,
    ResourceLabelMountArg,
    ResourceLaneContextMenuArg,
    ResourceLaneMountArg
} from "./resource-struct";
import dayjs from "dayjs";
import {ContextMenuClickHandler, DidMountHandler, WillUnmountHandler} from "../types/public-types";
import {TimelineApi, TimelineImpl, TimelineSlotLabelMountArg, TimelineSlotLaneMountArg} from "./timeline-struct";
import {ScheduleUtil} from "../../utils/schedule-util";
import {ScheduleViewType} from "./schedule-view-struct";
import {
    Milestone,
    MilestoneApi,
    MilestoneContextMenuArg,
    MilestoneContextMenuItems,
    MilestoneImpl,
    MilestoneMountArg
} from "./milestone-struct";
import {
    Checkpoint,
    CheckpointApi,
    CheckpointContextMenuArg,
    CheckpointContextMenuItems,
    CheckpointImpl,
    CheckpointMountArg
} from "./checkpoint-struct";

export type ScheduleProps = {
    end: dayjs.Dayjs;
    start: dayjs.Dayjs;
    lineHeight: number;
    slotMinWidth: number;
    scheduleMaxHeight: number;
    scheduleViewType: ScheduleViewType;
    events: Array<Event>;
    resources: Array<Resource>;
    milestones?: Array<Milestone>;
    checkpoints?: Array<Checkpoint>;
    companyHolidays?: Array<dayjs.Dayjs>;
    specialWorkdays?: Array<dayjs.Dayjs>;
    nationalHolidays?: Array<dayjs.Dayjs>;
    eventContextMenu?: boolean;
    milestoneContextMenu?: boolean;
    checkpointContextMenu?: boolean;
    resourceLaneContextMenu?: boolean;
    resourceLabelContextMenu?: boolean;
    resourceAreaColumns?: Array<ResourceAreaColumn>;
    milestoneContextMenuClick?: ContextMenuClickHandler<MilestoneContextMenuArg>;
    milestoneContextMenuItems?: MilestoneContextMenuItems;
    milestoneDidMount?: DidMountHandler<MilestoneMountArg>;
    milestoneWillUnmount?: WillUnmountHandler<MilestoneMountArg>;
    checkpointContextMenuClick?: ContextMenuClickHandler<CheckpointContextMenuArg>;
    checkpointContextMenuItems?: CheckpointContextMenuItems;
    checkpointDidMount?: DidMountHandler<CheckpointMountArg>;
    checkpointWillUnmount?: WillUnmountHandler<CheckpointMountArg>;
    eventContextMenuClick?: ContextMenuClickHandler<EventContextMenuArg>;
    eventContextMenuItems?: EventContextMenuItems;
    eventDidMount?: DidMountHandler<EventMountArg>;
    eventWillUnmount?: WillUnmountHandler<EventMountArg>;
    resourceLabelContextMenuClick?: ContextMenuClickHandler<ResourceLabelContextMenuArg>;
    resourceLabelContextMenuItems?: ResourceContextMenuItems;
    resourceLabelDidMount?: DidMountHandler<ResourceLabelMountArg>;
    resourceLabelWillUnmount?: WillUnmountHandler<ResourceLabelMountArg>;
    resourceLaneContextMenuClick?: ContextMenuClickHandler<ResourceLaneContextMenuArg>;
    resourceLaneContextMenuItems?: ResourceContextMenuItems;
    resourceLaneDidMount?: DidMountHandler<ResourceLaneMountArg>;
    resourceLaneWillUnmount?: WillUnmountHandler<ResourceLaneMountArg>;
    timelineSlotLabelDidMount?: DidMountHandler<TimelineSlotLabelMountArg>;
    timelineSlotLabelWillUnmount?: WillUnmountHandler<TimelineSlotLabelMountArg>;
    timelineSlotLaneDidMount?: DidMountHandler<TimelineSlotLaneMountArg>;
    timelineSlotLaneWillUnmount?: WillUnmountHandler<TimelineSlotLaneMountArg>;
}

export interface ScheduleApi {
    getStart(): dayjs.Dayjs;

    getEnd(): dayjs.Dayjs;

    getEvents(): Array<EventApi>;

    getEventId(id: string): EventApi | undefined;

    getResources(): Array<ResourceApi>;

    getResourcesTree(): Array<ResourceApi>;

    getResourceById(resourceId: string): ResourceApi | undefined;

    getMilestones(): Array<MilestoneApi>;

    getCheckpoints(): Array<CheckpointApi>;

    getTimeline(): TimelineApi;

    getLineHeight(): number;

    getSlotMinWidth(): number;

    getScheduleMaxHeight(): number;

    getScheduleProps(): ScheduleProps;

    getScheduleViewType(): ScheduleViewType;

    getResourceAreaColumns(): Array<ResourceAreaColumn>;

    milestoneDidMount(arg: MilestoneMountArg): void;

    milestoneWillUnmount(arg: MilestoneMountArg): void;

    checkpointDidMount(arg: CheckpointMountArg): void;

    checkpointWillUnmount(arg: CheckpointMountArg): void;

    eventDidMount(arg: EventMountArg): void;

    eventWillUnmount(arg: EventMountArg): void;

    resourceLaneDidMount(arg: ResourceLaneMountArg): void;

    resourceLaneWillUnmount(arg: ResourceLaneMountArg): void;

    resourceLabelDidMount(arg: ResourceLabelMountArg): void;

    resourceLabelWillUnmount(arg: ResourceLabelMountArg): void;

    timelineSlotLaneDidMount(arg: TimelineSlotLaneMountArg): void;

    timelineSlotLaneWillUnmount(arg: TimelineSlotLaneMountArg): void;

    timelineSlotLabelDidMount(arg: TimelineSlotLabelMountArg): void;

    timelineSlotLabelWillUnmount(arg: TimelineSlotLabelMountArg): void;
}

export class ScheduleImpl implements ScheduleApi {
    private readonly scheduleProps: ScheduleProps;
    private readonly lineHeight: number;
    private readonly slotMinWidth: number;
    private readonly scheduleMaxHeight: number;
    private readonly timeline: TimelineImpl;
    private readonly resourceAreaColumns: Array<ResourceAreaColumn>;
    private readonly events: Array<EventImpl>;
    private readonly resources: Array<ResourceImpl>;
    private readonly milestones: Array<MilestoneImpl>;
    private readonly checkpoints: Array<CheckpointImpl>;
    private readonly resourcesTree: Array<ResourceImpl>;
    private readonly scheduleViewType: ScheduleViewType;

    constructor(props: ScheduleProps) {
        const {
            start, end, resources, events, milestones, checkpoints, lineHeight, slotMinWidth, scheduleMaxHeight, scheduleViewType,
            specialWorkdays, companyHolidays, nationalHolidays, resourceAreaColumns
        } = props;
        this.scheduleProps = props;
        this.events = events.map(event => new EventImpl(event));
        this.milestones = milestones?.map(milestone => new MilestoneImpl(milestone)) || [];
        this.checkpoints = checkpoints?.map(checkpoint => new CheckpointImpl(checkpoint)) || [];
        this.timeline = new TimelineImpl({start, end, specialWorkdays, companyHolidays, nationalHolidays});
        const resourceImplBuilder = new ResourceImplBuilder(resources, this.events, this.milestones, this.checkpoints);
        this.resourcesTree = resourceImplBuilder.builderTree();
        this.resources = ScheduleUtil.flatMapResources(this.resourcesTree);
        this.events.forEach(event => event.resource = this.resources.find(r => r.id === event.resourceId));
        this.milestones.filter(milestone => milestone.resource = this.resources.find(r => r.id === milestone.resourceId));
        this.lineHeight = lineHeight;
        this.slotMinWidth = slotMinWidth;
        this.scheduleViewType = scheduleViewType;
        this.scheduleMaxHeight = scheduleMaxHeight;
        this.resourceAreaColumns = (resourceAreaColumns && resourceAreaColumns.length > 0) ? resourceAreaColumns : [{
            field: "title",
            headerContent: "Resource"
        }];
    }

    public getStart(): dayjs.Dayjs {
        return this.timeline.getStart();
    }

    public getEnd(): dayjs.Dayjs {
        return this.timeline.getEnd();
    }

    public getEvents(): Array<EventImpl> {
        return this.events;
    }

    public getEventId(id: string): EventImpl | undefined {
        return this.events.find(event => event.id === id);
    }

    public getResources(): Array<ResourceImpl> {
        return this.resources;
    }

    public getResourcesTree(): Array<ResourceImpl> {
        return this.resourcesTree;
    }

    public getResourceById(id: string): ResourceImpl | undefined {
        return this.resources.find(resource => resource.id === id);
    }

    public getMilestones(): Array<MilestoneApi> {
        return this.milestones;
    }

    public getCheckpoints(): Array<CheckpointApi> {
        return this.checkpoints;
    }

    public getTimeline(): TimelineImpl {
        return this.timeline;
    }

    public getLineHeight(): number {
        return this.lineHeight;
    }

    public getSlotMinWidth(): number {
        return this.slotMinWidth;
    }

    public getScheduleMaxHeight(): number {
        return this.scheduleMaxHeight;
    }

    public getScheduleProps(): ScheduleProps {
        return this.scheduleProps;
    }

    public getScheduleViewType(): ScheduleViewType {
        return this.scheduleViewType;
    }

    public getResourceAreaColumns(): Array<ResourceAreaColumn> {
        return this.resourceAreaColumns;
    }

    public milestoneContextMenu() {
        const enable = this.scheduleProps.milestoneContextMenu;
        return enable as boolean;
    }

    public milestoneContextMenuItems() {
        return this.scheduleProps.milestoneContextMenuItems;
    }

    public milestoneContextMenuClick(arg: MilestoneContextMenuArg) {
        const milestoneContextMenuClick = this.scheduleProps.milestoneContextMenuClick;
        milestoneContextMenuClick && milestoneContextMenuClick(arg)
    }

    public milestoneDidMount(arg: MilestoneMountArg) {
        const milestoneDidMount = this.scheduleProps.milestoneDidMount;
        milestoneDidMount && milestoneDidMount(arg);
    }

    public milestoneWillUnmount(arg: MilestoneMountArg) {
        const milestoneWillUnmount = this.scheduleProps.milestoneWillUnmount;
        milestoneWillUnmount && milestoneWillUnmount(arg);
    }

    public checkpointContextMenu() {
        const enable = this.scheduleProps.checkpointContextMenu;
        return enable as boolean;
    }

    public checkpointContextMenuItems() {
        return this.scheduleProps.checkpointContextMenuItems;
    }

    public checkpointContextMenuClick(arg: CheckpointContextMenuArg) {
        const checkpointContextMenuClick = this.scheduleProps.checkpointContextMenuClick;
        checkpointContextMenuClick && checkpointContextMenuClick(arg);
    }

    public checkpointDidMount(arg: CheckpointMountArg) {
        const checkpointDidMount = this.scheduleProps.checkpointDidMount;
        checkpointDidMount && checkpointDidMount(arg);
    }

    public checkpointWillUnmount(arg: CheckpointMountArg) {
        const checkpointWillUnmount = this.scheduleProps.checkpointWillUnmount;
        checkpointWillUnmount && checkpointWillUnmount(arg);
    }

    public eventContextMenu() {
        const enable = this.scheduleProps.eventContextMenu;
        return enable as boolean;
    }

    public eventContextMenuItems() {
        return this.scheduleProps.eventContextMenuItems;
    }

    public eventContextMenuClick(arg: EventContextMenuArg) {
        const eventContextMenuClick = this.scheduleProps.eventContextMenuClick;
        eventContextMenuClick && eventContextMenuClick(arg);
    }

    public eventDidMount(arg: EventMountArg) {
        const eventDidMount = this.scheduleProps.eventDidMount;
        eventDidMount && eventDidMount(arg);
    }

    public eventWillUnmount(arg: EventMountArg) {
        const eventWillUnmount = this.scheduleProps.eventWillUnmount;
        eventWillUnmount && eventWillUnmount(arg);
    }

    public resourceLaneContextMenu() {
        const enable = this.scheduleProps.resourceLaneContextMenu;
        return enable as boolean;
    }

    public resourceLaneContextMenuItems() {
        return this.scheduleProps.resourceLaneContextMenuItems;
    }

    public resourceLaneContextMenuClick(arg: ResourceLaneContextMenuArg) {
        const resourceContextMenuClick = this.scheduleProps.resourceLaneContextMenuClick;
        resourceContextMenuClick && resourceContextMenuClick(arg);
    }

    public resourceLaneDidMount(arg: ResourceLaneMountArg) {
        const resourceLaneDidMount = this.scheduleProps.resourceLaneDidMount;
        resourceLaneDidMount && resourceLaneDidMount(arg);
    }

    public resourceLaneWillUnmount(arg: ResourceLaneMountArg) {
        const resourceLaneWillUnmount = this.scheduleProps.resourceLaneWillUnmount;
        resourceLaneWillUnmount && resourceLaneWillUnmount(arg);
    }

    public resourceLabelContextMenu() {
        const enable = this.scheduleProps.resourceLabelContextMenu;
        return enable as boolean;
    }

    public resourceLabelContextMenuItems() {
        return this.scheduleProps.resourceLabelContextMenuItems;
    }

    public resourceLabelContextMenuClick(arg: ResourceLabelContextMenuArg) {
        const resourceLabelContextMenuClick = this.scheduleProps.resourceLabelContextMenuClick;
        resourceLabelContextMenuClick && resourceLabelContextMenuClick(arg);
    }

    public resourceLabelDidMount(arg: ResourceLabelMountArg) {
        const resourceLabelDidMount = this.scheduleProps.resourceLabelDidMount;
        resourceLabelDidMount && resourceLabelDidMount(arg);
    }

    public resourceLabelWillUnmount(arg: ResourceLabelMountArg) {
        const resourceLabelWillUnmount = this.scheduleProps.resourceLabelWillUnmount;
        resourceLabelWillUnmount && resourceLabelWillUnmount(arg);
    }

    public timelineSlotLaneDidMount(arg: TimelineSlotLaneMountArg) {
        const timelineSlotLaneDidMount = this.scheduleProps.timelineSlotLaneDidMount;
        timelineSlotLaneDidMount && timelineSlotLaneDidMount(arg);
    }

    public timelineSlotLaneWillUnmount(arg: TimelineSlotLaneMountArg) {
        const timelineSlotLaneWillUnmount = this.scheduleProps.timelineSlotLaneWillUnmount;
        timelineSlotLaneWillUnmount && timelineSlotLaneWillUnmount(arg);
    }

    public timelineSlotLabelDidMount(arg: TimelineSlotLabelMountArg) {
        const timelineSlotLabelDidMount = this.scheduleProps.timelineSlotLabelDidMount;
        timelineSlotLabelDidMount && timelineSlotLabelDidMount(arg);
    }

    public timelineSlotLabelWillUnmount(arg: TimelineSlotLabelMountArg) {
        const timelineSlotLabelWillUnmount = this.scheduleProps.timelineSlotLabelWillUnmount;
        timelineSlotLabelWillUnmount && timelineSlotLabelWillUnmount(arg);
    }
}