import React from "react";
import {DateRange} from "../../../core/datelib/date-range";
import {Position} from "../../../core/types/public-types";

export interface TimelineViewStrategy {
    renderHeaderSlots(): React.ReactNode;
    renderBodySlots(): React.ReactNode;
    renderColgroup(): React.ReactNode;
    calculatePosition(timelineWidth: number, range: DateRange): Position;
}