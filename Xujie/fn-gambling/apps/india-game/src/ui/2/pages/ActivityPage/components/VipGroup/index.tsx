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
  const { isMobile, isTablet, isDesktop } = useBreakPoint();
  const { handleActivityPageClick } = useActivityPageActions();

  const swiperRef = useRef<SwiperCore | null>(null);

  const vipInfos = useMyPageStore((state) => state.vipInfos);
  const vipLevel = useMyPageStore((state) => state.vipLevel);
  const vipProgressPercent = useMyPageStore(
    (state) => state.vipProgressPercent
  );

  const [activeIndex, setActiveIndex] = useState<number>(vipLevel);

  const maxCurLv = vipInfos.length - 1;
  const table1Data = vipInfos.map((rowData) => {
    return [
      rowData.level,
      rowData.deposit,
      rowData.betAmount,
      rowData.levelUpgradeBonus,
    ];
  });
  const table2Data = vipInfos.map((rowData) => {
    return [
      rowData.level,
      rowData.deposit,
      rowData.betAmount,
      rowData.monthlyCashback,
    ];
  });
  const table3Data = vipInfos.map((rowData) => {
    return [
      rowData.level,
      rowData.deposit,
      rowData.betAmount,
      rowData.dailyWithdrawLimit,
    ];
  });

  const table4Data = vipInfos.map((rowData) => {
    return [rowData.level, rowData.level];
  });

  const tableWarningBannerBlockClass =
    'py-[8px] px-[12px]  rounded mobile:rounded-lg bgi-[var(--base-1-main)] text-sm mobile:text-base font-medium text-left bgi-text-[var(--grayscale-100)] mobile:text-center mobile:py-3 mobile:px-6 tablet:py-2';
  const changeSlideButtonBaseClass =
    'absolute z-[10] top-1/2 transform -translate-y-1/2';
  const lockIconCLass = 'w-4 h-4 mobile:w-5 mobile:h-5 tablet:w-6 tablet:h-6';

  const defaultTaskData = {
    upgradeBonusRecieveStatus: BonusRecieveStatus.LOCK,
    levelUpgradeBonus: 0,
    monthlyRewardRecieveStatus: BonusRecieveStatus.LOCK,
    monthlyCashback: 0,
    dailyWithdrawLimit: 0,
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

  const getVipTaskCardImgSrc = () => {
    if (isMobile) return 'vip_card_lock_m';
    if (isTablet) return 'vip_card_lock_t';
    if (isDesktop) return 'vip_card_lock';
    return '';
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
      <div className="activity-page-vip-info">
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
                } else if (vipInfo.level === vipLevel) {
                  percent = vipProgressPercent;
                }
                return (
                  <SwiperSlide key={index} className="vip-card-slide">
                    <div className="vip-card h-[116px] mobile:h-[144px] tablet:h-[144px] flex relative items-end justify-center">
                      <img
                        className="w-full h-full"
                        src={getImgUrl(EResourceLevel.V, 'bg_vip_' + index)}
                        alt={'vip' + index}
                      />
                      {index === activeIndex && (
                        <LvInfo
                          curLv={vipInfo.level}
                          maxLv={maxCurLv}
                          percent={percent}
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

        <hr style={{ borderColor: 'var(--grayscale-50)' }} />

        {/* 任務獎勵區域 */}
        <div className="px-0 desktop:px-[104px]">
          <div className={cx('grid grid-cols-3', 'gap-6 mobile:gap-4')}>
            {taskAreaData.map((task) => {
              return (
                <div
                  key={renderI18N(task.titleKey, t)}
                  className={cx(
                    'vip-task-item',
                    'bg-center bg-no-repeat bg-size-100',
                    'relative',
                    FLEX_COL,
                    'gap-[6px] justify-between',
                    'mobile:gap-[15px]',
                    'tablet:flex-row tablet:gap-0',
                    {
                      'opacity-70': task.status === BonusRecieveStatus.LOCK,
                    }
                  )}
                  style={{
                    backgroundImage: `url(${getImgUrl(
                      EResourceLevel.V,
                      getVipTaskCardImgSrc()
                    )})`,
                  }}
                >
                  <div
                    className={cx(
                      'item-infos',
                      FLEX_CENTER,
                      'flex-col grow gap-3',
                      'pt-2',
                      'mobile:gap-[14px]',
                      'tablet:flex-row tablet:gap-4 tablet:py-[30px] tablet:pl-[16px]'
                    )}
                  >
                    <div
                      className={cx(
                        FLEX_CENTER,
                        'shrink-0',
                        'bgi-[var(--transparent-gray-30)]',
                        'rounded-[100px]',
                        'p-[2%]',
                        'w-9 h-9 tablet:h-[48px] tablet:w-[48px]'
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
                        FLEX_COL,
                        'grow',
                        'items-center tablet:items-start',
                        'justify-between',
                        'mobile:gap-1',
                        'tablet:text-left'
                      )}
                    >
                      <div
                        className={cx(
                          'text-xs mobile:text-sm tablet:text-base text-center px-[8px] tablet:px-0 tablet:text-left',
                          {
                            'bgi-txt-[var(--transparent-gray-30)]':
                              task.status === BonusRecieveStatus.LOCK,
                          }
                        )}
                      >
                        {renderI18N(task.titleKey, t)}
                      </div>
                      <div
                        className={cx({
                          'rounded bgi-[var(--transparent-gray-30)]':
                            task.status === BonusRecieveStatus.RECIEVED ||
                            task.status === BonusRecieveStatus.LOCK,
                        })}
                      >
                        <button
                          className={cx('rounded p-1 mobile:px-[12px]', {
                            'bgi-[var(--state-warn-main)]':
                              task.status === BonusRecieveStatus.UNRECIEVED,
                            'border-[none] bgi-[var(--transparent-gray-30)]]':
                              task.status === BonusRecieveStatus.LOCK,
                            '': task.status === BonusRecieveStatus.RECIEVED,
                            'border border-solid border-[var(--grayscale-100)]':
                              task.status === BonusRecieveStatus.ONLY_DISPLAYED,
                          })}
                          disabled={
                            task.status !== BonusRecieveStatus.UNRECIEVED
                          }
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
                              'text-xs mobile:text-sm tablet:text-base font-medium',
                              {
                                'bgi-text-[white]':
                                  task.status === BonusRecieveStatus.UNRECIEVED,
                                'bgi-text-[var(--transparent-white-30)]':
                                  task.status === BonusRecieveStatus.LOCK,
                                'bgi-text-[var(--state-warn-main)]':
                                  task.status === BonusRecieveStatus.RECIEVED,
                                '':
                                  task.status ===
                                  BonusRecieveStatus.ONLY_DISPLAYED,
                              }
                            )}
                          >
                            {formatMoney(task.value)}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center shrink-0 min-h-5 mobile:min-h-7 my-0.5 mobile:my-1 tablet:mx-1">
                    {task.status === BonusRecieveStatus.LOCK && (
                      <Icon className={lockIconCLass} name="ic_lock" />
                    )}
                    {task.status === BonusRecieveStatus.UNRECIEVED && (
                      <Icon className={lockIconCLass} name="ic_unlock" />
                    )}
                    {task.status === BonusRecieveStatus.RECIEVED && (
                      <div
                        className={cx(
                          'bgi-[var(--transparent-gray-30)] rounded-full',
                          lockIconCLass
                        )}
                      >
                        <Icon
                          className={lockIconCLass}
                          name="ic_check"
                          color="var(--state-warn-main)"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-xs font-medium text-left mobile:text-sm mobile:text-center">
          {t('activity_VIP_monthly_rewards_depend')}
        </div>
      </div>

      {/* Table 1 */}
      <div className="activity-page-vip-info">
        <div className="text-base mobile:text-lg font-medium text-left bgi-text-[var(--base-4-main)] mobile:text-center">
          {t('activity_VIP_vip_status_can_be_upgraded')}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className={tableWarningBannerBlockClass}>
            {t('activity_VIP_upgrade_reward')}
          </div>
        </div>
        <VipTable
          theadTitles={[
            t('activity_VIP_table_header_vip_level'),
            t('wallet_nav_deposit'),
            t('earn_money_statistics_bonus_info_table_header_bet_amount'),
            t('activity_VIP_table_header_leveler_upgrade_bonus'),
          ]}
          datas={table1Data}
          styles={[
            {},
            {},
            {},
            {
              background: 'var(--base-4-main)',
              WebkitTextFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
            },
          ]}
        />
      </div>

      {/* Table 2 */}
      <div className="activity-page-vip-info">
        <div style={{ textAlign: 'center' }}>
          <div className={tableWarningBannerBlockClass}>
            {t('activity_VIP_vip_rewards_are_only_valid')}
          </div>
        </div>
        <VipTable
          theadTitles={[
            t('activity_VIP_table_header_vip_level'),
            t('wallet_nav_deposit'),
            t('earn_money_statistics_bonus_info_table_header_bet_amount'),
            t('activity_VIP_table_header_monthly_cashback'),
          ]}
          datas={table2Data}
          styles={[
            {},
            {},
            {},
            {
              background: 'var(--base-4-main)',
              WebkitTextFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
            },
          ]}
        />
      </div>

      {/* Table 3 */}
      <div className="activity-page-vip-info">
        <div style={{ textAlign: 'center' }}>
          <div className={tableWarningBannerBlockClass}>
            <div className="text-base mobile:text-lg">
              {t('activity_VIP_daily_withdrawal_limits')}
            </div>
            <div className="mt-[4px] mobile:mt-[12px]">
              {t('activity_VIP_the_withdrawal_limits')}
            </div>
          </div>
        </div>
        <VipTable
          theadTitles={[
            t('activity_VIP_table_header_vip_level'),
            t('wallet_nav_deposit'),
            t('earn_money_statistics_bonus_info_table_header_bet_amount'),
            t('activity_VIP_table_header_daily_withdrawal_limit'),
          ]}
          datas={table3Data}
          styles={[
            {},
            {},
            {},
            {
              background: 'var(--base-4-main)',
              WebkitTextFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
            },
          ]}
        />
        <div className="flex flex-col text-sm mobile:text-base text-left bgi-text-[var(--base-4-main)] mt-[8px] mobile:mt-[12px] tablet:mt-[16px]">
          <div className="flex font-semibold justify-start mobile:justify-center items-center">
            <Icon
              className="w-6 h-6 mr-[4px]"
              name="ic_notice"
              color="var(--state-warn-main)"
            />
            {t('wallet_withdraw_note_title')}
          </div>
          <div className="text-left font-medium mobile:text-center">
            {t('activity_VIP_note_content', {
              ratio: '3',
              fee: '6',
            })}
          </div>
        </div>
      </div>

      {/* Table 4 */}
      <div className="activity-page-vip-info">
        <div className="text-base mobile:text-lg font-medium text-[left] mobile:text-center bgi-text-[var(--grayscale-100)]">
          {t('activity_VIP_upgrade_to_vip')}
        </div>
        {isDesktop ? (
          <div>
            <VipTable
              theadTitles={[
                t('activity_VIP_table_header_vip_level'),
                t('activity_VIP_table_header_dress_up'),
              ]}
              datas={table4Data.slice(0, 7)}
              styles={[]}
              isVipIcon={true}
              style={{ width: '49%' }}
            />
            <VipTable
              theadTitles={[
                t('activity_VIP_table_header_vip_level'),
                t('activity_VIP_table_header_dress_up'),
              ]}
              datas={table4Data.slice(7)}
              styles={[]}
              isVipIcon={true}
              style={{ width: '49%', marginLeft: '2%' }}
            />
          </div>
        ) : (
          <VipTable
            theadTitles={[
              t('activity_VIP_table_header_vip_level'),
              t('activity_VIP_table_header_dress_up'),
            ]}
            datas={table4Data}
            styles={[]}
            isVipIcon={true}
          />
        )}
      </div>
    </div>
  );
};
export default VipGroup;
