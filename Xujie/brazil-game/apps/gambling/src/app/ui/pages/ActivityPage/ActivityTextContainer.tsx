import {renderByUVersion} from "../../utils/renderByUVersion";
import React, {CSSProperties} from "react";
import {IActivityPage} from "./index";
import {ActivityTextContainer as U1ActivityTextContainer} from "../ActivityPage/env/u1/ActivityTextContainer";
import {ActivityTextContainer as U2ActivityTextContainer} from "../ActivityPage/env/u2/ActivityTextContainer";
import {ActivityTextContainer as P1ActivityTextContainer} from "../ActivityPage/env/p1/ActivityTextContainer";
import {ActivityTextContainer as U5ActivityTextContainer} from "../ActivityPage/env/u5/ActivityTextContainer";
import {ActivityTextContainer as U6ActivityTextContainer} from "../ActivityPage/env/u6/ActivityTextContainer";
import {ActivityTextContainer as U7ActivityTextContainer} from "../ActivityPage/env/u7/ActivityTextContainer";
import {ActivityTextContainer as U9ActivityTextContainer} from "./env/u9/ActivityTextContainer";
export interface IActivityTextContainer extends IActivityPage {
    style?:CSSProperties;
    className?: string;
    children: React.ReactNode;
}


export const ActivityTextContainer = (props: IActivityTextContainer) => {
    return renderByUVersion({
        "u1": (<U1ActivityTextContainer {...props}/>),
        "u2": (<U2ActivityTextContainer {...props} />),
        "p1": (<P1ActivityTextContainer {...props} />),
        "u5": (<U5ActivityTextContainer {...props} />),
        "u6": (<U6ActivityTextContainer {...props} />),
        "u7": (<U7ActivityTextContainer {...props} />),
        "u9": (<U9ActivityTextContainer {...props} />),
    }, (<U1ActivityTextContainer {...props}/>),)
}