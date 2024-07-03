import {renderByUVersion} from "../../utils/renderByUVersion";
import React from "react";
import {ActivityRedeemableModal as U1ActivityRedeemableModal} from "../ActivityRedeemableModal/env/u1/index";
import {ActivityRedeemableModal as U2ActivityRedeemableModal} from "../ActivityRedeemableModal/env/u2/index";
import {ActivityRedeemableModal as P1ActivityRedeemableModal} from "../ActivityRedeemableModal/env/p1/index";
import {ActivityRedeemableModal as U5ActivityRedeemableModal} from "../ActivityRedeemableModal/env/u5/index";
import {ActivityRedeemableModal as U6ActivityRedeemableModal} from "../ActivityRedeemableModal/env/u6/index";
import {ActivityRedeemableModal as U7ActivityRedeemableModal} from "../ActivityRedeemableModal/env/u7/index";
export type IActivityRedeemableModal = {
    redeemableAmount: string;
    title: string;
    submitText: string;
    onClick: () => void;
    onCloseClick: () => void;
}

export const ActivityRedeemableModal = (props: IActivityRedeemableModal) => {
    return renderByUVersion({
        "u1": <U1ActivityRedeemableModal {...props}/>,
        "u2": <U2ActivityRedeemableModal {...props}/>,
        "p1": <P1ActivityRedeemableModal {...props}/>,
        "u5": <U5ActivityRedeemableModal {...props}/>,
        "u6": <U6ActivityRedeemableModal {...props}/>,
        "u7": <U7ActivityRedeemableModal {...props}/>,
    }, <U1ActivityRedeemableModal {...props}/>);
}