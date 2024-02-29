import React from "react";
import {ScheduleIconSvg, ScheduleIconSvgPath} from "../../structs/schedule-icon-svg";
export class ScheduleFlag02IconSvg implements ScheduleIconSvg {
    className: string;
    viewBox: string;
    xmlns: string;
    width: string;
    height: string;
    paths: Array<ScheduleIconSvgPath>;
    constructor(width?: string, height?: string) {
        this.className = "icon";
        this.viewBox = "0 0 1024 1024";
        this.xmlns = "http://www.w3.org/2000/svg";
        this.width = width || "2em";
        this.height = height ||"2em";
        this.paths = [
            {
                d: "M1024 512c0 282.7776-229.2224 512-512 512S0 794.7776 0 512 229.2224 0 512 0s512 229.2224 512 512z",
                fill: "#ffffff"
            },
            {
                d: "M435.2 307.2a25.6 25.6 0 0 0-51.2 0v460.8a25.6 25.6 0 0 0 51.2 0v-189.8496L716.8 460.8 435.2 320V307.2z",
                fill: "#26b826",
            }
        ];
    }
    render(): React.JSX.Element {
        const pathElements = this.paths.map((path, index) => <path key={index} d={path.d} fill={path.fill}/>)
        return (
            <svg className={this.className} viewBox={this.viewBox} xmlns={this.xmlns} width={this.width} height={this.height}>
                {pathElements}
            </svg>
        )
    }
}