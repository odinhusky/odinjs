import {renderByUVersion} from "../../../../utils/renderByUVersion";
import {UserForgetPasswordForm as CUserForgetPasswordForm} from "./env/u1/UserForgetPasswordForm";
import {UserForgetPasswordForm as RUserForgetPasswordForm} from "./env/u2/UserForgetPasswordForm";
import {UserForgetPasswordForm as U5UserForgetPasswordForm} from "./env/u5/UserForgetPasswordForm";
import {UserForgetPasswordForm as U6UserForgetPasswordForm} from "./env/u6/UserForgetPasswordForm";
import {IUserForgetPasswordForm} from "./types";

export const UserForgetPasswordForm = (props: IUserForgetPasswordForm) => {
  return renderByUVersion({
    "u1": (
      <CUserForgetPasswordForm {...props}/>
    ),
    "u2": (
      <RUserForgetPasswordForm {...props}/>
    ),
    "u5": (
      <U5UserForgetPasswordForm {...props}/>
    ),
    "u6": (
      <U6UserForgetPasswordForm {...props}/>
    )
  }, <CUserForgetPasswordForm {...props}/>)
}
