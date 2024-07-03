// import { environment } from "../../../../../../environments/environment"
// import { Avatar } from "../../../../components/Avatar"
// import { IUserInfo } from "../../../../../persistant/IUserInfo"
// import { AppLocalStorage } from "../../../../../persistant/localstorage"
// import { AppLocalStorageKey } from "../../../../../persistant/AppLocalStorageKey"
// import { CopyIcon } from "../../../../components-bs/Icons/CopyIcon"
// import { useDispatch } from "react-redux"
// import { appSlice } from "../../../../../reduxStore/appSlice"
// import { formatLocaleMoney } from "../../../../utils/format"
// import { ProgressBar } from "../../../../components-bs/ProgressBar"
// import { usePageNavigate } from "../../../../router/hooks/usePageNavigate"
import { GetVIPInfoResponse } from "../../../../../external/UserEndpoint"
// import { ReactNode } from "react"
import { MyPageContent } from "../../../../components-bs/MyPage"

interface IUserInfoStatusPopoverProps {
  close?: () => void
  userVIPInfo: GetVIPInfoResponse
  currentLevel: number
  totalBalanceSheetValue: number
  totalReasableValue: number
  totalPrize: number
  bonusAwaitingSettlement: number
  fullWithdrawable: number
}
// const MyButton = ({
//   onClick,
//   className,
//   children,
// }: {
//   onClick: () => void
//   className: string
//   children: ReactNode
// }) => {
//   return (
//     <button
//       className={`relative group cursor-pointer flex justify-center items-center text-sm text-white font-bold rounded-[100px] ${className}`}
//       onClick={onClick}
//     >
//       <div className="w-full h-full font-extrabold  bg-gradient-to-r group-hover:from-[var(--liner-2-light-hover-from)] group-hover:to-[var(--liner-2-main-to)] group-active:from-[var(--liner-2-dark-active-from)] group-active:to-[var(--liner-2-main-to)] from-[var(--liner-2-main-from)] to-[var(--liner-2-dark-active-to)] flex justify-center items-center shadow-[0px_-4px_4px_0px_#00000040_inset] rounded-[100px]">
//         {children}
//       </div>
//       <div className="w-full h-full absolute left-0 top-0 shadow-[0px_4px_4px_0px_#FFFFFF40_inset] rounded-[100px]" />
//     </button>
//   )
// }
export const UserInfoStatusPopover = (
  {
    close,
    currentLevel,
    userVIPInfo,
    totalBalanceSheetValue,
    totalReasableValue,
    totalPrize,
    bonusAwaitingSettlement,
    fullWithdrawable,
  }: IUserInfoStatusPopoverProps
) => {
  // const user: IUserInfo = AppLocalStorage.getItem(AppLocalStorageKey.userInfo)
  //   ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || "")
  //   : {}

  // const {
  //   onClickToWallet,
  //   onClickToInvite,
  //   onClickToSetting,
  //   onClickToGameRecord,
  //   onClickToPrivacyAgreement,
  //   onClickToCompanyProfile,
  // } = usePageNavigate()

  // const dispatch = useDispatch()

  // const vipScore = userVIPInfo?.data?.vip_score || 0
  // const nextLevelScore = userVIPInfo?.data?.next_level_score || 1
  // const flow = userVIPInfo?.data?.flow || 0
  // const nextLevelFlow = userVIPInfo?.data?.next_level_flow || 0

  // const depositPercent = vipScore / nextLevelScore
  // const flowPercent = flow / nextLevelFlow

  return (
    <MyPageContent 
      className='' 
      close={close} 
      showClose={true} 
      currentLevel={currentLevel} 
      userVIPInfo={userVIPInfo}
      
      totalBalanceSheetValue = {totalBalanceSheetValue}
      totalReasableValue = {totalReasableValue}
      totalPrize = {totalPrize}
      bonusAwaitingSettlement = {bonusAwaitingSettlement}
      fullWithdrawable = {fullWithdrawable}

    ></MyPageContent>
  )
}
