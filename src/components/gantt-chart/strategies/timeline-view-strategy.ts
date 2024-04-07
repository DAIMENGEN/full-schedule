import React from "react";

export interface TimelineViewStrategy {
    renderHeaderSlots(): React.ReactNode;
    renderBodySlots(): React.ReactNode;
    renderColgroup(): React.ReactNode;
}