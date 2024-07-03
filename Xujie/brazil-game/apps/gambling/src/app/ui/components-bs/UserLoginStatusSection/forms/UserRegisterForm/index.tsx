import {renderByUVersion} from "../../../../utils/renderByUVersion";
import {UserRegisterForm as CUserRegisterForm} from "./env/u1/UserRegisterForm";
import {UserRegisterForm as RUserRegisterForm} from "./env/u2/UserRegisterForm";
import {UserRegisterForm as P1UserRegisterForm} from "./env/p1/UserRegisterForm";
import {UserRegisterForm as U5UserRegisterForm} from "./env/u5/UserRegisterForm";
import {UserRegisterForm as U6UserRegisterForm} from "./env/u6/UserRegisterForm";
import {IUserRegisterForm} from "./types";

export const UserRegisterForm = (props: IUserRegisterForm) => {
  return renderByUVersion({
    "p1": (<P1UserRegisterForm  {...props}/>),
    "u1": (<CUserRegisterForm {...props}/>),
    "u2": (<RUserRegisterForm {...props}/>),
    "u5": (<U5UserRegisterForm {...props}/>),
    "u6": (<U6UserRegisterForm {...props}/>)
  }, <CUserRegisterForm {...props}/>)
}
