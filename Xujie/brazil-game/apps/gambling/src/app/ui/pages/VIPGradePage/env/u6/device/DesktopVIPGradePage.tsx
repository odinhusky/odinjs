import { IVIPGradePageProps } from "../../../index";
import { PageContainer } from "../../../../../components-bs/PageContainer";
import { environment } from "../../../../../../../environments/environment";
import { VIPLevelCard } from "../component/VIPLevelCard";
import { GetUserVIPAllInfoResponseData } from "../../../../../../external/UserEndpoint";

import { BackNavigation } from "apps/gambling/src/app/ui/components-bs/BackNavigation/BackNavigation";
import { usePageNavigate } from "apps/gambling/src/app/ui/router/hooks/usePageNavigate";

import cx from "apps/gambling/src/app/ui/utils/cx";
import VIPRewardField from "../component/VIPRewardField";
import t from "apps/gambling/src/assets/constant/lang";

export const DesktopVIPGradePage = ({
  currentLevel,
  allLevelInfo,
  userVIPInfo,
  signInTotalDays,
  allLevelInfoWithBonus
}: IVIPGradePageProps & { allLevelInfoWithBonus: Array<GetUserVIPAllInfoResponseData & { signInBonus: string; upRewardAmount: string; withdrawAmountLimitDayString: string }>}) => {

  if(allLevelInfo.length === 0) return <div></div>

	const { onClickToIndex } = usePageNavigate();

  return (
    <PageContainer
      className={cx(
        'text-white'
      )}
    >
      {/*<BackNavigation*/}
      {/*  className={cx('text-xl leading-7')}*/}
		{/*		onClick={() => onClickToIndex()}*/}
		{/*	/>*/}

      <div className="relative rounded-[20px] mt-[28px]">
        <img
          src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_vip.png`}
          alt="banner"
        />

        <div className={cx(
          'flex flex-col justify-center',
          'w-full h-full',
          'absolute top-0 left-0',
          'px-[64px] py-[44px]',
          'text-[48px] leading-[56px]',
          'deskLg:text-[56px] deskLg:leading-[64px] font-black'
        )}>
          <div>
            <div>{t['vipBannerText1']}</div>
            <div>{t['vipBannerText2DeskTop']}</div>
            <div>{t['vipBannerText3DeskTop']}</div>
          </div>
        </div>
      </div>

      <div className={cx(
        'px-[48px] py-[40px]',
        'mt-6',
        'bg-[var(--grayscale-30)]',
        'rounded-2xl'
      )}>
        <VIPLevelCard
          currentLevel={currentLevel}
          userVIPInfo={userVIPInfo}
          allLevelInfo={allLevelInfo}
        />

        <VIPRewardField
          signInTotalDays={signInTotalDays}
          allLevelInfo={allLevelInfo}
          allLevelInfoWithBonus={allLevelInfoWithBonus}
        />
      </div>
    </PageContainer>
  )
}
