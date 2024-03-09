import React from "react";
import {ScheduleProps} from "../core/structs/schedule-struct";
import {Provider} from "react-redux";
import {persistor, scheduleStore} from "../core/features/schedule-store";
import {PersistGate} from "redux-persist/integration/react";
import ScheduleGanttChart from "./gantt-chart/schedule-gantt-chart";

const Schedule: React.FC<ScheduleProps> = (props) => {
    return (
        <Provider store={scheduleStore}>
            <PersistGate persistor={persistor} loading={null}>
                <ScheduleGanttChart {...props}/>
            </PersistGate>
        </Provider>
    )
}

export default Schedule;