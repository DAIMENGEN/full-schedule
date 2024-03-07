import {FullScheduleCheckpoint} from "../../src";
import * as dayjs from "dayjs";

export const mockCheckpoints: Array<FullScheduleCheckpoint> = [
    {
        id: "1",
        title: "Test Condition Monitor",
        range: {
            start: dayjs("2022-12-31"),
            end: dayjs("2022-12-31")
        },
        resourceId: "6769994271325942397"
    },
]