import { InitialChargeContent as CInitialChargeContent } from "./env/u1/InitialChargeContent";
import { InitialChargeContent as PInitialChargeContent } from "./env/p1/InitialChargeContent";
import { InitialChargePage as RioInitialChargePage } from './env/u2';

import { InitialChargeContent as WInitialChargeContent } from "./env/wild/InitialChargeContent";
import { renderByUVersion } from "../../utils/renderByUVersion";
import { InitialChargePage as U5InitialChargePage } from './env/u5';
import { InitialChargePage as U6InitialChargePage } from './env/u6';
import { InitialChargePage as U7InitialChargePage } from './env/u7';

export type IInitialChargePage = {
  isFromActivity: boolean;
}
export const InitialChargePage = (props: IInitialChargePage) => {

  return renderByUVersion({
    "wild777bet": <WInitialChargeContent />,
    "p1": <PInitialChargeContent{...props}  />,
    "u1": <CInitialChargeContent {...props} />,
    "u2": <RioInitialChargePage{...props}  />,
    "u5": <U5InitialChargePage />,
    "u6": <U6InitialChargePage {...props}/>,
    "u7": <U7InitialChargePage {...props}/>,
  }, <PInitialChargeContent {...props} />)
}
