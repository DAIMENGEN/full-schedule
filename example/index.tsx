import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as dayjs from "dayjs";
import {mockResources} from "./mock-data/mock-resources";
import {mockEvents} from "./mock-data/mock-events";
import {FullScheduleGanttChart} from "../dist";
import "../dist/full-schedule.css";
import {mockMilestones} from "./mock-data/mock-milestones";
import "./index.scss";
import {mockCheckpoints} from "./mock-data/mock-checkpoints";

const App = () => {
    return (
        <div className={`schedule`}>
            <FullScheduleGanttChart start={dayjs("2021-01-01")}
                                    end={dayjs("2025-02-23")}
                                    resources={mockResources}
                                    events={mockEvents}
                                    milestones={mockMilestones}
                                    checkpoints={mockCheckpoints}
                                    lineHeight={40}
                                    slotMinWidth={50}
                                    scheduleMaxHeight={800}
                                    scheduleViewType={"Month"}
                                    resourceAreaColumns={[
                                        {
                                            field: "title",
                                            headerContent: "Title"
                                        },
                                        {
                                            field: "order",
                                            headerContent: "order"
                                        }
                                    ]}/>


        </div>
    );
};

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);




