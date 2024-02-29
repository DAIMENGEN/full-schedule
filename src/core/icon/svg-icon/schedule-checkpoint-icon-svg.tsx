import {ScheduleIconSvg, ScheduleIconSvgPath} from "../../structs/schedule-icon-svg";
import React from "react";

export class ScheduleCheckpointIconSvg implements  ScheduleIconSvg {
    className: string;
    viewBox: string;
    xmlns: string;
    height: string;
    width: string;
    paths: Array<ScheduleIconSvgPath>;
    constructor() {
        this.className = "icon";
        this.viewBox = "0 0 1024 1024";
        this.xmlns = "http://www.w3.org/2000/svg";
        this.width = "1em";
        this.height = "2em";
        this.paths = [
            {
                d: "M512 60.235294c199.619765 0 361.411765 155.166118 361.411765 346.533647 0 127.638588-120.470588 293.225412-361.411765 496.760471-240.941176-203.595294-361.411765-369.121882-361.411765-496.760471C150.588235 215.401412 312.380235 60.235294 512 60.235294z m0 240.941177a120.470588 120.470588 0 1 0 0 240.941176 120.470588 120.470588 0 0 0 0-240.941176z",
                fill: "#91003c"
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