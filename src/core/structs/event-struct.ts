import {DateRange} from "../datelib/date-range";
import {Dictionary, MenuArg, MenuItems, MountArg} from "../types/public-types";
import dayjs from "dayjs";
import {ResourceApi} from "./resource-struct";
import {ScheduleApi} from "./schedule-struct";
import {TemporalState} from "../timelib/time-lib";
import React from "react";

export type EventContextMenuItems = MenuItems;

export interface EventArg {
    schedule: ScheduleApi,
    event: EventApi;
}

export type EventMountArg = MountArg<EventArg & TemporalState>;

export type EventContextMenuArg = MenuArg<EventArg & TemporalState>;

export interface Event {
    id: string;
    title: string;
    color: string
    range: DateRange;
    resourceId: string;
    tooltip?: React.JSX.Element;
    extendedProps?: Dictionary;
}

export interface EventApi {
    getId(): string;

    getTitle(): string;

    getColor(): string;

    getStart(): dayjs.Dayjs;

    getEnd(): dayjs.Dayjs;

    getResource(): ResourceApi | undefined;

    getTooltip(): React.JSX.Element | undefined;

    getExtendProps(): Dictionary | undefined;
}

export class EventImpl implements EventApi {
    id: string;
    title: string;
    color: string
    range: DateRange;
    resource?: ResourceApi;
    resourceId: string;
    tooltip?: React.JSX.Element;
    extendedProps?: Dictionary;

    constructor(event: Event) {
        this.id = event.id;
        this.title = event.title;
        this.color = event.color;
        this.range = event.range;
        this.tooltip = event.tooltip;
        this.resourceId = event.resourceId;
        this.extendedProps = event.extendedProps;
    }

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getColor(): string {
        return this.color;
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

    getTooltip(): React.JSX.Element | undefined {
        return this.tooltip;
    }

    getExtendProps(): Dictionary | undefined {
        return this.extendedProps;
    }
}