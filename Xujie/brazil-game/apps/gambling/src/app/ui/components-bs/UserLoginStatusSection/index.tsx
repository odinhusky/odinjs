import {renderByUVersion} from "../../utils/renderByUVersion";
import {UserLoginStatusSection as CUserLoginStatusSection} from "./env/u1/UserLoginStatusSection"
import {UserLoginStatusSection as RUserLoginStatusSection} from "./env/u2/UserLoginStatusSection"
import {UserLoginStatusSection as PUserLoginStatusSection} from "./env/p1/UserLoginStatusSection"
import {UserLoginStatusSection as U5UserLoginStatusSection} from "./env/u5/UserLoginStatusSection"
import {UserLoginStatusSection as U6UserLoginStatusSection} from "./env/u6/UserLoginStatusSection"
import {IUserLoginStatusSection} from "./types";


export const UserLoginStatusSection = (props: IUserLoginStatusSection) => {
  return renderByUVersion({
    "p1": (
      <PUserLoginStatusSection {...props} />
    ),
    "u1": (
      <CUserLoginStatusSection {...props} />
    ),
    "u2": (
      <RUserLoginStatusSection {...props} />
    ),
    "u5": (
      <U5UserLoginStatusSection {...props} />
    ),
    "u6": (
      <U6UserLoginStatusSection {...props} />
    )
  }, <CUserLoginStatusSection {...props} />)
}

