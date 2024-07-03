import {renderByUVersion} from "../../../utils/renderByUVersion";
import React from "react";


import {ActivityItem as U1ActivityItem} from "../HallPage/env/u1/ActivityItem";
import {ActivityItem as U2ActivityItem} from "../HallPage/env/u2/ActivityItem";
import {ActivityItem as P1ActivityItem} from "../HallPage/env/p1/ActivityItem";
import {ActivityItem as U5ActivityItem} from "../HallPage/env/u5/ActivityItem";
import {ActivityItem as U6ActivityItem} from "../HallPage/env/u6/ActivityItem";
import {ActivityItem as U7ActivityItem} from "../HallPage/env/u7/ActivityItem";
import {ActivityItem as U9ActivityItem} from "../HallPage/env/u9/ActivityItem";
import {IActivityFontConfig} from "../hooks/useActivityFontConfig";
import {ActivityBadge} from "../../../components/Badge/ActivityBadge";

export type IActivityButton = {
    isTop: boolean;
    name: string,
    title: string;
    subTitle?:string;
    className: string;
    onClick?: () => void;
    src?: string;
    bgSrc?: string;
    fontConfig?: IActivityFontConfig;
    category: string;
}


export const ActivityItem = (props: IActivityButton) => {
    return renderByUVersion({
        "u1": (
            <U1ActivityItem {...props}/>
        ),
        "u2": (
            <U2ActivityItem {...props}/>
        ),
        "p1": (
            <P1ActivityItem {...props}/>
        ),
        "u5": (
            <U5ActivityItem {...props}/>
        ),
        "u6": (
            <U6ActivityItem {...props}/>
        ),
        "u7": (
            <U7ActivityItem {...props}/>
        ),
        "u9": (
            <U9ActivityItem {...props}/>
        )
    }, (
        <U1ActivityItem {...props}/>
    ))


}