import dayjs from "dayjs";
import {ResourceImpl} from "../core/structs/resource-struct";
import {ScheduleViewType} from "../core/structs/schedule-view-struct";

export class ScheduleUtil {
    static numberToPixels(value: number): string {
        return value + "px";
    }

    static pixelsToNumber(value: string): number {
        const match = value.match(/\d+/);
        if (match) {
            return parseInt(match[0], 10);
        }
        return 0;
    }

    static groupArray<T>(arr: Array<T>, func: (item: T) => string): Record<string, Array<T>> {
        const groupedResult: Record<string, T[]> = {};
        arr.forEach(item => {
            const key = func(item);
            if (groupedResult[key]) {
                groupedResult[key].push(item);
            } else {
                groupedResult[key] = [item];
            }
        });
        return groupedResult;
    }

    static capitalizeFirstLetter(input: string): string {
        if (input.length === 0) return input;
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }

    static calculateDatePercent(start: dayjs.Dayjs, end: dayjs.Dayjs): number {
        const currentDate = dayjs();
        const totalDays = end.diff(start, "day");
        const passedDays = currentDate.diff(start, "day");
        const percentage = (passedDays / totalDays) * 100;
        return Math.round(percentage);
    }

    static getDateUnitByScheduleViewType(viewType: ScheduleViewType): "day" | "month" | "quarter" | "year" {
        switch (viewType) {
            case "Day": return "day";
            case "Month": return "month";
            case "Quarter": return "quarter";
            case "Year": return "year";
            default: return "day";
        }
    }

    static flatMapResources(resources: Array<ResourceImpl>): Array<ResourceImpl> {
        const getFamilyMember = (resource: ResourceImpl): Array<ResourceImpl> => {
            const result: Array<ResourceImpl> = [resource];
            const children = resource.children;
            if (children.length > 0) {
                result.push(...Array.from(children.map(child => getFamilyMember(child))).flatMap(children => children));
            }
            return result;
        }
        return Array.from(resources.map(resource => getFamilyMember(resource)).flatMap(family => family));
    }
}