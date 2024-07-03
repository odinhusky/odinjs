import { IVIPGradePageProps } from '../../index';
import { PageContainer } from '../../../../components-bs/PageContainer';
import { environment } from '../../../../../../environments/environment';
import { GetUserVIPAllInfoResponseData } from '../../../../../external/UserEndpoint';

import { BackNavigation } from 'apps/gambling/src/app/ui/components-bs/BackNavigation/BackNavigation';
import { usePageNavigate } from 'apps/gambling/src/app/ui/router/hooks/usePageNavigate';

import cx from 'apps/gambling/src/app/ui/utils/cx';
import t from 'apps/gambling/src/assets/constant/lang';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { useVIPGradePage } from '../../hook/useVIPGradePage';
import { useScrollSelectFixCenter } from '../../../../hooks/useScrollSelectFixCenter';
import VIPProgress from './component/VIPProgress';
import { VIPInfoTabListUnitType } from './types';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';

const VIPRewardIcon = ({
  selectedVIP,
  isShowCar,
  className,
  infoContentClassName,
  txtContentClassName,
  txt1ClassName,
  txt2ClassName,
}: {
  selectedVIP: number;
  isShowCar: boolean;
  className?: string;
  infoContentClassName?: string;
  txtContentClassName?: string;
  txt1ClassName?: string;
  txt2ClassName?: string;
}) => {
  const carInfo: { [index: number]: string } = {
    20: 'Audi a4',
    21: 'BMW 520I',
    22: 'Porsche Cayenne',
    23: 'Porsche 911',
    24: 'Ferrari448',
    25: 'Helicóptero',
  };
  return (
    <div className={cx(FLEX_CENTER, className)}>
      {isShowCar ? (
        <>
          <div
            className={cx(FLEX_CENTER, 'flex-col gap-3', infoContentClassName)}
          >
            <img
              src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${selectedVIP}_img.png`}
              alt="vip"
            />
            <div className={cx('', txtContentClassName)}>
              <div
                className={cx(
                  'text-base text-[var(--grayscale-100)] text-center font-medium',
                  txt1ClassName
                )}
              >
                Nível Mega Jackpot : {carInfo[selectedVIP]}
              </div>
              <div
                className={cx(
                  'text-sm text-[var(--grayscale-100)] text-center font-medium opacity-70 tablet:whitespace-nowrap',
                  txt2ClassName
                )}
              >
                Ou numerário de valor equivalente
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <img src={`assets/${environment.uVersion}/icon_vip.png`} alt="vip" />
        </>
      )}
    </div>
  );
};

const VIPGradePage = ({
  currentLevel,
  allLevelInfo,
  userVIPInfo,
  signInTotalDays,
  allLevelInfoWithBonus,
}: IVIPGradePageProps & {
  allLevelInfoWithBonus: Array<
    GetUserVIPAllInfoResponseData & {
      signInBonus: string;
      upRewardAmount: string;
      withdrawAmountLimitDayString: string;
    }
  >;
}) => {
  if (allLevelInfo.length === 0) return <div></div>;
  const vipInfoTabList: VIPInfoTabListUnitType[] = [
    {
      title: t['signInBonusTitle'](Number(signInTotalDays)),
      contentKey: 'signInBonus',
    },
    {
      title: t['upRewardAmountTitle'],
      contentKey: 'upRewardAmount',
    },
    {
      title: t['withdrawAmountLimitDayStringTitle'],
      contentKey: 'withdrawAmountLimitDayString',
    },
    {
      title: t['withdrawTimesLimitDayTitle'],
      contentKey: 'withdrawTimesLimitDay',
    },
  ];
  const { onClickToIndex } = usePageNavigate();
  const { isDesktop, isTablet, isMobile } = useBreakpoint();
  const { selectedVIP, setSelectedVIP } = useVIPGradePage(
    currentLevel,
    userVIPInfo?.data.vip_score
  );
  const { scrollWrapperRef } = useScrollSelectFixCenter(selectedVIP, false);
  return (
    <div
      style={
        isMobile
          ? {
              maxHeight: 'max-content',
              minHeight: '100%',
              background: `url(assets/${environment.uVersion}/bg_vip.png)  50%  center / cover`,
            }
          : {}
      }
    >
      <PageContainer className={cx('text-white', 'w-full')}>
        <BackNavigation
          title={'Retornar'}
          className={cx('tablet:text-lg text-base font-medium', {
            hidden: isMobile,
          })}
          onClick={() => onClickToIndex()}
        />
        <div className="flex flex-col mobile:gap-5 gap-4 tablet:mt-8 mobile:mt-6 mt-4 w-full">
          <div className="w-full h-12 overflow-hidden">
            <div
              ref={scrollWrapperRef}
              className="relative flex gap-3 h-12 overflow-x-scroll"
            >
              {allLevelInfo.map((data, index) => {
                return (
                  <button
                    key={index}
                    className={cx(
                      'bg-linear-2-main relative flex gap-[5px] flex-shrink-0',
                      'text-base mobile:w-[88px] w-[75px] h-9 rounded-lg',
                      'justify-center items-center shadow-[0px_4px_4px_#00000040] font-medium',
                      {
                        'bg-linear-2-disabled text-[var(--transparent-white-80)]':
                          index < currentLevel,
                        'border-level-button bg-linear-3-disabled before:rounded-lg before:border-0 before:border-b-[1px] font-bold shadow-[0px_4px_4px_#00000040,0px_4px_5px_#FFFFFF73_inset]':
                          index === selectedVIP,
                      }
                    )}
                    onClick={() => {
                      setSelectedVIP(index);
                    }}
                  >
                    {/* 锁 */}
                    {index > currentLevel && (
                      <img
                        className="h-1/2"
                        src={`assets/${environment.uVersion}/icon_lock.png`}
                        alt="lock"
                      />
                    )}
                    {/* 箭头 */}
                    {index === selectedVIP && (
                      <img
                        className="absolute w-5 h-[10px] bottom-[-10px] left-1/2 -translate-x-1/2"
                        src={`assets/${environment.uVersion}/icon_arrow3_down.png`}
                        alt="arrow"
                      />
                    )}
                    VIP {index}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-vip w-full flex tablet:gap-10 mobile:gap-5 rounded-lg tablet:px-10 tablet:py-5 px-5 py-5 justify-between items-center">
            <div className="flex flex-col gap-2 mobile:w-[80%] w-full">
              <div className="relative flex justify-between">
                <div
                  className="text-vip flex tablet:text-6xl tablet:leading-[78px] text-5xl leading-[62.4px] 
                  drop-shadow-[-3px_3px_8px_#00000033] font-bold items-center"
                >
                  VIP {selectedVIP}
                </div>
                <div className="mobile:hidden block ">
                  <VIPRewardIcon
                    selectedVIP={selectedVIP}
                    isShowCar={false}
                    className={
                      'tablet:w-[218px] tablet:h-[218px] mobile:w-[174px] mobile:h-[174px] w-[120px] h-[120px]'
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {/* 进度 */}
                <VIPProgress
                  title={t['totalRechargeAmount'] + ':'}
                  numerator={userVIPInfo?.data?.vip_score}
                  denominator={allLevelInfo[selectedVIP]?.rechargeAmountLimit}
                />

                <VIPProgress
                  title={t['totalBetAmount'] + ':'}
                  numerator={userVIPInfo?.data?.flow}
                  denominator={allLevelInfo[selectedVIP]?.flowLimit}
                />
              </div>
            </div>
            <div className={cx(FLEX_CENTER, 'mobile:flex hidden')}>
              <VIPRewardIcon
                selectedVIP={selectedVIP}
                isShowCar={selectedVIP >= 20}
                className={
                  'tablet:w-[218px] tablet:h-[218px] mobile:w-[174px] mobile:h-[174px] w-[120px] h-[120px]'
                }
                txt1ClassName={'mt-3 tablet:w-[70%] w-full mx-auto'}
                txt2ClassName={'mt-1'}
              />
            </div>
          </div>
          {/* vip信息 */}
          <div className="flex flex-col gap-5">
            <div className="text-linear text-2xl text-center">Privilégio</div>
            {/* 手机端奖励信息 */}
            {isMobile && selectedVIP >= 20 ? (
              <VIPRewardIcon
                selectedVIP={selectedVIP}
                isShowCar={selectedVIP >= 20}
                className="flex-col"
                infoContentClassName={'w-full'}
                txt1ClassName={
                  'text-sm text-[var(--grayscale-20)] font-medium text-center'
                }
                txt2ClassName={
                  'text-[10px] text-[var(--grayscale-20)] mt-[2px] font-normal text-center'
                }
                txtContentClassName={
                  'bg-vip-m text-[var(--grayscale-20)] w-full py-1 mt-4'
                }
              />
            ) : (
              ''
            )}
            <div className="grid mobile:grid-cols-2 grid-cols-1 mobile:gap-5 gap-3 tablet:text-lg mobile:text-base text-sm text-[var(--grayscale-80)] font-medium">
              {vipInfoTabList.map((data, index) => {
                const curVIP = selectedVIP;
                // const hidden = curVIP === 0 && ['withdrawAmountLimitDayString','withdrawTimesLimitDay'].includes(data.contentKey)
                return (
                  <div
                    key={index + '1'}
                    className="bg-linear-4-main border-popup-button flex before:border-0 before:border-b rounded-lg before:rounded-lg 
                    mobile:px-2 px-1 py-3 shadow-[0px_4px_4px_#00000040] justify-center items-center"
                  >
                    <div className="mx-0 my-auto text-center">
                      {data.title} :
                      <span className="text-deposit-amount ">
                        {curVIP >= 0
                          ? (allLevelInfoWithBonus[selectedVIP] as any)[
                              data.contentKey
                            ]
                          : index === 1
                          ? '0'
                          : 'R$ 0'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
export default VIPGradePage;
