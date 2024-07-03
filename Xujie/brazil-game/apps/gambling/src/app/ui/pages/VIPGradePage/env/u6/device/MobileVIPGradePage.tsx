import { IVIPGradePageProps } from "../../../index";
import { GetUserVIPAllInfoResponseData } from "../../../../../../external/UserEndpoint";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {environment} from "../../../../../../../environments/environment";
import { VIPLevelCard } from "../component/VIPLevelCard";
import { BackNavigation } from "apps/gambling/src/app/ui/components-bs/BackNavigation/BackNavigation";
import { usePageNavigate } from "apps/gambling/src/app/ui/router/hooks/usePageNavigate";
import cx from "apps/gambling/src/app/ui/utils/cx";
import VIPRewardField from "../component/VIPRewardField";
import t from "apps/gambling/src/assets/constant/lang";

export const MobileVIPGradePage = ({
  currentLevel,
  allLevelInfo,
  userVIPInfo,
  signInTotalDays,
  allLevelInfoWithBonus
}: IVIPGradePageProps & { allLevelInfoWithBonus: Array<GetUserVIPAllInfoResponseData & { signInBonus: string; upRewardAmount: string; withdrawAmountLimitDayString: string }>}) => {

	const { onClickToIndex } = usePageNavigate();

  if(allLevelInfo.length === 0) return <div></div>

  return (
    <PageContainer
      className={cx(
        'text-white',
        'pt-3'
      )}
    >
      {/*<BackNavigation*/}
      {/*  className={cx('text-base leading-6')}*/}
		{/*		onClick={() => onClickToIndex()}*/}
		{/*	/>*/}

      <div className="relative rounded-[20px] mt-3">
        <img
          src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_vip_m.png`}
          alt="banner"
        />
        <div className={cx(
          'flex flex-col justify-center',
          'w-full h-full',
          'absolute top-0 left-0',
          'px-[16px] py-[22px]',
          'font-black text-white',
          'text-[20px] leading-[28px]',
          'phone:text-[24px] phone:leading-[32px]',
          'fold:text-[32px] fold:leading-[40px]',
          'mob:text-[36px] mob:leading-[44px]',
        )}>
          <div>{t['vipBannerText1']}</div>
          <div>{t['vipBannerText2Mobile']}</div>
          <div>{t['vipBannerText3Mobile']}</div>
        </div>
      </div>

      <div className={cx(
        'px-[20px] py-[16px]',
        'mt-3',
        'bg-[var(--grayscale-30)]',
        'rounded-2xl',
      )}>
        <VIPLevelCard
          currentLevel={currentLevel}
          allLevelInfo={allLevelInfo}
          userVIPInfo={userVIPInfo}
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
