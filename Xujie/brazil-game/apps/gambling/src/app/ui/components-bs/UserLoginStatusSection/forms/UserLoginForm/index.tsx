import {renderByUVersion} from "../../../../utils/renderByUVersion";
import {UserLoginForm as PUserLoginForm} from "./env/p1/UserLoginForm";
import {UserLoginForm as CUserLoginForm} from "./env/u1/UserLoginForm";
import {UserLoginForm as RUserLoginForm} from "./env/u2/UserLoginForm";
import {UserLoginForm as U5UserLoginForm} from "./env/u5/UserLoginForm";
import {UserLoginForm as U6UserLoginForm} from "./env/u6/UserLoginForm";
import {IUserLoginForm} from "./types";

export const UserLoginForm = (props: IUserLoginForm) => {
  return renderByUVersion({
    "p1": (
      <PUserLoginForm {...props} />
    ),
    "u1": (
      <CUserLoginForm {...props} />
    ),
    "u2": (
      <RUserLoginForm {...props} />
    ),
    "u5": (
      <U5UserLoginForm {...props} />
    ),
    "u6": (
      <U6UserLoginForm {...props} />
    )
  }, <CUserLoginForm {...props} />)
}

