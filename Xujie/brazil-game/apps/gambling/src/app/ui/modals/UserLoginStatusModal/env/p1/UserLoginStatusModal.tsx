import { UserLoginStatusDrawers } from "../../../../drawers/UserLoginStatusDrawers";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { IUserLoginStatusModal } from "../../types";
import {UserLoginStatusModal as P1UserLoginStatusModal} from '../u1/UserLoginStatusModal'
export const UserLoginStatusModal = (props: IUserLoginStatusModal) =>{
    const {isDesktop} = useBreakpoint()
    return isDesktop ? (
        <UserLoginStatusDrawers
          openNotificationWithIcon={props.openNotificationWithIcon}
          closeDrawer={props.close}
          setIsLogin={props.setIsLogin}
        />
      ):(
         <P1UserLoginStatusModal
        {...props}
        />
    )
}