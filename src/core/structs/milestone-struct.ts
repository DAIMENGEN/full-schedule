import {DateRange} from "../datelib/date-range";
import {Dictionary, MenuArg, MenuItems, MountArg} from "../types/public-types";
import dayjs from "dayjs";
import {ResourceApi} from "./resource-struct";
import {ScheduleApi} from "./schedule-struct";
import React from "react";

export type MilestoneContextMenuItems = MenuItems;

export type MilestoneStatus = "Success" | "Failure" | "Warning";

export interface MilestoneArg {
    schedule: ScheduleApi;
    milestone: MilestoneApi;
    achieved: Boolean;
}

export type MilestoneMountArg = MountArg<MilestoneArg>;

export type MilestoneContextMenuArg = MenuArg<MilestoneArg>;

export interface Milestone {
    id: string;
    title: string;
    range: DateRange;
    status: MilestoneStatus;
    achieved: Boolean;
    resourceId: string;
    tooltip?: React.JSX.Element;
    extendedProps?: Dictionary;
}

export interface MilestoneApi {
    getId(): string;

    getTitle(): string;

    getStart(): dayjs.Dayjs;

    getEnd(): dayjs.Dayjs;

    getStatus(): MilestoneStatus;

    isAchieved(): Boolean;

    getResource(): ResourceApi | undefined;

    getTooltip(): React.JSX.Element | undefined;

    getExtendProps(): Dictionary | undefined;
}

export class MilestoneImpl implements MilestoneApi {
    id: string;
    title: string;
    range: DateRange;
    status: MilestoneStatus;
    achieved: Boolean;
    resource?: ResourceApi;
    resourceId: string;
    tooltip?: React.JSX.Element;
    extendedProps?: Dictionary;

    constructor(milestone: Milestone, resource?: ResourceApi) {
        this.id = milestone.id;
        this.resource = resource;
        this.title = milestone.title;
        this.range = milestone.range;
        this.status = milestone.status;
        this.tooltip = milestone.tooltip;
        this.achieved = milestone.achieved;
        this.resourceId = milestone.resourceId;
        this.extendedProps = milestone.extendedProps;
    }

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getStart(): dayjs.Dayjs {
        return this.range.start;
    }

    getEnd(): dayjs.Dayjs {
        return this.range.end;
    }

    getStatus(): MilestoneStatus {
        return this.status;
    }

    isAchieved(): Boolean {
        return this.achieved;
    }

    getResource(): ResourceApi | undefined {
        return this.resource;
    }

    getTooltip(): React.JSX.Element | undefined {
        return this.tooltip;
    }

    getExtendProps(): Dictionary | undefined {
        return this.extendedProps;
    }
}