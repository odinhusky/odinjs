import { IVIPGradePageProps } from "../../../index";
import { PageContainer } from "../../../../../components-bs/PageContainer";
import { environment } from "../../../../../../../environments/environment";
import { VIPLevelCard } from "../component/VIPLevelCard";
import { DesktopVIPRewardField } from "./DesktopVIPRewardField";
import { GetUserVIPAllInfoResponseData } from "../../../../../../external/UserEndpoint";


export const DesktopVIPGradePage = ({
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
      <div className='relative bg-[var(--grayscale-30)] rounded-[20px] flex justify-end'>
        <div className='absolute left-10 top-1/2 -translate-y-1/2 flex flex-col'>
          <div
            className='font-extrabold text-[2.5vw]'
            style={{
              textShadow: '-6px 6px 2px var(--grayscale-20)'
            }}
          >
            Níveis VIP:
          </div>

          <div
            className='font-extrabold text-[2vw]'
            style={{
              textShadow: '-6px 6px 2px var(--grayscale-20)'
            }}
          >
            Quanto Maior o Nível, Maior a <br/> Recompensa
          </div>
        </div>

        <img
          className='w-[700px]'
          alt='banner'
          src={`assets/${environment.uVersion}/${environment.mvVersion}/internal_banner_vip.png`}
        />
      </div>

      <VIPLevelCard
        className='mt-8'
        currentLevel={currentLevel}
        userVIPInfo={userVIPInfo}
        allLevelInfo={allLevelInfo}
      />

      <DesktopVIPRewardField
        className='mt-8'
        signInTotalDays={signInTotalDays}
        allLevelInfo={allLevelInfo}
        allLevelInfoWithBonus={allLevelInfoWithBonus}
      />
    </PageContainer>
  )
}
