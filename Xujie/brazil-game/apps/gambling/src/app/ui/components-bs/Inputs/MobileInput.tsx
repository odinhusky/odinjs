import {WithdrawMobileInput as PCWithdrawMobileInput} from "./env/pernambucana/WithdrawMobileInput";
import {WithdrawMobileInput as PWithdrawMobileInput} from "./env/p1/WithdrawMobileInput";
import {WithdrawMobileInput as CWithdrawMobileInput} from "./env/u1/WithdrawMobileInput";
import {WithdrawMobileInput as WWithdrawMobileInput} from "./env/wild/WithdrawMobileInput";
import {WithdrawMobileInput as RWithdrawMobileInput} from "./env/u2/WithdrawMobileInput";

import {renderByUVersion} from "../../utils/renderByUVersion";

// export const MobileInput = WithdrawMobileInput;
export const MobileInput = renderByUVersion({
  "p1": PWithdrawMobileInput,
  "u1": CWithdrawMobileInput,
  "wild777bet": WWithdrawMobileInput,
  "u2": RWithdrawMobileInput,
  "u5": RWithdrawMobileInput,
}, PCWithdrawMobileInput);
