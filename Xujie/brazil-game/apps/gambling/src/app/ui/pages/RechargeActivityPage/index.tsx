import {useAllowLoginRouterRules} from "../../router/hooks/useAllowLoginRouterRules";
import {renderByUVersion} from "../../utils/renderByUVersion";
import {RechargeActivityContent as CRechargeActivityContent} from './env/u1/RechargeActivityContent';
import {RechargeActivityContent as PRechargeActivityContent} from './env/p1/RechargeActivityContent';
import {RechargeActivityPage as RioRechargeActivityPage} from './env/u2';
import {RechargeActivityPage as U5RechargeActivityPage} from './env/u5';
import {RechargeActivityPage as U6RechargeActivityPage} from './env/u6';
import {RechargeActivityPage as U7RechargeActivityPage} from './env/u7';

export type IRechargeActivityPage = {
    isFromActivity: boolean;
}
export const RechargeActivityPage = (props: IRechargeActivityPage) => {
    useAllowLoginRouterRules();

    return renderByUVersion({
        "p1": <PRechargeActivityContent {...props}/>,
        "u1": <CRechargeActivityContent {...props}/>,
        "u2": <RioRechargeActivityPage {...props}/>,
        "u5": <U5RechargeActivityPage/>,
        "u6": <U6RechargeActivityPage {...props} />,
        "u7": <U7RechargeActivityPage {...props} />,
    }, <PRechargeActivityContent {...props}/>)
}
