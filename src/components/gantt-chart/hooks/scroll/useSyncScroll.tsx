import React, {useEffect} from "react";
import {SCROLL_LEFT, SCROLL_TOP} from "./scroll-type";

export const useSyncScroll = (mainContainer:  React.RefObject<HTMLDivElement>, otherContainers: Array<React.RefObject<HTMLDivElement>>, type: string) => {
    useEffect(() => {
        mainContainer.current?.addEventListener("scroll", (e) => {
            const element = e.target as HTMLElement;
            otherContainers.forEach(container => {
                switch (type) {
                    case SCROLL_LEFT:
                        container.current?.scroll({
                            left: element.scrollLeft
                        });
                        break;
                    case SCROLL_TOP:
                        container.current?.scroll({
                            top: element.scrollTop
                        });
                        break;
                    default:
                        break;
                }
            })
        });
    }, [mainContainer, otherContainers, type]);
}