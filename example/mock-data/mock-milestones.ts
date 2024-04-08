import {FullScheduleMilestone} from "../../dist";
import * as dayjs from "dayjs";

export const mockMilestones: Array<FullScheduleMilestone> = [
    {
        id: "1",
        title: "milestone1",
        range: {
            start: dayjs("2022-01-31"),
            end: dayjs("2022-01-31")
        },
        status: "Success",
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
        resourceId: "8638818878966724025",
    },
    {
        id: "4",
        title: "milestone4",
        range: {
            start: dayjs("2024-04-01"),
            end: dayjs("2024-04-01")
        },
        status: "Warning",
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
        resourceId: "8638818878966724025",
    },
]