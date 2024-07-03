import cx from "classnames"
import { UserMoneyStatusSection } from "./UserMoneyStatusSection"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../../../reduxStore"
import { AppLocalStorage } from "../../../../../persistant/localstorage"
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate"
import { IUserInfo } from "../../../../../persistant/IUserInfo"
import { AppLocalStorageKey } from "../../../../../persistant/AppLocalStorageKey"
import { NotificationAnimationIcon } from "../../../../components-bs/Icons/animation/NotificationAnimationIcon"
import { IHeader } from "../../types/IHeader"
import { uiSlice } from "../../../../../reduxStore/uiSlice"
import { appSlice } from "../../../../../reduxStore/appSlice"
import { CacheImage } from "../../../../components/image/CacheImage"
import { environment } from "../../../../../../environments/environment"
import useBreakpoint from "../../../hooks/useBreakpoint"
import { Avatar } from "../../../../components/Avatar"
import DepositBtn from "./DepositBtn"
import { tcx } from "../../../../utils/tcx"
import Icon from "../../../../components-bs/Icon"
export const Header = (props: IHeader) => {
  const user: IUserInfo = JSON.parse(
    AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || "{}"
  )
  const { isLogin, messageCount, vip_level } = useSelector(
    (state: RootState) => state.app
  )
  const currentUserVipLevel = vip_level || user.vip_level
  const openUserInfoStatusPopover = useSelector(
    (state: RootState) => state.ui.openUserInfoStatusPopover
  )
  const { onClickToIndex, onClickToProfile } = usePageNavigate()
  const dispatch = useDispatch()
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const openMenuDrawer = useSelector(
    (state: RootState) => state.ui.openMenuDrawer
  )
  return (
    <header
      className={tcx(
        "flex justify-between items-center h-12 px-3 bg-header",
        props.className
      )}
    >
      <div className="flex items-center gap-2">
        <button className="bg-[var(--transparent-10)] rounded p-2 w-8 h-8">
          <Icon
            size="16"
            name="menu_default"
            onClick={() => {
              dispatch(uiSlice.actions.setOpenMenuDrawer(!openMenuDrawer))
            }}
          />
          {/* <img
            src={`assets/${environment.uVersion}/${environment.mVersion}/icon_menu.png`}
            alt="menu"
            onClick={() => {
              dispatch(uiSlice.actions.setOpenMenuDrawer(!openMenuDrawer))
            }}
          /> */}
        </button>
        <img
          className="w-24 cursor-pointer"
          src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}
          alt="logo"
          onClick={() => onClickToIndex()}
        />
      </div>
      {isLogin ? (
        <div className="flex items-center gap-2">
          <UserMoneyStatusSection />
          <DepositBtn />
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            className="tertiary-button text-xs rounded-[4px] w-16 h-7 font-bold text-[var(--background-popup)]"
            onClick={() => {
              dispatch(appSlice.actions.showLoginDrawerOrModal(true))
              dispatch(appSlice.actions.setLoginUIStatusType("login"))
            }}
          >
            Entrar
          </button>
          <button
            className="text-xs border border-[var(--tertiary-main)] rounded-[4px] w-16 h-7 font-bold text-[var(--tertiary-main)]"
            onClick={() => {
              dispatch(appSlice.actions.showLoginDrawerOrModal(true))
              dispatch(appSlice.actions.setLoginUIStatusType("register"))
            }}
          >
            Registro
          </button>
        </div>
      )}
    </header>
  )
}
