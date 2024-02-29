import html2canvas from "html2canvas";
import {CanvasMerger} from "../canvas/canvas-merger";

export interface ScheduleCaptureApi {
    capture(callback: () => void): void;
}

export class ScheduleCaptureImpl implements ScheduleCaptureApi {
    private readonly canvas: HTMLCanvasElement;
    private readonly ganttChart: Element | null;
    private readonly ganttChartResourceHeader: Element | null;
    private readonly ganttChartResourceBody: Element | null;
    private readonly ganttChartTimelineHeader: Element | null;
    private readonly ganttChartTimelineBody: Element | null;
    constructor() {
        this.canvas = document.createElement("canvas");
        this.ganttChart = document.querySelector(".schedule");
        this.ganttChartResourceHeader = document.querySelector(".schedule-datagrid-header");
        this.ganttChartResourceBody = document.querySelector(".schedule-datagrid-body");
        this.ganttChartTimelineHeader = document.querySelector(".schedule-timeline-header");
        this.ganttChartTimelineBody = document.querySelector(".schedule-timeline-body");
    }
    capture(callback: () => void): void {
        const context = this.canvas.getContext("2d");
        if (!context) {
            console.error('Unable to get 2D context for canvas');
            return;
        }
        if (this.ganttChartResourceHeader && this.ganttChartResourceBody && this.ganttChartTimelineHeader && this.ganttChartTimelineBody) {
            const capturePromises = [
                html2canvas(this.ganttChartResourceHeader as HTMLElement, { width: this.ganttChartResourceHeader.scrollWidth, height: this.ganttChartResourceHeader.scrollHeight }),
                html2canvas(this.ganttChartResourceBody as HTMLElement, { width: this.ganttChartResourceBody.scrollWidth, height: this.ganttChartResourceBody.scrollHeight }),
                html2canvas(this.ganttChartTimelineHeader as HTMLElement, { width: this.ganttChartTimelineHeader.scrollWidth, height: this.ganttChartTimelineHeader.scrollHeight }),
                html2canvas(this.ganttChartTimelineBody as HTMLElement, { width: this.ganttChartTimelineBody.scrollWidth, height: this.ganttChartTimelineBody.scrollHeight })
            ];
            Promise.all(capturePromises)
                .then((capturedCanvases) => {
                    const merger = new CanvasMerger(capturedCanvases);
                    const positions = [
                        { x: 10, y: 10 },
                        { x: 10, y: capturedCanvases[0].height + 10 },
                        { x: capturedCanvases[0].width + 10, y: 10 },
                        { x: capturedCanvases[0].width + 10, y: capturedCanvases[0].height + 10 },
                    ];
                    this.canvas.width = capturedCanvases[0].width + capturedCanvases[2].width + 20;
                    this.canvas.height = capturedCanvases[0].height + capturedCanvases[1].height + 20;
                    merger.merge(this.canvas, positions);
                    if (this.ganttChart) {
                        const scheduleCapture = document.createElement("div");
                        const cancelCapture = document.createElement("div");
                        scheduleCapture.classList.add("schedule-view-capture");
                        cancelCapture.classList.add("schedule-view-capture-cancel");
                        scheduleCapture.appendChild(this.canvas);
                        scheduleCapture.appendChild(cancelCapture);
                        this.ganttChart.appendChild(scheduleCapture);
                        cancelCapture.addEventListener("click", (_) => {
                            this.ganttChart?.removeChild(scheduleCapture);
                        });
                        callback();
                    }
                })
                .catch((error) => {
                    console.error('Error capturing content:', error);
                });
        }
    }
}