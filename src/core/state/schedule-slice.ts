import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {ResourceImpl} from "../structs/resource-struct";

export interface ScheduleState {
    collapseResources: Array<ResourceImpl>;
    resourceAreaWidth: string;
}

const initialState: ScheduleState = {
    collapseResources: [],
    resourceAreaWidth: "20%"
}

const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        collapseResource(state, action: PayloadAction<ResourceImpl>) {
            state.collapseResources = [...state.collapseResources, action.payload];
        },
        expandedResource(state, action: PayloadAction<ResourceImpl>) {
          state.collapseResources = state.collapseResources.filter(resource => resource.id !== action.payload.id)
        },
        changeResourceAreaWidth(state, action: PayloadAction<string>) {
            const oldWidth = state.resourceAreaWidth;
            const newWidth = action.payload;
            (oldWidth !== newWidth) && (state.resourceAreaWidth = newWidth);
        }
    }
});

export const {collapseResource, expandedResource, changeResourceAreaWidth} = scheduleSlice.actions;
export default scheduleSlice.reducer;