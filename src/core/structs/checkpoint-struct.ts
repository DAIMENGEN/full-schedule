import {Dictionary, MenuArg, MenuItems, MountArg} from "../types/public-types";
import {ScheduleApi} from "./schedule-struct";
import {DateRange} from "../datelib/date-range";
import React from "react";
import dayjs from "dayjs";
import {ResourceApi} from "./resource-struct";
import {TemporalState} from "../timelib/time-lib";

export type CheckpointContextMenuItems = MenuItems;

export interface CheckpointArg {
    schedule: ScheduleApi;
    checkpoint: CheckpointApi;
}

export type CheckpointMountArg = MountArg<CheckpointArg & TemporalState>;

export type CheckpointContextMenuArg = MenuArg<CheckpointArg & TemporalState>;

export interface Checkpoint {
    id: string;
    title: string;
    range: DateRange;
    resourceId: string;
    color?: string;
    tooltip?: React.JSX.Element;
    extendedProps?: Dictionary;
}

export interface CheckpointApi {
    getId(): string;

    getTitle(): string;

    getStart(): dayjs.Dayjs;

    getEnd(): dayjs.Dayjs;

    getResource(): ResourceApi | undefined;

    getColor(): string | undefined;

    getTooltip(): React.JSX.Element | undefined;

    getExtendProps(): Dictionary | undefined;
}

export class CheckpointImpl implements CheckpointApi {
    id: string;
    title: string;
    range: DateRange;
    resource?: ResourceApi;
    resourceId: string;
    color?: string;
    tooltip?: React.JSX.Element;
    extendedProps?: Dictionary;

    constructor(checkpoint: Checkpoint, resource?: ResourceApi) {
        this.id = checkpoint.id;
        this.resource = resource;
        this.title = checkpoint.title;
        this.range = checkpoint.range;
        this.color = checkpoint.color;
        this.tooltip = checkpoint.tooltip;
        this.resourceId = checkpoint.resourceId;
        this.extendedProps = checkpoint.extendedProps;
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

    getResource(): ResourceApi | undefined {
        return this.resource;
    }

    getColor(): string | undefined {
        return this.color;
    }

    getTooltip(): React.JSX.Element | undefined {
        return this.tooltip;
    }

    getExtendProps(): Dictionary | undefined {
        return this.extendedProps;
    }
}