import React from "react";

import {renderByUVersion} from "../../utils/renderByUVersion";
import {FooterLogo as CFooterLogo} from "./env/u1/FooterLogo";
import {FooterLogo as RFooterLogo} from "./env/u2/FooterLogo";
import {FooterLogo as U5FooterLogo} from "./env/u5/FooterLogo";
import {ILogo} from "./env/types";

export const FooterLogo = (props: ILogo) => {
  return renderByUVersion({
    "wild777bet": <CFooterLogo {...props}/>,
    "u1":  <CFooterLogo {...props}/>,
    "u2": <RFooterLogo {...props}/>,
    "u5": <U5FooterLogo {...props}/>,
  }, <CFooterLogo {...props}/>,)
}
