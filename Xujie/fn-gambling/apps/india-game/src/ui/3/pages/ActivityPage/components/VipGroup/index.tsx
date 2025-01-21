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
import { handleVipRecieveLevelRewardClick } from '@libs/mode2/action/activityPageAction/actionType';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import Icon from '@libs/mode2/components/Icon';
import useMyVipContentBase from '@mode2/usecase/page/activityPage/useMyVipContentBase';

const VipGroup = () => {
  useMyVipContentBase();
  const { t } = useTranslation();
  const { isMobile } = useBreakPoint();
  const { handleActivityPageClick } = useActivityPageActions();

  const swiperRef = useRef<SwiperCore | null>(null);

  const vipInfos = useMyPageStore((state) => state.vipInfos);
  const vipLevel = useMyPageStore((state) => state.vipLevel);
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
  const lockIconCLass = 'w-4 h-4 mobile:w-5 mobile:h-5 tablet:w-6 tablet:h-6';

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
    setActiveIndex(swiper.realIndex);
  };

  const handleSlidePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleSlideNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  useEffect(() => {
    return () => {
      swiperRef.current = null; // 组件卸载时清理引用
    };
  }, []);

  const isEnableLoopSlide = !isMobile;
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
                    <div className="vip-card  h-[116px] mobile:h-[144px] tablet:h-[144px] flex relative items-end justify-center">
                      <img
                        className="w-full h-full"
                        src={getImgUrl(EResourceLevel.V, 'bg_vip')}
                        alt={'vip' + index}
                      />
                      <img
                        className={cx(
                          index === activeIndex ? 'w-28' : 'w-24',
                          'absolute top-3 right-5'
                        )}
                        src={getImgUrl(EResourceLevel.V, `vip_level_${index}`)}
                        alt={'vip' + index}
                      />
                      <div
                        className={cx(
                          'absolute left-6  font-bold text-[var(--grayscale-100)]',
                          isNextLevel ? 'top-4' : 'top-7'
                        )}
                      >
                        {isNextLevel && (
                          <div className="text-xs -mt-1">
                            {' '}
                            {t('activity_VIP_cards_next_level_tag')}
                          </div>
                        )}
                        <div className="text-2xl"> VIP {index}</div>
                      </div>

                      <LvInfo
                        curLv={vipInfo.level - 1}
                        maxLv={maxCurLv}
                        percent={percent}
                        deposit={vipInfos[index]?.deposit}
                        rechargeAmount={rechargeAmount}
                        hiddenProcess={!isNextLevel}
                      />
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

        <hr style={{ borderColor: 'var(--grayscale-50)' }} />

        {/* 任務獎勵區域 */}
        <div className="px-0 desktop:px-[104px]">
          <div
            className={cx(
              'grid grid-cols-2 mobile:grid-cols-4',
              'gap-3 mobile:gap-4'
            )}
          >
            {taskAreaData.map((task) => {
              return (
                <div
                  key={renderI18N(task.titleKey, t)}
                  className={cx(
                    'relative',
                    'px-3 py-4 flex flex-col gap-2 relative rounded-md rounded-tr-3xl rounded-bl-3xl  mobile:rounded-tr-[2.5rem] mobile:rounded-bl-[2.5rem] overflow-hidden'
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
                    className={cx('absolute top-0 left-0 ', {
                      'w-full h-full backdrop-brightness-[0.6]':
                        task.status === BonusRecieveStatus.LOCK,
                      'w-full h-full bgi-[var(--transparent-gray-30)]':
                        task.status === BonusRecieveStatus.RECIEVED,
                    })}
                  />

                  <div
                    className={cx(
                      'item-infos',
                      'flex max-mobile:flex-col max-mobile:items-center grow gap-3'
                    )}
                  >
                    <div
                      className={cx(
                        FLEX_CENTER,
                        'shrink-0',
                        'bgi-[var(--transparent-gray-30)]',
                        'rounded-[100px]',
                        'p-[2%]',
                        'w-14 h-14'
                      )}
                    >
                      <Icon
                        className={cx('w-full', {
                          'opacity-70': task.status === BonusRecieveStatus.LOCK,
                        })}
                        name={task.iconPath}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div
                        className={cx(
                          'text-sm font-medium max-mobile:text-center',
                          {
                            'bgi-txt-[var(--transparent-gray-30)]':
                              task.status === BonusRecieveStatus.LOCK,
                          }
                        )}
                      >
                        {renderI18N(task.titleKey, t)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={cx({
                      'rounded bgi-[var(--transparent-gray-30)] w-full text-center':
                        task.status === BonusRecieveStatus.RECIEVED ||
                        task.status === BonusRecieveStatus.LOCK,
                    })}
                  >
                    <button
                      className={cx(
                        'rounded w-full py-1',
                        task.status === BonusRecieveStatus.UNRECIEVED
                          ? 'bgi-[var(--base-1-main)] rounded-full '
                          : 'bgi-[var(--transparent-gray-40)] disabled:bgi-[var(--transparent-gray-40)]'
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
                        className={cx('text-sm font-medium', {
                          'bgi-text-[white]':
                            task.status === BonusRecieveStatus.UNRECIEVED,
                          'bgi-text-[var(--transparent-white-30)]':
                            task.status === BonusRecieveStatus.LOCK,
                          '': task.status === BonusRecieveStatus.ONLY_DISPLAYED,
                        })}
                      >
                        {task.rewardType === VipRewardType.REBATE
                          ? `${task.value}%`
                          : formatMoney(task.value)}
                      </div>
                    </button>
                  </div>
                  <div className="absolute right-2.5 top-2.5 flex justify-center items-center shrink-0 min-h-5 mobile:min-h-7 my-0.5 mobile:my-1 tablet:mx-1">
                    {task.status === BonusRecieveStatus.LOCK && (
                      <Icon className={lockIconCLass} name="ic_lock" />
                    )}
                    {task.status === BonusRecieveStatus.UNRECIEVED && (
                      <Icon className={lockIconCLass} name="ic_unlock" />
                    )}
                    {task.status === BonusRecieveStatus.RECIEVED && (
                      <Icon
                        className={lockIconCLass}
                        name="ic_check"
                        color="var(--grayscale-100)"
                      />
                    )}
                  </div>
                </div>
              );
            })}
            {/*<div*/}
            {/*  className={cx(*/}
            {/*    'relative',*/}
            {/*    'px-3 py-4 flex flex-col gap-2 relative rounded-md rounded-tr-3xl rounded-bl-3xl   overflow-hidden'*/}
            {/*  )}*/}
            {/*  style={{*/}
            {/*    backgroundImage: `url(${getImgUrl(*/}
            {/*      EResourceLevel.V,*/}
            {/*      'vip_card_lock'*/}
            {/*    )})`,*/}
            {/*    backgroundSize: 'cover',*/}
            {/*    backgroundRepeat: 'no-repeat',*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <div*/}
            {/*    className={cx(*/}
            {/*      'item-infos',*/}
            {/*      'flex max-mobile:flex-col max-mobile:items-center grow gap-3'*/}
            {/*    )}*/}
            {/*  >*/}
            {/*    <div*/}
            {/*      className={cx(*/}
            {/*        FLEX_CENTER,*/}
            {/*        'shrink-0',*/}
            {/*        'bgi-[var(--transparent-gray-30)]',*/}
            {/*        'rounded-[100px]',*/}
            {/*        'p-[2%]',*/}
            {/*        'w-14 h-14'*/}
            {/*      )}*/}
            {/*    >*/}
            {/*      <Icon className={cx('w-full')} name="ic_vip_bet_rebate" />*/}
            {/*    </div>*/}

            {/*    <div className="flex flex-col gap-2">*/}
            {/*      <div*/}
            {/*        className={cx(*/}
            {/*          'text-sm font-medium max-mobile:text-center bgi-txt-[var(--transparent-gray-30)]'*/}
            {/*        )}*/}
            {/*      >*/}
            {/*        {t('activity_VIP_cards_bet_rebate')}*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div*/}
            {/*    className={cx(*/}
            {/*      'rounded bgi-[var(--transparent-gray-30)] w-full text-center'*/}
            {/*    )}*/}
            {/*  >*/}
            {/*    <button*/}
            {/*      className={cx(*/}
            {/*        'rounded w-full py-1',*/}
            {/*        'bgi-[var(--transparent-gray-40)] rounded-full '*/}
            {/*      )}*/}
            {/*      onClick={() => {}}*/}
            {/*    >*/}
            {/*      {vipInfos[activeIndex]?.dailyBettingRebateRate}%*/}
            {/*    </button>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        </div>
        {/*<div className="text-xs font-medium text-left mobile:text-sm mobile:text-center">*/}
        {/*  {t('activity_VIP_monthly_rewards_depend')}*/}
        {/*</div>*/}
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
            t('wallet_nav_deposit'),
            t('activity_VIP_table_header_monthly_bonus'),
            t('earn_money_statistics_bonus_info_table_header_bet_amount'),
            t('activity_VIP_cards_level_upgrade_reward'),
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
            t('wallet_nav_deposit'),
            t('activity_VIP_table_header_monthly_bonus'),
            t('earn_money_statistics_bonus_info_table_header_bet_amount'),
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
