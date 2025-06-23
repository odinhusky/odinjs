import './index.scss';

import { useEffect, useRef, useState, useMemo } from 'react';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Swiper as SwiperType } from 'swiper'; // Swiper 实例类型
import 'swiper/css';
import 'swiper/css/navigation';

import { useBreakPoint } from '@libs/commonUtils';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import LvInfo from '../LvInfo/LvInfo';
import VipTable from '../VipTable/VipTable';
import { useTranslation } from 'react-i18next';
import { BonusRecieveStatus } from '@libs/mode2/external/api/endpoint/team/PostVIPHomeEndpoint';
import useActivityPageActions, {
  VipRewardType,
} from '@mode2/action/activityPageAction/useActivityPageActions';
import { handleVipRecieveLevelRewardClick } from '@mode2/action/actionTypes';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import Icon from '@components/Icon';
import useMyVipContentBase from '@mode2/usecase/page/activityPage/useMyVipContentBase';
import isNaN from 'lodash/isNaN';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import handleGlobalClick from '@libs/mode2/action/handleGlobalClick';

const VipGroup = () => {
  useMyVipContentBase();
  const { t } = useTranslation();
  const { isMobile } = useBreakPoint();
  const { handleActivityPageClick } = useActivityPageActions();

  const swiperRef = useRef<SwiperCore | null>(null);

  const vipInfos = useMyPageStore((state) => state.vipInfos);
  const vipLevel = useUserProfileStore((state) => state.level);
  const vipProgressPercent = useMyPageStore(
    (state) => state.vipProgressPercent
  );

  const rechargeAmount = useMyPageStore((state) => state.rechargeAmount);
  const [activeIndex, setActiveIndex] = useState<number>(vipLevel);

  const maxCurLv = vipInfos.length - 1;
  const table1Data = vipInfos.map((rowData) => {
    return [
      rowData.level,
      rowData.deposit,
      rowData.monthlyCashback,
      rowData.betAmount,
      rowData.levelUpgradeBonus,
    ];
  });
  const table2Data = vipInfos.map((rowData) => {
    return [
      rowData.level,
      rowData.deposit,
      rowData.monthlyCashback,
      rowData.betAmount,
      rowData.withdrawTimes,
    ];
  });

  const tableWarningBannerBlockClass =
    'py-[8px] px-[12px]  rounded mobile:rounded-lg bgi-[var(--base-1-main)] text-sm mobile:text-base text-center bgi-text-[var(--grayscale-100)] mobile:text-center mobile:py-3 mobile:px-6 tablet:py-2 tablet:inline-block';
  const changeSlideButtonBaseClass =
    'absolute z-[10] top-1/2 transform -translate-y-1/2';
  const lockIconCLass = 'w-4 h-4 mobile:w-5 mobile:h-5';
  const roundedClass = 'rounded-md rounded-tr-[20px] rounded-bl-[20px]';

  const defaultTaskData = {
    upgradeBonusRecieveStatus: BonusRecieveStatus.LOCK,
    levelUpgradeBonus: 0,
    monthlyRewardRecieveStatus: BonusRecieveStatus.LOCK,
    monthlyCashback: 0,
    dailyWithdrawLimit: 0,
    dailyBettingRebateRate: 0,
  };

  const taskAreaData = useMemo(() => {
    const activeTaskData = vipInfos[activeIndex] || defaultTaskData;
    return [
      {
        titleKey: { i18nKey: 'activity_VIP_cards_level_upgrade_reward' },
        iconPath: 'ic_vip_level_upgrade',
        status: activeTaskData.upgradeBonusRecieveStatus,
        value: activeTaskData.levelUpgradeBonus,
        rewardType: VipRewardType.UPGRADE,
      },
      {
        titleKey: { i18nKey: 'activity_VIP_cards_monthly_reward' },
        iconPath: 'ic_vip_monthly_reward',
        status: activeTaskData.monthlyRewardRecieveStatus,
        value: activeTaskData.monthlyCashback,
        rewardType: VipRewardType.MONTHLY,
      },
      {
        titleKey: { i18nKey: 'activity_VIP_cards_bet_rebate' },
        iconPath: 'ic_vip_bet_rebate',
        status:
          activeIndex > vipLevel
            ? BonusRecieveStatus.LOCK
            : BonusRecieveStatus.ONLY_DISPLAYED,
        value: activeTaskData.dailyBettingRebateRate,
        rewardType: VipRewardType.REBATE,
      },
      {
        titleKey: { i18nKey: 'activity_VIP_daily_withdrawal_limits' },
        iconPath: 'ic_vip_daily_withdrawl',
        status:
          activeIndex > vipLevel
            ? BonusRecieveStatus.LOCK
            : BonusRecieveStatus.ONLY_DISPLAYED,
        value: activeTaskData.dailyWithdrawLimit,
        rewardType: VipRewardType.NONE,
      },
    ];
  }, [vipInfos, activeIndex]);

  const handleSlideChange = (swiper: SwiperType) => {
    // 使用 realIndex 更新状态,使用activeIndex可能會因為開啟loop而導致index不如預期
    if (!isNaN(swiper.realIndex)) {
      // NOTE 加上isNaN是mobile、tabelt切換時候會出現NaN
      setActiveIndex(swiper.realIndex);
    }
  };

  const handleSlidePrev = () => {
    handleGlobalClick({
      target: 'handleVipGroupSlidePrev',
      callback: () => {
        if (swiperRef.current) {
          swiperRef.current.slidePrev();
        }
      },
    });
  };

  const handleSlideNext = () => {
    handleGlobalClick({
      target: 'handleVipGroupSlideNext',
      callback: () => {
        if (swiperRef.current) {
          swiperRef.current.slideNext();
        }
      },
    });
  };

  useEffect(() => {
    return () => {
      swiperRef.current = null; // 组件卸载时清理引用
    };
  }, []);

  const isEnableLoopSlide = false;
  const isEnabledCenterSlide = !isMobile || (isMobile && activeIndex !== 0);

  return (
    <div className={cx('vip-group', FLEX_COL, 'gap-5', 'mt-4 mobile:mt-5')}>
      <div className="activity-page-vip-info !p-2 !mobile:p-4">
        {/* vip卡片輪播區域 */}
        <div
          className={cx(
            'vip-items',
            'h-auto',
            'flex justify-center',
            'relative',
            'tablet:px-[127px]'
          )}
        >
          <div
            className={cx(
              'items',
              'shrink-0 flex items-end',
              'relative',
              'w-full tablet:w-[898px]',
              'h-[128px] mobile:h-[160px]'
            )}
          >
            <button
              className={cx(
                changeSlideButtonBaseClass,
                'w-9 h-9 -left-[52px]',
                'hidden tablet:flex'
              )}
              onClick={handleSlidePrev}
            >
              <Icon className="w-full" name="ic_arrow_left_2" />
            </button>
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)} // 获取 Swiper 实例
              spaceBetween={0}
              slidesPerView={'auto'}
              onSlideChange={handleSlideChange}
              centeredSlides={isEnabledCenterSlide}
              loop={isEnableLoopSlide}
              initialSlide={vipLevel}
            >
              {vipInfos.map((vipInfo, index) => {
                let percent = 0;
                if (vipInfo.level < vipLevel) {
                  percent = 100;
                } else if (vipInfo.level === vipLevel + 1) {
                  percent = vipProgressPercent;
                }
                const isNextLevel = index === vipLevel + 1;

                return (
                  <SwiperSlide key={index} className="vip-card-slide">
                    <div
                      className={cx(
                        'vip-card h-[116px] mobile:h-[144px] tablet:h-[144px] flex relative items-end justify-center',
                        'rounded-tl-[4px] rounded-tr-[20px] rounded-br-[4px] rounded-bl-[20px] overflow-hidden'
                      )}
                    >
                      <img
                        className="w-full h-full"
                        src={getImgUrl(EResourceLevel.V, 'vip_bonus_m')}
                        alt={'vip' + index}
                      />
                      <img
                        className={cx(
                          index === activeIndex ? 'w-16' : 'w-16',
                          'absolute top-3 right-5'
                        )}
                        src={getImgUrl(EResourceLevel.V, `vip_level_${index}`)}
                        alt={'vip' + index}
                      />
                      <div
                        className={cx(
                          'absolute left-6 font-bold text-[var(--grayscale-100)]',
                          isNextLevel ? 'top-4' : 'top-5'
                        )}
                      >
                        {isNextLevel && (
                          <div className="text-xs -mt-1">
                            {' '}
                            {t('activity_VIP_cards_next_level_tag')}
                          </div>
                        )}
                        <div className="text-xl"> VIP {index}</div>
                      </div>

                      {index === 0 ? null : (
                        <LvInfo
                          curLv={vipInfo.level - 1}
                          maxLv={maxCurLv}
                          percent={percent}
                          deposit={vipInfos[index]?.deposit}
                          rechargeAmount={rechargeAmount}
                          hiddenProcess={!isNextLevel}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <button
              className={cx(
                changeSlideButtonBaseClass,
                'w-9 h-9 -right-[52px]',
                'hidden tablet:flex'
              )}
              onClick={handleSlideNext}
            >
              <Icon className="w-full" name="ic_arrow_right_2" />
            </button>
          </div>
        </div>

        {/* 任務獎勵區域 */}
        <div className="px-0 desktop:px-[104px]">
          <div
            className={cx(
              'grid grid-cols-2 mobile:grid-cols-4',
              'gap-3 mobile:gap-4'
            )}
          >
            {taskAreaData.map((task, index) => {
              return (
                <div
                  key={renderI18N(task.titleKey, t)}
                  className={cx(
                    'p-2',
                    'tablet:py-6',
                    'flex flex-col justify-center gap-1',
                    'bgi-border-[var(--linear-2)]',
                    'mobile:justify-start',
                    'tablet:justify-center',
                    roundedClass,
                    {
                      'shadow-[0_0_4px_0_rgba(255,255,255,0.6),_0_0_8px_0_rgba(255,255,255,0.4)]':
                        task.status === BonusRecieveStatus.UNRECIEVED,
                    }
                  )}
                  style={{
                    backgroundImage: `url(${getImgUrl(
                      EResourceLevel.V,
                      'vip_card_lock'
                    )})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <div
                    className={cx('absolute top-0 left-0', roundedClass, {
                      'w-full h-full backdrop-brightness-[0.6]':
                        task.status === BonusRecieveStatus.LOCK,
                    })}
                  />

                  <div
                    className={cx(
                      'item-infos',
                      'flex items-center mobile:flex-col mobile:text-center tablet:flex-row tablet:text-left'
                    )}
                  >
                    <div
                      className={cx(
                        FLEX_CENTER,
                        'shrink-0',
                        'bgi-[var(--transparent-gray-30)]',
                        'rounded-[100px]',
                        'p-1 box-border',
                        'w-7 h-7 mr-1',
                        'tablet:w-11 tablet:h-11'
                      )}
                    >
                      <Icon
                        className={cx('w-full', {
                          'opacity-70': task.status === BonusRecieveStatus.LOCK,
                        })}
                        name={task.iconPath}
                      />
                    </div>
                    <div
                      className={cx(
                        'flex flex-col gap-1 text-xs tablet:text-sm font-medium  bgi-text-[var(--grayscale-100)]',
                        {
                          'bgi-txt-[var(--transparent-gray-30)]':
                            task.status === BonusRecieveStatus.LOCK,
                        }
                      )}
                    >
                      <div
                        className={cx(
                          'text-left mobile:text-center tablet:text-left'
                        )}
                      >
                        {renderI18N(task.titleKey, t)}
                      </div>
                      <div>
                        {task.rewardType === VipRewardType.REBATE
                          ? `${task.value}%`
                          : formatMoney({ value: task.value })}
                      </div>
                    </div>
                  </div>
                  {[0, 1].includes(index) && activeIndex !== 0 ? (
                    <button
                      className={cx(
                        'rounded-full w-full py-1',
                        'flex justify-center items-center',
                        'tablet:absolute tablet:right-3 tablet:bottom-3 tablet:w-[82px] h-7',
                        'z-10',
                        {
                          'bgi-[var(--base-1-main)]':
                            task.status === BonusRecieveStatus.UNRECIEVED,
                          'bgi-[var(--transparent-gray-30)]':
                            task.status === BonusRecieveStatus.LOCK,
                          'bgi-[var(--grayscale-25)]':
                            task.status === BonusRecieveStatus.RECIEVED,
                        }
                      )}
                      disabled={task.status !== BonusRecieveStatus.UNRECIEVED}
                      onClick={() =>
                        handleActivityPageClick({
                          actionName: handleVipRecieveLevelRewardClick,
                          payload: {
                            type: task.rewardType,
                          },
                        })
                      }
                    >
                      <div
                        className={cx(
                          'text-sm font-medium flex justify-center items-center',
                          {
                            'bgi-text-[var(--grayscale-100)]':
                              task.status === BonusRecieveStatus.UNRECIEVED,
                            'bgi-text-[var(--transparent-white-30)]':
                              task.status === BonusRecieveStatus.LOCK,
                            '':
                              task.status === BonusRecieveStatus.ONLY_DISPLAYED,
                          }
                        )}
                      >
                        {task.status === BonusRecieveStatus.LOCK ? (
                          <Icon className={cx(lockIconCLass)} name="ic_lock" />
                        ) : (
                          <div
                            className={cx(
                              'text-xs mobile:text-sm font-medium',
                              {
                                'bgi-text-[var(--transparent-white-20)]':
                                  task.status === BonusRecieveStatus.RECIEVED,
                              }
                            )}
                          >
                            {renderI18N(
                              {
                                i18nKey: 'earn_money_ranking_list_btn_receive',
                              },
                              t
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table 1 */}
      <div className="activity-page-vip-info !p-2 !mobile:p-4">
        <div style={{ textAlign: 'center' }}>
          <div className={tableWarningBannerBlockClass}>
            {t('activity_VIP_monthly_cumulative_deposit_and_vip_levels')}
          </div>
        </div>
        <VipTable
          theadTitles={[
            t('activity_VIP_table_header_vip_level'),
            `${t('wallet_nav_deposit')}(${t('common_currency')})`,
            `${t('activity_VIP_table_header_monthly_bonus')}(${t(
              'common_currency'
            )})`,
            `${t(
              'earn_money_statistics_bonus_info_table_header_bet_amount'
            )}(${t('common_currency')})`,
            `${t('activity_VIP_table_header_leveler_upgrade_bonus')}(${t(
              'common_currency'
            )})`,
          ]}
          datas={table1Data}
          styles={[
            {},
            {
              background: 'var(--base-4-main)',
              WebkitTextFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
            },
            {},
            {},
            {},
          ]}
        />
        <div className="text-sm mobile:text-base text-center">
          {t('activity_VIP_cash_bonus_note')}
        </div>
      </div>

      {/* Table 2 */}
      <div className="activity-page-vip-info !p-2 !mobile:p-4">
        <div style={{ textAlign: 'center' }}>
          <div className={tableWarningBannerBlockClass}>
            {t('activity_VIP_free_daily_withdrawals')}
          </div>
        </div>
        <VipTable
          theadTitles={[
            t('activity_VIP_table_header_vip_level'),
            `${t('wallet_nav_deposit')}(${t('common_currency')})`,
            `${t('activity_VIP_table_header_monthly_bonus')}(${t(
              'common_currency'
            )})`,
            `${t(
              'earn_money_statistics_bonus_info_table_header_bet_amount'
            )}(${t('common_currency')})`,
            t('activity_VIP_table_header_free_daily_withdrawals'),
          ]}
          clearFormatMoneyIndex={4}
          datas={table2Data}
          styles={[
            {},
            {
              background: 'var(--base-4-main)',
              WebkitTextFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
            },
            {},
            {},
            {},
          ]}
        />
        <div className="text-base bgi-text-[var(--state-warn-main)] text-center">
          {t('activity_VIP_note_content')}
        </div>
      </div>
    </div>
  );
};
export default VipGroup;
