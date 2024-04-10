import "react-app-polyfill/ie11";
import * as React from "react";
import {useState} from "react";
import * as ReactDOM from "react-dom/client";
import * as dayjs from "dayjs";
import {mockResources} from "./mock-data/mock-resources";
import {mockEvents} from "./mock-data/mock-events";
import "../dist/full-schedule.css";
import {mockMilestones} from "./mock-data/mock-milestones";
import "./index.scss";
import {mockCheckpoints} from "./mock-data/mock-checkpoints";
import {FullSchedule, FullScheduleCaptureImpl} from "../dist";
import {Button, DatePicker} from "antd";

const App = () => {
    const {RangePicker} = DatePicker;
    const [scheduleStartDate, setScheduleStartDate] = useState<dayjs.Dayjs>(dayjs("2024-04-01"));
    const [scheduleEndDate, setScheduleEndDate] = useState<dayjs.Dayjs>(dayjs("2024-05-31"));
    return (
        <div className={`schedule`}>
            <div className={`schedule-header`}>
                <RangePicker style={{width: 230}}
                             picker={"month"}
                             value={[scheduleStartDate, scheduleEndDate]}
                             onChange={(arg) => {
                                 if (arg) {
                                     const dates = arg.values();
                                     const scheduleStartDate = dayjs(dates.next().value);
                                     const scheduleEndDate = dayjs(dates.next().value);
                                     setScheduleStartDate(scheduleStartDate);
                                     setScheduleEndDate(scheduleEndDate);
                                 }
                             }}/>
                <Button type={"primary"} onClick={() => {
                    const capture = new FullScheduleCaptureImpl()
                    capture.capture(() => {});
                }}>Capture</Button>
            </div>
            <div className={`schedule-body`}>
                <FullSchedule start={scheduleStartDate}
                              end={scheduleEndDate}
                              resources={mockResources}
                              events={mockEvents}
                              milestones={mockMilestones}
                              checkpoints={mockCheckpoints}
                              lineHeight={40}
                              slotMinWidth={50}
                              scheduleMaxHeight={800}
                              scheduleViewType={"Week"}
                              resourceAreaColumns={[
                                  {
                                      field: "title",
                                      headerContent: "Title"
                                  }
                              ]}/>
            </div>
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




