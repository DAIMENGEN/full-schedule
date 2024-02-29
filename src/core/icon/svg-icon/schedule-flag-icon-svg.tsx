import React from "react";
import {ScheduleIconSvg, ScheduleIconSvgPath} from "../../structs/schedule-icon-svg";
export class ScheduleFlagIconSvg implements ScheduleIconSvg {
    className: string;
    viewBox: string;
    xmlns: string;
    width: string;
    height: string;
    paths: Array<ScheduleIconSvgPath>;
    constructor(color: string, width?: string, height?: string) {
        this.className = "icon";
        this.viewBox = "0 0 1024 1024";
        this.xmlns = "http://www.w3.org/2000/svg";
        this.width = width || "2em";
        this.height = height ||"2em";
        this.paths = [
            {
                d: "M160.74 753.388c-88.381 0-160 35.88-160 80 0 44.19 71.619 80 160 80 88.361 0 159.98-35.81 159.98-80 0.005-44.125-71.619-80-159.98-80z m-0.005 119.895c-54.262 0-98.237-15.033-98.237-39.895 0-24.822 43.97-39.89 98.237-39.89 54.257 0 98.227 15.068 98.227 39.89 0 24.862-43.97 39.895-98.227 39.895z",
                fill: "#fef8f8"
            },
            {
                d: "M199.36 829.983s4.357 17.054-28.283 22.814c-29.64 5.228-34.954-12.974-34.954-12.974L90.217 544.696l54.62-44.933 54.523 330.22z m599.465-788.87l-68.562 408.275-8.54 5.693c-3.24 2.191-80.363 53.56-171.305 35.773-34.002-6.656-65.438-17.274-95.713-27.683-40.192-13.655-78.085-26.548-113.603-26.548-124.979 0-195.563 62.516-196.265 63.145l-54.62 44.933L18.036 80.973c0-9.84 9.666-21.366 17.546-29.384C68.739 17.853 220.414 0.563 335.383 0.563c71.563 0 120.694 36.603 160.185 65.966 23.357 17.331 45.373 33.69 65.31 37.74 59.91 11.965 155.792-24.346 187.659-39.424l50.288-23.731z",
                fill: color,
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