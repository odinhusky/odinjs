import {renderByUVersion} from "../../utils/renderByUVersion";
import {ConfirmButton as CConfirmButton} from "./env/u1/ConfirmButton";
import {ConfirmButton as PConfirmButton} from "./env/pernambucana/ConfirmButton";
import {ConfirmButton as WConfirmButton} from "./env/wild/ConfirmButton";
import {ConfirmButton as P1ConfirmButton} from "./env/p1/ConfirmButton";

export const ConfirmButton = renderByUVersion({
  "p1":P1ConfirmButton,
  "u1": CConfirmButton,
  "wild777bet": WConfirmButton
}, PConfirmButton);
