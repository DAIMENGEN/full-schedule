import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import weekOfYear from "dayjs/plugin/weekOfYear"
import weekYear from "dayjs/plugin/weekYear";
import {ScheduleUtil} from "../../utils/schedule-util";
import {ScheduleApi} from "./schedule-struct";
import {MountArg} from "../types/public-types";
import {ScheduleViewType} from "./schedule-view-struct";
dayjs.extend(isSameOrBefore);
dayjs.extend(quarterOfYear);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

export interface TimelineSlotArg {
    el: HTMLElement;
    schedule: ScheduleApi;
    date: dayjs.Dayjs;
    timeText?: string;
    isPast: Boolean;
    isFuture: Boolean;
    isToday: Boolean;
    level?: number;
    slotType: ScheduleViewType;
}

export type TimelineSlotLaneMountArg = MountArg<TimelineSlotArg>;

export type TimelineSlotLabelMountArg = MountArg<TimelineSlotArg>;

export type TimelineData = {
    years: Record<string, dayjs.Dayjs[]>;
    months: Record<string, dayjs.Dayjs[]>;
    quarters: Record<string, dayjs.Dayjs[]>;
    weeks: Record<string, dayjs.Dayjs[]>;
    days: dayjs.Dayjs[];
}

export type TimelineProps = {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    specialWorkdays?: Array<dayjs.Dayjs>;
    companyHolidays?: Array<dayjs.Dayjs>;
    nationalHolidays?: Array<dayjs.Dayjs>;
}

export interface TimelineApi {
    getStart(): dayjs.Dayjs;
    getEnd(): dayjs.Dayjs;
    getDays(): Array<dayjs.Dayjs>;
    getWeeks(): Array<dayjs.Dayjs>;
    getMonths(): Array<dayjs.Dayjs>;
    getQuarters(): Array<dayjs.Dayjs>;
    getYears(): Array<dayjs.Dayjs>;
    getDayPosition(target: dayjs.Dayjs): number;
    getWeekPosition(target: dayjs.Dayjs): number;
    getMonthPosition(target: dayjs.Dayjs): number;
    getQuarterPosition(target: dayjs.Dayjs): number;
    getYearPosition(target: dayjs.Dayjs): number;
    getMonthsAndDays(): Array<{ month: dayjs.Dayjs, days: Array<dayjs.Dayjs> }>;
    getMonthsAndWeeks(): Array<{ month: dayjs.Dayjs, weeks: Array<dayjs.Dayjs> }>;
    getYearsAndDays(): Array<{ year: dayjs.Dayjs, days: Array<dayjs.Dayjs> }>;
    getYearsAndMonths(): Array<{year: dayjs.Dayjs, months: Array<dayjs.Dayjs>}>;
    getYearsAndQuarters(): Array<{ year: dayjs.Dayjs, quarters: Array<dayjs.Dayjs> }>;
    getSpecialWorkdays(): Array<dayjs.Dayjs>;
    getCompanyHolidays(): Array<dayjs.Dayjs>;
    getNationalHolidays(): Array<dayjs.Dayjs>;
    isWeekend(target: dayjs.Dayjs): Boolean;
    isHoliday(target: dayjs.Dayjs): Boolean;
    isSpecialWorkday(target: dayjs.Dayjs): Boolean;
    isCompanyHoliday(target: dayjs.Dayjs): Boolean;
    isNationalHoliday(target: dayjs.Dayjs): Boolean;
}

export class TimelineImpl implements TimelineApi {
    private readonly start: dayjs.Dayjs;
    private readonly end: dayjs.Dayjs;
    private readonly specialWorkdays: Array<dayjs.Dayjs>;
    private readonly companyHolidays: Array<dayjs.Dayjs>;
    private readonly nationalHolidays: Array<dayjs.Dayjs>;
    private readonly timelineDate: TimelineData;
    constructor(props: TimelineProps) {
        const {start, end, specialWorkdays, companyHolidays, nationalHolidays} = props;
        this.start = start;
        this.end = end;
        this.specialWorkdays = specialWorkdays || Array.of<dayjs.Dayjs>();
        this.companyHolidays = companyHolidays || Array.of<dayjs.Dayjs>();
        this.nationalHolidays = nationalHolidays || Array.of<dayjs.Dayjs>();
        let currentDate = start.clone();
        const result: TimelineData = {
            years: {},
            months: {},
            quarters: {},
            weeks: {},
            days: []
        };
        while (currentDate.isSameOrBefore(end, "day")) {
            // calculate year.
            const yearKey = currentDate.startOf("year").format("YYYY-MM-DD");
            result.years[yearKey] = result.years[yearKey] || [];
            result.years[yearKey].push(currentDate.clone());
            // calculate quarter.
            const quarterKey = currentDate.startOf("quarter").format("YYYY-MM-DD")
            result.quarters[quarterKey] = result.quarters[quarterKey] || [];
            result.quarters[quarterKey].push(currentDate.clone());
            // calculate month.
            const monthKey = currentDate.startOf("month").format("YYYY-MM-DD");
            result.months[monthKey] = result.months[monthKey] || [];
            result.months[monthKey].push(currentDate.clone());
            // calculate month.
            const weekKey = currentDate.startOf("week").format("YYYY-MM-DD");
            result.weeks[weekKey] = result.weeks[weekKey] || [];
            result.weeks[weekKey].push(currentDate.clone());
            // calculate day.
            result.days.push(currentDate.clone());
            // next loop.
            currentDate = currentDate.add(1, "day");
        }
        this.timelineDate = result;
    }
    getEnd(): dayjs.Dayjs {
        return this.end;
    }
    getStart(): dayjs.Dayjs {
        return this.start;
    }
    getDays(): Array<dayjs.Dayjs> {
        return this.timelineDate.days;
    }
    getWeeks(): Array<dayjs.Dayjs> {
        return Object.keys(this.timelineDate.weeks).map(weekKey => dayjs(weekKey));
    }
    getMonths(): Array<dayjs.Dayjs> {
        return Object.keys(this.timelineDate.months).map(monthKey => dayjs(monthKey));
    }
    getQuarters(): Array<dayjs.Dayjs> {
        return Object.keys(this.timelineDate.quarters).map(quarterKey => dayjs(quarterKey));
    }
    getYears(): Array<dayjs.Dayjs> {
        return Object.keys(this.timelineDate.years).map(yearKey => dayjs(yearKey));
    }
    getDayPosition(target: dayjs.Dayjs): number {
        return this.getDays().findIndex(day => day.isSame(target, "day"));
    }
    getWeekPosition(target: dayjs.Dayjs): number {
        return this.getWeeks().findIndex(week => week.isSame(target, "week"));
    }
    getMonthPosition(target: dayjs.Dayjs): number {
        return this.getMonths().findIndex(month => month.isSame(target, "month"));
    }
    getQuarterPosition(target: dayjs.Dayjs): number {
        return this.getQuarters().findIndex(quarter => quarter.isSame(target, "quarter"));
    }
    getYearPosition(target: dayjs.Dayjs): number {
        return this.getYears().findIndex(year => year.isSame(target, "year"));
    }
    getMonthsAndDays(): Array<{ month: dayjs.Dayjs; days: Array<dayjs.Dayjs> }> {
        const monthsAndDays = [];
        const months = this.timelineDate.months;
        for (const key in months) {
            const monthAndDays: { month: dayjs.Dayjs, days: Array<dayjs.Dayjs> } = {month: dayjs(), days: []};
            monthAndDays.month = dayjs(key);
            monthAndDays.days = months[key];
            monthsAndDays.push(monthAndDays);
        }
        return monthsAndDays;
    }
    getMonthsAndWeeks(): Array<{ month: dayjs.Dayjs; weeks: Array<dayjs.Dayjs> }> {
        const weeks: dayjs.Dayjs[] = this.getWeeks();
        const groupArray = ScheduleUtil.groupArray<dayjs.Dayjs>(weeks, week => week.format("YYYY-MM"));
        const monthsAndWeeks = [];
        for (const key in groupArray) {
            const monthAndWeeks: { month: dayjs.Dayjs, weeks: Array<dayjs.Dayjs> } = {month: dayjs(), weeks: []};
            monthAndWeeks.month = dayjs(key);
            monthAndWeeks.weeks = groupArray[key];
            monthsAndWeeks.push(monthAndWeeks);
        }
        return monthsAndWeeks;
    }
    getYearsAndDays(): Array<{ year: dayjs.Dayjs; days: Array<dayjs.Dayjs> }> {
        const yearsAndDays = [];
        const years = this.timelineDate.years;
        for (const key in years) {
            const yearAndDays: { year: dayjs.Dayjs, days: Array<dayjs.Dayjs> } = {year: dayjs(), days: []};
            yearAndDays.year = dayjs(key);
            yearAndDays.days = years[key];
            yearsAndDays.push(yearAndDays);
        }
        return yearsAndDays;
    }
    getYearsAndMonths(): Array<{ year: dayjs.Dayjs; months: Array<dayjs.Dayjs> }> {
        const days = this.getDays();
        const months = Array.from(new Set(days.map(day => day.format("YYYY-MM")))).map(date => dayjs(date));
        const groupArray = ScheduleUtil.groupArray<dayjs.Dayjs>(months, month => month.format("YYYY"));
        const yearsAndMonths = [];
        for (const key in groupArray) {
            const yearAndMonths: { year: dayjs.Dayjs, months: Array<dayjs.Dayjs> } = {year: dayjs(), months: []};
            yearAndMonths.year = dayjs(key);
            yearAndMonths.months = groupArray[key];
            yearsAndMonths.push(yearAndMonths);
        }
        return yearsAndMonths;
    }
    getYearsAndQuarters(): Array<{ year: dayjs.Dayjs; quarters: Array<dayjs.Dayjs> }> {
        const days = this.getDays();
        const quarters = Array.from(new Set(days.map(day => day.startOf("quarter").format("YYYY-MM-DD")))).map(date => dayjs(date));
        const groupArray = ScheduleUtil.groupArray<dayjs.Dayjs>(quarters, quarter => quarter.format("YYYY"));
        const yearsAndQuarters = [];
        for (const key in groupArray) {
            const yearAndQuarters: { year: dayjs.Dayjs; quarters: Array<dayjs.Dayjs> } = {year: dayjs(), quarters: []};
            yearAndQuarters.year = dayjs(key);
            yearAndQuarters.quarters = groupArray[key];
            yearsAndQuarters.push(yearAndQuarters);
        }
        return yearsAndQuarters;
    }
    getSpecialWorkdays(): Array<dayjs.Dayjs> {
        return this.specialWorkdays;
    }
    getCompanyHolidays(): Array<dayjs.Dayjs> {
        return this.companyHolidays;
    }
    getNationalHolidays(): Array<dayjs.Dayjs> {
        return this.nationalHolidays;
    }
    public isWeekend(target: dayjs.Dayjs): Boolean {
        return target.day() === 0 || target.day() === 6;
    }
    public isHoliday(target: dayjs.Dayjs): Boolean {
        return (this.companyHolidays.some(holiday => holiday.isSame(target, "day"))
                || this.nationalHolidays.some(holiday => holiday.isSame(target, "day"))
                || this.isWeekend(target))
            && !this.specialWorkdays.some(workday => workday.isSame(target, "day"))
    }
    public isCompanyHoliday(target: dayjs.Dayjs): Boolean {
        return this.companyHolidays.some(holiday => holiday.isSame(target, "day"));
    }
    public isNationalHoliday(target: dayjs.Dayjs): Boolean {
        return this.nationalHolidays.some(holiday => holiday.isSame(target, "day"));
    }
    public isSpecialWorkday(target: dayjs.Dayjs): Boolean {
        return this.specialWorkdays.some(workday => workday.isSame(target, "day"));
    }
}