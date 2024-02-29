import {ScheduleIconSvg, ScheduleIconSvgPath} from "../../structs/schedule-icon-svg";
import React from "react";

export class ScheduleRecurringIconSvg implements ScheduleIconSvg {
    className: string;
    viewBox: string;
    xmlns: string;
    width: string;
    height: string;
    paths: Array<ScheduleIconSvgPath>;
    constructor() {
        this.className = "icon";
        this.viewBox = "0 0 1024 1024";
        this.xmlns = "http://www.w3.org/2000/svg";
        this.width = "1em";
        this.height = "2em";
        this.paths = [
            {
                d: "M569 616.1c-18.6-10.8-42 2.7-42 24.2v46.3H351.1c-96.7 0-175.4-78.7-175.4-175.5 0-38.9 12.7-75.9 36.8-107 18.9-24.5 14.4-59.6-10-78.5-24.4-18.8-59.5-14.4-78.5 10-39.3 50.9-60.1 111.5-60.1 175.5 0 158.4 128.9 287.3 287.3 287.3H527v46.3c0 21.5 23.3 35 42 24.2l177.1-102.3c18.6-10.8 18.6-37.7 0-48.4L569 616.1z m102.5-392.2H495.6v-46.3c0-21.5-23.3-35-42-24.2L276.5 255.6c-18.6 10.8-18.6 37.7 0 48.4l177.1 102.3c18.6 10.8 42-2.7 42-24.2v-46.3h175.9c96.7 0 175.5 78.7 175.5 175.4 0 39-12.7 76-36.8 107.1-18.9 24.5-14.4 59.6 10 78.5 10.2 7.9 22.2 11.7 34.2 11.7 16.7 0 33.3-7.5 44.3-21.7 39.3-50.9 60.1-111.6 60.1-175.6 0-158.5-128.9-287.3-287.3-287.3z",
                fill: "#91003c"
            }
        ];
    }
    render(): React.JSX.Element {
        const pathElements = this.paths.map((path, index) => <path key={index} d={path.d} fill={path.fill} />)
        return (
            <svg className={this.className} viewBox={this.viewBox} xmlns={this.xmlns} width={this.width} height={this.height}>
                {pathElements}
            </svg>
        )
    }
}