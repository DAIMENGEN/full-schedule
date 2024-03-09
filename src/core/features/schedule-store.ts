import {combineReducers, configureStore} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import resourceReducer from "./resource/resource-slice";

const reducers = combineReducers({
    resourceState: resourceReducer,
});

const persistConfig = {
    key: "full-schedule",
    storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, reducers);

export const scheduleStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(scheduleStore);
export type ScheduleDispatch = typeof scheduleStore.dispatch;
export type ScheduleState = ReturnType<typeof scheduleStore.getState>;