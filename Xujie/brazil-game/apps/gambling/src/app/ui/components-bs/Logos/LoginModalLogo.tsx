import React from "react";
import {renderByUVersion} from "../../utils/renderByUVersion";
import {LoginModalLogo as U1LoginModalLogo} from "./env/u1/LoginModalLogo";
import {LoginModalLogo as U2LoginModalLogo} from "./env/u2/LoginModalLogo";
import {LoginModalLogo as U5LoginModalLogo} from "./env/u5/LoginModalLogo";
import {ILogo} from "./env/types";


export const LoginModalLogo = (props: ILogo) => {
  return renderByUVersion({
    "wild777bet": <U1LoginModalLogo {...props} />,
    "u1":  <U1LoginModalLogo {...props} />,
    "u2": <U2LoginModalLogo {...props} />,
    "u5": <U5LoginModalLogo {...props} />,
  }, <U1LoginModalLogo {...props} />,)
}
