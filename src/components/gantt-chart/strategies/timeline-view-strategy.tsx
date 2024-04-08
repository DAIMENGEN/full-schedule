import React from "react";
import {DateRange} from "../../../core/datelib/date-range";
import {Position} from "../../../core/types/public-types";
import {ScheduleImpl} from "../../../core/structs/schedule-struct";
import {ResourceImpl} from "../../../core/structs/resource-struct";
import {ScheduleUtil} from "../../../utils/schedule-util";
import {
    ScheduleGanttChartTimelineMilestone
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-milestone";
import {
    ScheduleGanttChartTimelineCheckpoint
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-checkpoint";
import {
    ScheduleGanttChartTimelineLaneEvent
} from "../common/schedule-gantt-chart-timeline/schedule-gantt-chart-timeline-lane-event";

export abstract class TimelineViewStrategy {
    abstract get getSchedule(): ScheduleImpl;
    abstract renderHeaderSlots(): React.ReactNode;
    abstract renderBodySlots(): React.ReactNode;
    abstract renderColgroup(): React.ReactNode;
    abstract calculateEventPosition(timelineWidth: number, range: DateRange): Position;
    renderEvents(resource: ResourceImpl, timelineWidth: number): React.ReactNode {
        const schedule = this.getSchedule;
        const timeline = schedule.getTimeline();
        const targetEvents = resource.events;
        const targetMilestones = resource.milestones;
        const lineHeight = targetMilestones.length > 0 ? schedule.getLineHeight() * 1.5 : schedule.getLineHeight();
        return (
            <div className={`schedule-timeline-events schedule-scrollgrid-sync-inner`}>
                {
                    targetEvents.filter(event => !event.range.start.isAfter(timeline.getEnd()) && !event.range.end.isBefore(timeline.getStart())).map(event => {
                        const height = schedule.getLineHeight() * 0.7;
                        const top = (lineHeight - height) / 2;
                        const position = this.calculateEventPosition(timelineWidth, event.range);
                        return (
                            <div className={`schedule-timeline-event-harness`} style={{
                                left: ScheduleUtil.numberToPixels(position.left),
                                right: ScheduleUtil.numberToPixels(position.right),
                                top: ScheduleUtil.numberToPixels(top),
                                height: ScheduleUtil.numberToPixels(height),
                                lineHeight: ScheduleUtil.numberToPixels(height)}} key={event.id}>
                                <ScheduleGanttChartTimelineLaneEvent event={event} schedule={schedule} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    renderMilestones(resource: ResourceImpl, timelineWidth: number): React.ReactNode {
        const schedule = this.getSchedule;
        const timeline = schedule.getTimeline();
        const targetMilestones = resource.milestones;
        const lineHeight = targetMilestones.length > 0 ? schedule.getLineHeight() * 1.5 : schedule.getLineHeight();
        return (
            <div className={`schedule-timeline-milestones schedule-scrollgrid-sync-inner`}>
                {
                    targetMilestones.filter(milestone => (milestone.range.start.isAfter(timeline.getStart(), "day") || milestone.range.start.isSame(timeline.getStart(), "day")) && milestone.range.end.isSameOrBefore(timeline.getEnd(),"day")).map(milestone => {
                        const top = lineHeight * 0.3 * -1;
                        const position = this.calculateEventPosition(timelineWidth, milestone.range);
                        return (
                            <div className={`schedule-timeline-milestone-harness`} style={{
                                // left: ScheduleUtil.numberToPixels(position.left),
                                right: ScheduleUtil.numberToPixels(position.right),
                                top: ScheduleUtil.numberToPixels(top),
                                height: ScheduleUtil.numberToPixels(lineHeight),
                                lineHeight: ScheduleUtil.numberToPixels(lineHeight)
                            }} key={milestone.id}>
                                <ScheduleGanttChartTimelineMilestone milestone={milestone} schedule={schedule} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    renderCheckpoints(resource: ResourceImpl, timelineWidth: number): React.ReactNode {
        const schedule = this.getSchedule;
        const timeline = schedule.getTimeline();
        const targetMilestones = resource.milestones;
        const targetCheckpoints = resource.checkpoints;
        const lineHeight = targetMilestones.length > 0 ? schedule.getLineHeight() * 1.5 : schedule.getLineHeight();
        return (
            <div className={`schedule-timeline-checkpoints schedule-scrollgrid-sync-inner`}>
                {
                    targetCheckpoints.filter(checkpoint => (checkpoint.range.start.isAfter(timeline.getStart(), "day") || checkpoint.range.start.isSame(timeline.getStart(), "day")) && checkpoint.range.end.isSameOrBefore(timeline.getEnd(),"day")).map(checkpoint => {
                        const height = schedule.getLineHeight() * 0.7;
                        const top = (lineHeight - height) / 8;
                        const position = this.calculateEventPosition(timelineWidth, checkpoint.range);
                        return (
                            <div className={`schedule-timeline-checkpoint-harness`} style={{
                                // left: ScheduleUtil.numberToPixels(position.left),
                                right: ScheduleUtil.numberToPixels(position.right),
                                top: ScheduleUtil.numberToPixels(top),
                                height: ScheduleUtil.numberToPixels(height),
                                lineHeight: ScheduleUtil.numberToPixels(lineHeight)
                            }} key={checkpoint.id}>
                                <ScheduleGanttChartTimelineCheckpoint checkpoint={checkpoint} schedule={schedule} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}