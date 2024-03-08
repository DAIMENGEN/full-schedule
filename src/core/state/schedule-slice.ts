import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ScheduleState {
    collapseResourceIds: Array<string>;
    resourceAreaWidth: string;
}

const initialState: ScheduleState = {
    collapseResourceIds: [],
    resourceAreaWidth: "20%"
}

const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        collapseResource(state, action: PayloadAction<string>) {
            state.collapseResourceIds = [...state.collapseResourceIds, action.payload];
        },
        expandedResource(state, action: PayloadAction<string>) {
          state.collapseResourceIds = state.collapseResourceIds.filter(resourceId => resourceId !== action.payload);
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