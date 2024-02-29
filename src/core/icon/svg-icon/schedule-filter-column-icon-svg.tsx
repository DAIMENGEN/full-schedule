import {ScheduleIconSvg, ScheduleIconSvgPath} from "../../structs/schedule-icon-svg";
import React from "react";

export class ScheduleFilterColumnIconSvg implements ScheduleIconSvg {
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
        this.width = "1.3em";
        this.height = "1.3em";
        this.paths = [
            {
                d: "M690.515 103H90.995c-22.952 0-35.395 26.882-20.547 44.401l229.531 270.81a13.487 13.487 0 0 1 3.2 8.716V894.99c0 21.752 24.415 34.546 42.281 22.17l115.463-79.979a40.458 40.458 0 0 0 17.415-33.252V431.874c0-6.39 2.263-12.564 6.393-17.438L711.07 147.401C725.918 129.882 713.475 103 690.515 103M879.158 811.892v-471.61c0-12.767 10.34-23.114 23.1-23.114H936.9c12.76 0 23.101 10.347 23.101 23.114v471.61c0 12.767-10.341 23.114-23.1 23.114h-34.642c-12.76 0-23.1-10.347-23.1-23.114M677.052 811.892V458.09c0-12.76 10.34-23.107 23.1-23.107h34.641c12.76 0 23.101 10.347 23.101 23.107v353.802c0 12.767-10.341 23.114-23.1 23.114h-34.642c-12.76 0-23.1-10.347-23.1-23.114",
                fill: "#ffffff"
            }
        ];
    }
    render(): React.JSX.Element {
        const pathElements = this.paths.map((path, index) => <path key={index} d={path.d} fill={path.fill} />);
        return (
            <svg className={this.className} viewBox={this.viewBox} xmlns={this.xmlns} width={this.width} height={this.height}>
                {pathElements}
            </svg>
        )
    }
}