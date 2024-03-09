# Full Schedule

Author: Mengen.dai.

WeChart: DME_000000

Note: Full Schedule is a project based on Typescript React, it is designed specifically for React projects, so it cannot work properly in non-React projects.

## What is Full Schedule

* Full Schedule is a fully responsive Gantt Chart React Component, designed specifically for project management and scheduling. It includes two sections: the left side outlines a list of tasks, while the right side has a timeline with schedule bars that visualize work.
* Full Schedule can assist you in planning for the success of each project. The flexible Gantt Chart in Full Schedule allows you easily collaborate with your team on the timeline, track the progress of projects, and keep the team's workflow running smoothly and efficiently.

## **Features**

* Full Schedule supports simple configuration. This means that developers can quickly start using Full Schedule without the need for complex setup or installation processes.
* Full Schedule supports custom holiday configuration for the timeline. This means that developers can add specifically holiday information to the timeline according to their needs, making schedule management more flexible and personalized.
* Full Schedule supports visualizing important dates, checkpoints, and milestones to ensure tasks are completed on time.
* Full Schedule supports day, month, quarter, and year views. This means that users can choose the view that best suits their needs and preferences to view and manage their schedule.
* Full Schedule supports exporting images. This means that users can export their schedule or project timeline in the form of images, which is convenient for sharing and archiving.
* Full Schedule supports customizing row height and column width. This means that users can adjust the row height and column width of the schedule according to their needs and preferences, making the display of the schedule more in line with their visual habits.

## **Installation**

```shell
npm install full-schedule
```

## **Basic Example**

```tsx
import { FullSchedule } from "full-schedule";
import dayjs from "dayjs";

const App = () => {
  
  const events = [
      {
        id: "event_id_1",
        title: "Title_A",
        color: "#000000",
        range: {
            start: dayjs("2023-08-01"),
            end: dayjs("2024-04-01")
        },
        resourceId: "8968845952632643583",
        tooltip: <span>title_a</span>
      }
  ];
  
  const resources = [
    {
        id: "resource_id_1",
        title: "ResourceA",
    },
    {
        id: "2",
        title: "ResourceB",
    },
    {
        id: "3",
        title: "ResourceB_1",
        parentId: "2"
    },
  ];
  
  const checkpoints = [
      {
            id: "1",
            title: "Checkpoints",
            range: {
                start: dayjs("2022-12-31"),
                end: dayjs("2022-12-31")
            },
            resourceId: "resource_id_1"
        },
  ];
  
  const milestones = [
    {
        id: "1",
        title: "milestone1",
        range: {
            start: dayjs("2022-01-31"),
            end: dayjs("2022-01-31")
        },
        status: "Success",
        resourceId: "resource_id_1"
    },
  ];
  
  return (
      <FullSchedule start={dayjs("2021-01-01")}
                    end={dayjs("2025-02-23")}
                    resources={resources}
                    events={events}
                    milestones={milestones}
                    checkpoints={checkpoints}
                    lineHeight={40}
                    slotMinWidth={50}
                    scheduleMaxHeight={800}
                    scheduleViewType={"DaY"}
                    resourceAreaColumns={[
                        {
                            field: "title",
                            headerContent: "Title"
                        },
                        {
                            field: "order",
                            headerContent: "order"
                        }
                    ]}/>
  )
}
```

## Configuration

* end
* start
* lineHeight
* slotMinWidth
* scheduleViewType
* scheduleMaxHeight
* events
* resources
* milestones
* checkpoints
* companyHolidays
* specialWorkdays
* nationalHolidays
* eventContextMenu
* eventContextMenuClick
* eventContextMenuItems
* eventDidMount
* eventWillUnmount
* resourceLabelContextMenu
* resourceLableContextMenuClick
* resourceLabelContextMenuItems
* resourceLabelDidMount
* resourceLabelWillUnmount
* resourceLaneContextMenu
* resourceLaneContextMenuClick
* resourceLaneContextMenuItems
* resourceLaneDidMount
* resourceLaneWillUnmount
* milestoneContextMenu
* milestoneContextMenuClick
* milestoneContextMenuItems
* milestoneDidMount
* milestoneWillUnmount
* checkpointContextMenu
* checkpointContextMenuClick
* checkpointContextMenuItems
* checkpointDidMount
* checkpointWillUnmount
* timelineSlotLabelDidMount
* timelineSlotLabelWillUnmount
* timelineSlotLaneDidMount
* timelineSlotLaneWillUnmount

## License

MIT license.
