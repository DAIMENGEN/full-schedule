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
        const result: Array<ResourceImpl> = [];
        const stack: Array<ResourceImpl> = [...resources];
        while (stack.length > 0) {
            const current = stack.pop();
            if (current) {
                result.push(current);
                for (let i = current.children.length - 1; i >= 0 ; i--) {
                    stack.push(current.children[i]);
                }
            }
        }
        return result;
    }
}