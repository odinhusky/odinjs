import { IVIPGradePageProps } from "../../../index";
import { GetUserVIPAllInfoResponseData } from "../../../../../../external/UserEndpoint";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {environment} from "../../../../../../../environments/environment";
import {VIPLevelCard} from "../component/VIPLevelCard";
import {TabletVIPRewardField} from "./TabletVIPRewardField";


export const TabletVIPGradePage = ({
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
      <div className='relative bg-[var(--grayscale-30)] rounded-[12px] flex justify-end'>
        <div className='absolute left-10 top-1/2 -translate-y-1/2 flex flex-col'>
          <div
            className='font-extrabold text-3xl'
            style={{
              textShadow: '-6px 6px 2px var(--grayscale-20)'
            }}
          >
            Níveis VIP:
          </div>

          <div
            className='font-extrabold text-xl'
            style={{
              textShadow: '-6px 6px 2px var(--grayscale-20)'
            }}
          >
            Quanto Maior o Nível, Maior a Recompensa
          </div>
        </div>

        <img
          className='w-[450px]'
          alt='banner'
          src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_vip_t.png`}
        />
      </div>

      <VIPLevelCard
        className='mt-5'
        currentLevel={currentLevel}
        allLevelInfo={allLevelInfo}
        userVIPInfo={userVIPInfo}
        arrowPadding={20}
      />

      <TabletVIPRewardField
        className='mt-5'
        allLevelInfoWithBonus={allLevelInfoWithBonus}
        signInTotalDays={signInTotalDays}
      />

    </PageContainer>
  )
}
