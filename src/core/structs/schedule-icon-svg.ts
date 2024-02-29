import React from "react";
export type ScheduleIconSvgPath = {d: string; fill: string;}
export interface ScheduleIconSvg {
    className: string;
    viewBox: string;
    xmlns: string;
    width: string;
    height: string;
    paths: Array<ScheduleIconSvgPath>;
    render(): React.JSX.Element;
}