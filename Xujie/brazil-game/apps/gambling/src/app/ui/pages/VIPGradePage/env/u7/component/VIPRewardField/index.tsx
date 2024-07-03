import cx from "apps/gambling/src/app/ui/utils/cx";
import { GetUserVIPAllInfoResponse, GetUserVIPAllInfoResponseData } from "apps/gambling/src/app/external/UserEndpoint";
import { useEffect, useRef, useState } from "react";
import { environment } from "apps/gambling/src/environments/environment";
import t from "apps/gambling/src/assets/constant/lang";
import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint";
import { VIPInfoTabListUnitType } from "../../types";
import VIPGradeTabs from "../VIPGradeTabs";

interface VIPRewardFieldProps {
  signInTotalDays?: number;
  allLevelInfo: GetUserVIPAllInfoResponse['data'];
  className?: string
  allLevelInfoWithBonus: Array<GetUserVIPAllInfoResponseData & { signInBonus: string; upRewardAmount: string; withdrawAmountLimitDayString: string }>
}

export const VIPRewardField = ({
  className,
  signInTotalDays = 0,
  allLevelInfoWithBonus
}: VIPRewardFieldProps) => {
  const [selected, setSelected] = useState(0);

  const { isDesktop, isTablet, isMobile } = useBreakpoint();

  const vipInfoTabList: VIPInfoTabListUnitType[] = [
    {
      title: t['withdrawAmountLimitDayStringTitle'],
      iconSrc: `assets/${environment.uVersion}/vip_withdraw_amount_limit.png`,
      contentKey: 'withdrawAmountLimitDayString'
    },
    {
      title: t['withdrawTimesLimitDayTitle'],
      iconSrc: `assets/${environment.uVersion}/vip_withdraw_times_limit.png`,
      contentKey: 'withdrawTimesLimitDay'
    },
    {
      title: t['signInBonusTitle'](signInTotalDays),
      iconSrc: `assets/${environment.uVersion}/vip_sign_in_bonus.png`,
      contentKey: 'signInBonus'
    },
    {
      title: t['upRewardAmountTitle'],
      iconSrc: `assets/${environment.uVersion}/vip_up_reward.png`,
      contentKey: 'upRewardAmount'
    }
  ];

  const firstColLevelInfo = allLevelInfoWithBonus.slice(0, 10);
  const secondColLevelInfo = allLevelInfoWithBonus.slice(10, 20);
  const lastColLevelInfo = allLevelInfoWithBonus.slice(20);
  const totalColLevelInfo = isDesktop 
    ? [firstColLevelInfo, secondColLevelInfo, lastColLevelInfo]
    : [[...allLevelInfoWithBonus]];

  const handleSelected = (value:number | '+' | '-') => {
    setSelected(prevState => {
      const lastIndex = vipInfoTabList.length - 1;
      if(prevState === 0 && value === '-') return lastIndex;
      if(prevState === lastIndex && value === '+') return 0;
      if(value === '-') return prevState - 1;
      if(value === '+') return prevState + 1;

      if(typeof value === 'number' && (value <= lastIndex || value >= 0)) return value;

      return prevState;
    })
  };


  return (
    <div
      className={cx(
        "w-full",
        className
      )}
    >
      {/* 上方的 Tabs */}
      <VIPGradeTabs
        selected={selected}
        vipInfoTabList={vipInfoTabList}
        handleSelected={handleSelected}
      />

      {/* 每一個等級的列表 */}
      <div
        className={cx(
          'w-full',
          'relative',
          'bg-[var(--grayscale-40)]',
          'rounded-b-2xl',
          'px-[40px] py-[24px]',
          {
            'px-[24px]': isTablet,
            'px-[16px] py-[12px]': isMobile
          }
        )}
      >
        <div className='w-full flex gap-6'>
          
          {
            totalColLevelInfo.map((arr, arrIdx) => (
              <div 
                className={cx(
                  'flex-1',
                  'flex-0 w-full', isMobile
                )}
                key={`level - ${arr[0].level} - index - ${arrIdx}`}
              >
                {/* 最上方紫色的標籤 */}
                <div
                  className={cx(
                    'w-full h-[48px]',
                    'bg--linear-3-disabled',
                    'flex items-center',
                    'font-bold text-sm',
                    'rounded-lg',
                    {
                      'font-medium h-[40px]': isTablet,
                      'h-[36px]': isMobile,
                    }
                )}>
                  <div className={cx(
                    'w-[100px]',
                    'flex justify-center items-center',
                    { 'w-[120px]': isTablet, 'w-[80px]': isMobile }
                  )}>
                    {t['Level']}
                  </div>

                  <div className={cx(
                    'flex-1',
                    'flex justify-center items-center'
                  )}>
                    {selected === 1 ? t['Times'] : t['Bonus']}
                  </div>
                </div>

                {
                  arr.map(info => {
                    const isJackPot = (info.level >= 20) && selected === 1

                    return (
                      <div 
                        className={cx(
                          'flex',
                          'p-1 mt-3',
                          'rounded-lg',
                          'bg-[var(--transparente-10)]',
                          {
                            'mt-2': isTablet || isMobile
                          }
                        )}
                      >
                        <div
                          className={cx(
                              'w-[100px]',
                              'font-extrabold',
                              'rounded-lg',
                              'py-2',
                              'text-sm font-bold',
                              'flex items-center justify-center',
                              {
                                'bg-linear-6-main': info.level <= 19,
                                'bg-linear-4-main': info.level >= 20,
                                'w-[120px]': isTablet,
                                'w-[80px]': isMobile
                              }
                          )}
                          style={{
                            textShadow: '0 0 2px #00000080'
                          }}
                        >
                          <img 
                            className={cx(
                              'block',
                              'w-[32px]',
                              'mr-1',
                              {
                                'hidden': isMobile
                              }
                            )}
                            src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${info.level}.png`}
                            alt={`Level ${info.level} Image`} />
                          <div>VIP {info.level}</div>
                        </div>

                        <div
                          className={
                            cx(
                              'py-2 px-6',
                              'rounded-lg',
                              'flex-1 flex justify-center items-center',
                              'font-medium text-sm',
                              {
                                'justify-start px-2': isTablet || isMobile,
                                'flex-0 break-all': isMobile
                              }
                            )
                          }
                          style={isMobile ? {
                            width: 'calc(100% - 80px)'
                          } : {}}
                        >
                          {
                            !isJackPot && info[vipInfoTabList[selected].contentKey]
                          }
                          {
                            isJackPot && info.upRewardAmount
                          }
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default VIPRewardField;