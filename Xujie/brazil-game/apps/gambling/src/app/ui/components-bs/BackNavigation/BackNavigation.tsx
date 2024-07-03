import {BackNavigation as CocoBackNavigation} from "./env/u1/BackNavigation";
import {BackNavigation as PernambucanaBackNavigation} from "./env/pernambucana/BackNavigation";
import {BackNavigation as WildBackNavigation} from "./env/wild/BackNavigation";
import {renderByUVersion} from "../../utils/renderByUVersion";
import {BackNavigation as U9BackNavigation} from "./env/u9/BackNavigation"
import {BackNavigation as U7BackNavigation} from "./env/u7/BackNavigation";

export const BackNavigation = renderByUVersion({
    "p1": CocoBackNavigation,
    "u1": CocoBackNavigation,
    "wild777bet": WildBackNavigation,
    "u2": CocoBackNavigation,
    "u5": CocoBackNavigation,
    "u6": CocoBackNavigation,
    "u7": U7BackNavigation,
    "u9": U9BackNavigation,
  }, PernambucanaBackNavigation);
