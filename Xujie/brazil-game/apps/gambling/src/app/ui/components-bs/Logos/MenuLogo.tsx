import React from "react";
import {renderByUVersion} from "../../utils/renderByUVersion";
import {MenuLogo as CMenuLogo} from "./env/u1/MenuLogo";
import {MenuLogo as RMenuLogo} from "./env/u2/MenuLogo";
import {MenuLogo as U5MenuLogo} from "./env/u5/MenuLogo";
import {ILogo} from "./env/types";

export const MenuLogo = (props: ILogo) => {
  return renderByUVersion({
    "wild777bet": <CMenuLogo {...props}/>,
    "u1":  <CMenuLogo {...props}/>,
    "u2": <RMenuLogo {...props}/>,
    "u5": <U5MenuLogo {...props}/>,
  }, <CMenuLogo {...props}/>)
}
