import { IVIPGradePageProps } from "../../../index";
import { GetUserVIPAllInfoResponseData } from "../../../../../../external/UserEndpoint";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {environment} from "../../../../../../../environments/environment";
import {MobileLevelCard} from "../component/MobileLevelCard";
import {MobileVIPRewardField} from "./MobileVIPRewardField";


export const MobileVIPGradePage = ({
  currentLevel,
  allLevelInfo,
  userVIPInfo,
  signInTotalDays,
  allLevelInfoWithBonus
}: IVIPGradePageProps & { allLevelInfoWithBonus: Array<GetUserVIPAllInfoResponseData & { signInBonus: string; upRewardAmount: string; withdrawAmountLimitDayString: string }>}) => {

  if(allLevelInfo.length === 0) return <div></div>

  return (
    <PageContainer
      className='text-white'
    >
      <div className='relative bg-[var(--grayscale-30)] rounded-lg flex justify-end'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2 flex flex-col'>
          <div
            className='font-extrabold text-base'
            style={{
              textShadow: '-6px 6px 2px var(--grayscale-20)'
            }}
          >
            Níveis VIP:
          </div>

          <div
            className='font-extrabold text-sm mt-1'
            style={{
              textShadow: '-6px 6px 2px var(--grayscale-20)'
            }}
          >
            Quanto Maior o Nível, Maior a <br /> Recompensa
          </div>
        </div>

        <img
          className='w-[260px]'
          alt='banner'
          src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_vip_m.png`}
        />
      </div>

      <MobileLevelCard
        currentLevel={currentLevel}
        allLevelInfo={allLevelInfo}
        userVIPInfo={userVIPInfo}
      />

      <MobileVIPRewardField
        allLevelInfoWithBonus={allLevelInfoWithBonus}
        signInTotalDays={signInTotalDays}
      />

    </PageContainer>
  )
}
