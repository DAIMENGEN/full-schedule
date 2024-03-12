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
    url?: string;
    tooltip?: React.JSX.Element;
    textColor?: string;
    borderColor?: string;
    backgroundColor?: string;
    extendedProps?: Dictionary;
}

export interface EventApi {
    getId(): string;

    getTitle(): string;

    getColor(): string;

    getStart(): dayjs.Dayjs;

    getEnd(): dayjs.Dayjs;

    getResource(): ResourceApi | undefined;

    getUrl(): string | undefined;

    getTooltip(): React.JSX.Element | undefined;

    getTextColor(): string | undefined;

    getBorderColor(): string | undefined;

    getBackgroundColor(): string | undefined;

    getExtendProps(): Dictionary | undefined;
}

export class EventImpl implements EventApi {
    id: string;
    title: string;
    color: string
    range: DateRange;
    resourceId: string;
    url?: string;
    resource?: ResourceApi;
    tooltip?: React.JSX.Element;
    textColor?: string;
    borderColor?: string;
    backgroundColor?: string;
    extendedProps?: Dictionary;

    constructor(event: Event) {
        this.id = event.id;
        this.url = event.url;
        this.title = event.title;
        this.color = event.color;
        this.range = event.range;
        this.tooltip = event.tooltip;
        this.textColor = event.textColor;
        this.resourceId = event.resourceId;
        this.borderColor = event.borderColor;
        this.extendedProps = event.extendedProps;
        this.backgroundColor = event.backgroundColor;
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

    getUrl(): string | undefined {
        return this.url;
    }

    getResource(): ResourceApi | undefined {
        return this.resource;
    }

    getTooltip(): React.JSX.Element | undefined {
        return this.tooltip;
    }

    getTextColor(): string | undefined {
        return this.textColor;
    }

    getBorderColor(): string | undefined {
        return this.borderColor;
    }

    getBackgroundColor(): string | undefined {
        return this.backgroundColor;
    }

    getExtendProps(): Dictionary | undefined {
        return this.extendedProps;
    }
}