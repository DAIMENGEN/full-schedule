import { configureStore } from "@reduxjs/toolkit";
import scheduleReducer from "./schedule-slice";
export const scheduleStore = configureStore({
    reducer: {
        scheduleState: scheduleReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
export type ScheduleDispatch = typeof scheduleStore.dispatch;
export type ScheduleState = ReturnType<typeof scheduleStore.getState>;