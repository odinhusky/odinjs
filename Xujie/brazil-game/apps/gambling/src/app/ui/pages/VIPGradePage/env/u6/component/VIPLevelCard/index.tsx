import { environment } from "../../../../../../../../environments/environment";
import { GetUserVIPAllInfoResponse, GetVIPInfoResponse } from "../../../../../../../external/UserEndpoint";
import { useVIPGradePage } from "../../../../hook/useVIPGradePage";
import useBreakpoint from "../../../../../../pageTemplate/hooks/useBreakpoint";
import VIPImageCtrl from "../VIPImageCtrl/VIPImageCtrl";
import VIPProgress from "../VIPProgress";
import VIPImage from "../VIPImage";
import cx from "apps/gambling/src/app/ui/utils/cx";
import t from "apps/gambling/src/assets/constant/lang";

interface IVIPLevelCardProps {
  currentLevel: number
  arrowPadding?: number
  className?: string
  userVIPInfo?: GetVIPInfoResponse
  allLevelInfo: GetUserVIPAllInfoResponse['data']
}

export const VIPLevelCard = ({
  currentLevel,
  arrowPadding,
  className,
  userVIPInfo,
  allLevelInfo
}: IVIPLevelCardProps) => {
  const { selectedVIP, setSelectedVIP } = useVIPGradePage(currentLevel, userVIPInfo?.data.vip_score)

  // console.log('@@ selectedVIP', selectedVIP, currentLevel)

  const handleChangeLevel = (value: -1 | 1) => {
    if(selectedVIP !== 0 && value === -1) {
      setSelectedVIP((prev) => prev + value)
    }

    if(selectedVIP !== 25 && value === 1) {
      setSelectedVIP((prev) => prev + value)
    }
  }

  const { isDesktop, isTablet, isMobile } = useBreakpoint();

  return (
    <div className={cx(
      'relative',
      'bg-[var(--grayscale-40)]',
      'px-[48px] py-[28px]',
      'rounded-2xl',
      'flex items-center',
      {
        'gap-0 flex-col px-[24px] py-[16px]': isTablet,
        'gap-0 flex-col px-[16px] pb-[18px] pt-[12px]': isMobile,
      },
      className
    )}>
      <div className={cx(
        'relative',
        'w-full phone:w-[348px]',
        'px-[32px]',
        'flex justify-center items-center',
      )}>
        {/*left btn*/}
        <VIPImageCtrl 
          direction="left"
          disabled={selectedVIP === 0}
          handleChangeLevel={handleChangeLevel}
          arrowPadding={arrowPadding}
        />

        {/*right btn*/}
        <VIPImageCtrl 
          direction="right"
          disabled={!(selectedVIP < allLevelInfo.length -1)}
          handleChangeLevel={handleChangeLevel}
          arrowPadding={arrowPadding}
        />

        {/* 上一個等級(左) */}
        <VIPImage
          isShowVIPImage={selectedVIP > 0}
          src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${selectedVIP - 1}${selectedVIP - 1 >= 20 ? '_img' : ''}.png`}
          alt={`vip${selectedVIP - 1}`}
          isShowVIPLock={currentLevel < (selectedVIP - 1)}
          imgClass={cx('w-[52px]', { 'w-[32px]': isMobile })}
          containerClass={cx('relative', 'mr-3')}
        />

        {/* 當前關注等級(中) */}
        <VIPImage
          src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${selectedVIP}${selectedVIP >= 20 ? '_img' : ''}.png`}
          alt={`Vip${selectedVIP} image`}
          isBiggerLock={true}
          isShowVIPLock={currentLevel < selectedVIP}
          imgClass={cx(
            'w-[160px]',
            { 
              'w-[136px]': isTablet,
              'w-[106px]': isMobile
            }
          )}
          containerClass="relative"
        />

        {/* 下一個等級(右) */}
        <VIPImage
          isShowVIPImage={selectedVIP < 25}
          src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${selectedVIP + 1}${selectedVIP + 1 >= 20 ? '_img' : ''}.png`}
          alt={`vip${selectedVIP + 1}`}
          isShowVIPLock={currentLevel < (selectedVIP + 1)}
          imgClass={cx('w-[52px]', { 'w-[32px]': isMobile })}
          containerClass={cx('relative', 'ml-3')}
        />
      </div>

      {/* 進度條 */}
      <div className={cx(
        'flex-1 w-full',
        'ml-4 pl-4',
        'border-l border-[var(--grayscale-70)]',
        {
          'ml-0 pl-0 border-l-0 border-t mt-2 pt-2': isTablet,
          'ml-0 pl-0 border-l-0 border-t mt-3 pt-3': isMobile
        }
      )}>
        {
          selectedVIP !== 0 && (
            <div
              className='w-full flex flex-col'
            >
              <VIPProgress
                title={t['totalRechargeAmount']}
                numerator={userVIPInfo?.data?.vip_score}
                denominator={allLevelInfo[selectedVIP].rechargeAmountLimit}
              />

              <VIPProgress
                title={t['totalBetAmount']}
                numerator={userVIPInfo?.data?.flow}
                denominator={allLevelInfo[selectedVIP].flowLimit}
                className="mt-4 tablet:mt-5"
              />
            </div>
          )
        }

        {
          selectedVIP === 0 && (
            <div className={
              cx(
                'w-full font-bold text-base',
                isTablet && "text-sm"
              )
            }>
              {t['level0Desc'](environment.platformName)}
            </div>
          )
        }
      </div>
    </div>
  )
}
