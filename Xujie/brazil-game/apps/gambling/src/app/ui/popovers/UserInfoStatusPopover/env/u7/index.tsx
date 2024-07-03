import { GetVIPInfoResponse } from "../../../../../external/UserEndpoint"
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate"
import { useInviteInCompatible } from "../../../../hooks/useInviteInCompatible"
import cx from "../../../../utils/cx"
import t from "apps/gambling/src/assets/constant/lang"
import ProgressBarBlock from "./ProgressBarBlock"
import { PROGRESS_GRID_NUM_ARRAY } from "apps/gambling/src/assets/constant/math"
import U7TotalAccount from "./U7TotalAccount"
import U7InvitePointsInfo from "./U7InvitePointsInfo"
import { environment } from "apps/gambling/src/environments/environment"
import { CopyIcon } from "../../../../components-bs/Icons/CopyIcon"
import { AppLocalStorage } from "apps/gambling/src/app/persistant/localstorage"
import { AppLocalStorageKey } from "apps/gambling/src/app/persistant/AppLocalStorageKey"
import { IUserInfo } from "apps/gambling/src/app/persistant/IUserInfo"
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint"
import { CacheImage } from "../../../../components/image/CacheImage"
import { Avatar } from "../../../../components/Avatar"

interface IUserInfoStatusPopoverProps {
  onClose: () => void
  userVIPInfo: GetVIPInfoResponse
  currentLevel: number
  totalBalanceSheetValue: number
  totalReasableValue: number
  totalPrize: number
  bonusAwaitingSettlement: number
  fullWithdrawable: number
}

/**
 * 個人資訊頁
 */
export const U7UserInfoStatusPopover = (
  {
    onClose,
    userVIPInfo,
    totalBalanceSheetValue,
    totalReasableValue,
    totalPrize,
    bonusAwaitingSettlement,
    fullWithdrawable,
  }: IUserInfoStatusPopoverProps
) => {
  const vipScore = userVIPInfo?.data?.vip_score || 0
  const nextLevelScore = userVIPInfo?.data?.next_level_score || 1
  const flow = userVIPInfo?.data?.flow || 0
  const nextLevelFlow = userVIPInfo?.data?.next_level_flow || 0

  console.log('userVIPInfo', userVIPInfo);
  const user: IUserInfo = AppLocalStorage.getItem(AppLocalStorageKey.userInfo)
    ? JSON.parse(AppLocalStorage.getItem(AppLocalStorageKey.userInfo) || '')
    : {};
  const { isDesktop, isTablet, isMobile } = useBreakpoint();

  // - method
  const {
    onClickToSetting,
    onClickToInvite,
    onClickToBoxInvite,
  } = usePageNavigate();
  const { isShowBoxInvite } = useInviteInCompatible();

  const toInvite = isShowBoxInvite ? onClickToBoxInvite : onClickToInvite;

  // = styles
  const containerClass = cx(
    'rounded-lg',
    'bg-[var(--transparent-white-5)]',
    'py-5 px-3',
    'text-[var(--grayscale-100)]'
  );

  return (
    <div
      className={cx(
        'relative',
        'flex flex-col gap-5',
        'w-full',
        'p-3',
        'm-auto'
      )}
    >

      {/*頭像與個人資訊*/}
      <div className={cx("flex gap-3 items-center text-[var(--grayscale-100)] px-3", { 'hidden': !isMobile })}>
        <div
          className={cx(
            'border-popup-button before:border-[1px] flex-shrink-0 w-14 h-14',
            'flex items-center justify-center'
          )}
        >
          <Avatar className="w-[calc(100%-4px)] h-[calc(100%-4px)] m-auto" />
        </div>
        <div className="flex w-full">
          <div className="flex flex-col tablet:text-base text-xs gap-1 font-medium w-4/5">
            <div>
              <div className="w-[125px] truncate">
                {user.nickname}
              </div>
              <div className="flex gap-2">
                <span className="text-[var(--grayscale-70)]">
                  {user.user_id}
                </span>
                <CopyIcon
                  btnClassName={
                    'active:opacity-100 sm:hover:opacity-100'
                  }
                  copyText={user.user_id}
                  icon={
                    <div className="w-full h-full group">
                      <img
                        alt="cooy"
                        className="w-4 h-4 ml-1 block group-active:hidden"
                        src={`assets/${environment.uVersion}/icon_copy.png`}
                      />
                      <img
                        alt="cooy"
                        className="w-4 h-4 ml-1 hidden group-active:block"
                        src={`assets/${environment.uVersion}/icon_copy4.png`}
                      />
                    </div>
                  }
                />
              </div>
            </div>
            <div
              className="bg-linear-7-main text-sm w-[84px] h-[22px] py-1 px-[6px]
                  rounded-full text-center font-bold leading-[13px]"
            >
              <span className="text-linear3-main">
                VIP {userVIPInfo.data.vip_level}
              </span>
            </div>
          </div>
        </div>

        <div
          className={cx(
            'relative flex w-4 h-4 justify-center items-center cursor-pointer'
          )}
          onClick={() => {
            onClickToSetting();
          }}
        >
          <CacheImage
            className={'m-auto w-[6.38px] h-[10.15px]'}
            alt={'arrow'}
            src={`assets/${environment.uVersion}/icon_arrow_right.png`}
          />
        </div>
      </div>

      {/*VIP 資訊*/}
      <div className={cx(
        containerClass,
        'flex flex-col gap-5'
      )}>
        <ProgressBarBlock
          title={t['totalRechargeAmount']}
          progress={vipScore}
          length={nextLevelScore}
          gridNum={PROGRESS_GRID_NUM_ARRAY[3]}
          titleClass={"mobile:max-w-[137px] max-w-[93px]"}
        />

        <ProgressBarBlock
          title={t['totalBets']}
          progress={flow}
          length={nextLevelFlow}
          progressColorClass={cx('bg-linear-2-main')}
          gridNum={PROGRESS_GRID_NUM_ARRAY[3]}
          titleClass={"mobile:max-w-[137px] max-w-[93px]"}
        />
      </div>

      {/*帳戶資訊*/}
      <div className={cx(
        containerClass,
        'text-center'
      )}>
        <U7TotalAccount
          onClose={onClose}
          totalBalanceSheetValue={totalBalanceSheetValue}
          totalReasableValue={totalReasableValue}
        />
      </div>

      {/*邀請分數資訊*/}
      <div className={cx(
        containerClass,
      )}>
        <U7InvitePointsInfo
          onClose={onClose}
          toInvite={toInvite}
          totalPrize={totalPrize}
          bonusAwaitingSettlement={bonusAwaitingSettlement}
          fullWithdrawable={fullWithdrawable}
        />
      </div>
    </div>
  )
};

export default U7UserInfoStatusPopover;
