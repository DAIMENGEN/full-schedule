import {FullScheduleCheckpoint} from "../../src";
import * as dayjs from "dayjs";

export const mockCheckpoints: Array<FullScheduleCheckpoint> = [
    {
        id: "1",
        title: "Test Condition Monitor",
        range: {
            start: dayjs("2024-04-30"),
            end: dayjs("2024-04-30")
        },
        resourceId: "9204513212332502410"
    },
]