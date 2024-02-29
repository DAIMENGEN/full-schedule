import {ScheduleIconSvg, ScheduleIconSvgPath} from "../../structs/schedule-icon-svg";
import React from "react";

export class ScheduleTodayIconSvg implements ScheduleIconSvg {
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
        this.width = "1.8em";
        this.height = "1.8em";
        this.paths = [
            {
                d: "M705.98656 275.16928h19.6608c15.72864 0 27.52512-11.79648 27.52512-26.2144V140.16512c0-15.72864-11.79648-27.52512-27.52512-27.52512h-19.6608c-15.72864 0-27.52512 11.79648-27.52512 27.52512v107.47904c0 15.72864 11.79648 27.52512 27.52512 27.52512z m-411.56608 0h19.6608c15.72864 0 27.52512-11.79648 27.52512-26.2144V140.16512c0-15.72864-11.79648-27.52512-27.52512-27.52512h-19.6608c-15.72864 0-27.52512 11.79648-27.52512 27.52512v107.47904c0 15.72864 11.79648 27.52512 27.52512 27.52512z m0 0",
                fill: "#ffffff"
            },
            {
                d: "M848.85504 203.07968h-56.36096v45.8752c0 34.07872-27.52512 62.91456-65.536 62.91456h-19.6608c-35.38944 0-65.536-27.52512-65.536-62.91456v-45.8752h-262.144v45.8752c0 34.07872-27.52512 62.91456-65.536 62.91456h-19.6608c-35.38944 0-65.536-27.52512-65.536-62.91456v-45.8752h-53.73952c-31.45728 0-56.36096 23.59296-56.36096 55.05024v598.99904c0 31.45728 24.90368 55.05024 56.36096 55.05024h672.39936c31.45728 0 56.36096-23.59296 57.67168-55.05024V258.12992c0-31.45728-24.90368-55.05024-56.36096-55.05024zM175.14496 857.12896V383.95904h672.39936s0 473.16992 1.31072 473.16992H175.14496z m0 0",
                fill: "#ffffff"
            },
            {
                d: "M472.97536 503.52128H362.82368v-64.256h298.36288v64.256H551.424v298.2912h-78.45888v-298.2912z",
                fill: "#ffffff"
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