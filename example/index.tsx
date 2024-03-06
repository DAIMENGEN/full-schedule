import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as dayjs from "dayjs";
import {mockResources} from "./mock-data/mock-resources";
import {mockEvents} from "./mock-data/mock-events";
import {FullScheduleGanttChart} from "../dist";
import "../dist/full-schedule.css";

const App = () => {
    return (
        <div>
            <FullScheduleGanttChart start={dayjs("2021-01-01")}
                                    end={dayjs("2025-02-23")}
                                    resources={mockResources}
                                    events={mockEvents}
                                    milestones={[
                                        {
                                            id: "1",
                                            title: "milestone1",
                                            range: {
                                                start: dayjs("2021-01-31"),
                                                end: dayjs("2021-01-31")
                                            },
                                            status: "Success",
                                            achieved: true,
                                            resourceId: "8638818878966724025",
                                        },
                                        {
                                            id: "2",
                                            title: "milestone2",
                                            range: {
                                                start: dayjs("2021-01-28"),
                                                end: dayjs("2021-01-28")
                                            },
                                            status: "Failure",
                                            achieved: true,
                                            resourceId: "8638818878966724025",
                                        },
                                        {
                                            id: "3",
                                            title: "milestone3",
                                            range: {
                                                start: dayjs("2021-02-03"),
                                                end: dayjs("2021-02-03")
                                            },
                                            status: "Warning",
                                            achieved: true,
                                            resourceId: "8638818878966724025",
                                        },
                                        {
                                            id: "4",
                                            title: "milestone4",
                                            range: {
                                                start: dayjs("2021-02-24"),
                                                end: dayjs("2021-02-24")
                                            },
                                            status: "Warning",
                                            achieved: true,
                                            resourceId: "8638818878966724025",
                                        },
                                        {
                                            id: "5",
                                            title: "milestone5",
                                            range: {
                                                start: dayjs("2021-02-23"),
                                                end: dayjs("2021-02-23")
                                            },
                                            status: "Warning",
                                            achieved: true,
                                            resourceId: "8638818878966724025",
                                        },
                                    ]}
                                    lineHeight={30}
                                    slotMinWidth={50}
                                    scheduleMaxHeight={800}
                                    scheduleViewType={"Year"}
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




