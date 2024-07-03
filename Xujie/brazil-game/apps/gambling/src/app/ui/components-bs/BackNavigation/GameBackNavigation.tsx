import {GameBackNavigation as CocoGameBackNavigation} from "./env/u1/GameBackNavigation";
import {GameBackNavigation as U5GameBackNavigation} from "./env/u5/GameBackNavigation";
import {GameBackNavigation as PernambucanaGameBackNavigation} from "./env/pernambucana/GameBackNavigation";
import {GameBackNavigation as WildGameBackNavigation} from "./env/wild/GameBackNavigation";
import {GameBackNavigation as U6GameBackNavigation} from "./env/u6/GameBackNavigation";
import {GameBackNavigation as U7GameBackNavigation} from "./env/u7/GameBackNavigation";
import {renderByUVersion} from "../../utils/renderByUVersion";


export const GameBackNavigation = renderByUVersion({
  "p1": CocoGameBackNavigation,
  "u1": CocoGameBackNavigation,
  "wild777bet": WildGameBackNavigation,
  "u2": CocoGameBackNavigation,
  "u5": U5GameBackNavigation,
  "u6": U6GameBackNavigation,
  "u7": U7GameBackNavigation
}, PernambucanaGameBackNavigation);
