import * as React from "react";
import {MenuProps} from "antd";

export type Dictionary = Record<string, any>;

export type Position = {
    left: number;
    right: number;
}

export type MenuItems = MenuProps["items"];

export type MenuArg<ContentArg> =
    ContentArg
    & { key: string, keyPath: string[], domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> }

export type MountArg<ContentArg> = ContentArg & { el: HTMLElement };

export type DidMountHandler<TheMountArg extends { el: HTMLElement }> = (mountArg: TheMountArg) => void;

export type WillUnmountHandler<TheMountArg extends { el: HTMLElement }> = (mountArg: TheMountArg) => void;

export type ContextMenuClickHandler<TheMenuArg extends { key: string, keyPath: string[], domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> }> = (menuArg: TheMenuArg) => void;


