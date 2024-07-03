import {renderByUVersion} from "../../../utils/renderByUVersion";
import {ActivityRecordButton as U1ActivityRecordButton} from "../HallPage/env/u1/ActivityRecordButton";
import {ActivityRecordButton as U2ActivityRecordButton} from "../HallPage/env/u2/ActivityRecordButton";
import {ActivityRecordButton as P1ActivityRecordButton} from "../HallPage/env/p1/ActivityRecordButton";
import {ActivityRecordButton as U5ActivityRecordButton} from "../HallPage/env/u5/ActivityRecordButton";
import React from "react";

export interface IActivityRecordButton {
    name: string,
    className: string;
    onClick?: () => void;

}

export const ActivityRecordButton = (props: IActivityRecordButton) => {

    return renderByUVersion({
        "u1": (
            <U1ActivityRecordButton
                {...props}
            />
        ),
        "u2": (
            <U2ActivityRecordButton
                {...props}
            />
        ),
        "p1": (
            <P1ActivityRecordButton
                {...props}
            />
        ),
        "u5": (
            <U5ActivityRecordButton
                {...props}
            />
        ),
        "u6": (
            <U1ActivityRecordButton
                {...props}
            />
        ),
        "u7": (
            <U1ActivityRecordButton
                {...props}
            />
        ),
    }, (
        <U1ActivityRecordButton
            {...props}
        />
    ))
}