import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {ScheduleState, ScheduleDispatch} from "./schedule-store";
export const useScheduleDispatch = () => useDispatch<ScheduleDispatch>();
export const useScheduleSelector: TypedUseSelectorHook<ScheduleState> = useSelector;