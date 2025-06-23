import './index.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Swiper as SwiperType } from 'swiper'; // Swiper 实例类型
import 'swiper/css';
import 'swiper/css/navigation';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import { useTranslation } from 'react-i18next';
import { BonusRecieveStatus } from '@libs/mode2/external/api/endpoint/team/PostVIPHomeEndpoint';
import useActivityPageActions, {
  VipRewardType,
} from '@mode2/action/activityPageAction/useActivityPageActions';
import { handleVipRecieveLevelRewardClick } from '@mode2/action/actionTypes';
import renderI18N from '@libs/commonUtils/renderI18N';
import {
  FLEX_CENTER,
  FLEX_COL,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import Icon from '@components/Icon';
import useMode2VipPageBase from '@mode2/usecase/page/vipPage/useMode2VipPageBase';
import isNaN from 'lodash/isNaN';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import LvInfo from './components/LvInfo/LvInfo';
import UserInfo from './components/UserInfo';
import VipTable from './components/VipTable/VipTable';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';

export const VipPage = () => {
  useMode2VipPageBase();

  const { t } = useTranslation();
  const { handleActivityPageClick } = useActivityPageActions();

  const swiperRef = useRef<SwiperCore | null>(null);

  const vipInfos = useMyPageStore((state) => state.vipInfos);
  const vipLevel = useUserProfileStore((state) => state.level);
  const vipProgressPercent = useMyPageStore(
    (state) => state.vipProgressPercent
  );

  const vipRewardDama = useMyPageStore((state) => state.vipRewardDama);
  const rechargeAmount = useMyPageStore((state) => state.rechargeAmount);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const maxCurLv = vipInfos.length - 1;
  const table1Data = vipInfos.map((rowData) => {
    return [
      rowData.level,
      rowData.deposit,
      rowData.monthlyCashback,
      rowData.levelUpgradeBonus,
      rowData.freeDailyWithdrawals,
    ];
  });

  const lockIconCLass = 'w-4 h-4 ';

  const defaultTaskData = {
    upgradeBonusRecieveStatus: BonusRecieveStatus.LOCK,
    levelUpgradeBonus: 0,
    monthlyRewardRecieveStatus: BonusRecieveStatus.LOCK,
    monthlyCashback: 0,
    dailyWithdrawLimit: 0,
    dailyBettingRebateRate: 0,
  };

  const taskAreaData = useMemo(() => {
    const activeTaskData = vipInfos[activeIndex + 1] || defaultTaskData;
    return [
      {
        titleKey: { i18nKey: 'activity_VIP_cards_level_upgrade_reward' },
        iconPath: 'ic_upgrade_bonus',
        status: activeTaskData.upgradeBonusRecieveStatus,
        value: activeTaskData.levelUpgradeBonus,
        rewardType: VipRewardType.UPGRADE,
      },
      {
        titleKey: { i18nKey: 'activity_VIP_cards_monthly_reward' },
        iconPath: 'ic_monthly_bonus',
        status: activeTaskData.monthlyRewardRecieveStatus,
        value: activeTaskData.monthlyCashback,
        rewardType: VipRewardType.MONTHLY,
      },
      {
        titleKey: { i18nKey: 'activity_VIP_cards_bet_rebate' },
        iconPath: 'ic_bet_rebate',
        status:
          activeIndex > vipLevel
            ? BonusRecieveStatus.LOCK
            : BonusRecieveStatus.ONLY_DISPLAYED,
        value: activeTaskData.dailyBettingRebateRate,
        rewardType: VipRewardType.REBATE,
      },
      {
        titleKey: { i18nKey: 'activity_VIP_daily_withdrawal_limits' },
        iconPath: 'ic_daily_wirhdraw_limit',
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

  const imageMappings = [
    { range: [0, 3], img: 'vip_cards_1' },
    { range: [4, 7], img: 'vip_cards_2' },
    { range: [8, 9], img: 'vip_cards_3' },
    { range: [10, 12], img: 'vip_cards_4' },
  ];

  const getImageForIndex = (index: number) => {
    const match = imageMappings.find(
      ({ range }) => index >= range[0] && index <= range[1]
    );
    return match;
  };

  const getVipCardImageUrl = (
    match:
      | {
          range: number[];
          img: string;
        }
      | undefined
  ) => {
    return match ? getImgUrl(EResourceLevel.ICONS, match.img) : ''; // 默认图片或空字符串
  };

  /**
   * 只有登錄用戶VIP等級==當前等級時才顯示進度條 或者 用戶等級等於0時顯示
   * @param level 1 - 12
   */
  const setShowProcess = (level: number) => {
    if (vipLevel === level) return true;

    if (vipLevel === 0 && vipLevel === level - 1) return true;
    return false;
  };

  useEffect(() => {
    return () => {
      swiperRef.current = null; // 组件卸载时清理引用
    };
  }, []);

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'w-screen -ml-4',
        'vip-group bgi-text-[var(--grayscale-100)]'
      )}
      style={{
        backgroundImage: `url(${getImgUrl(
          EResourceLevel.V,
          'casino_background'
        )})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={cx('vip-group px-4 box-border', FLEX_COL)}>
        {/* 個人信息區域 */}
        <UserInfo />

        {/* vip卡片輪播區域 */}
        <div className="">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)} // 获取 Swiper 实例
            spaceBetween={30}
            slidesPerView={'auto'}
            onSlideChange={handleSlideChange}
            centeredSlides={true}
            loop={false}
            initialSlide={vipLevel - 1}
            className={cx('h-[184px]')}
          >
            {vipInfos.map((vipInfo) => {
              let percent = 0;
              if (vipInfo.level < vipLevel) {
                percent = 100;
              } else if (vipInfo.level === vipLevel) {
                percent = vipProgressPercent;
              }
              const isNextLevel = vipInfo.level === vipLevel + 1;
              if (isNextLevel) {
                percent = vipProgressPercent;
              }

              return vipInfo.level !== 0 ? (
                <SwiperSlide key={vipInfo.level}>
                  <div
                    className={cx(
                      'w-full h-[168px] mt-4 relative flex items-end'
                    )}
                  >
                    <BaseCacheImg
                      className="w-full h-full"
                      src={getVipCardImageUrl(getImageForIndex(vipInfo.level))}
                      imgName={getImageForIndex(vipInfo.level)?.img || ''}
                      alt={'vip' + vipInfo.level}
                    />
                    <div
                      className={cx(
                        'flex items-center',
                        'absolute top-0 left-4'
                      )}
                    >
                      <div
                        className={cx(
                          'w-[98px] h-[100px]',
                          'absolute -top-4 left-0'
                        )}
                      >
                        <img
                          className={cx('w-full h-full')}
                          src={getImgUrl(
                            EResourceLevel.ICONS,
                            `vip_rank_${vipInfo.level}`
                          )}
                          alt={'vip' + vipInfo.level}
                        />
                      </div>
                      {/* top-[32] | top-[44px]  - 16*/}
                      <div
                        className={cx(
                          'absolute left-[116px]',
                          'w-36',
                          vipLevel === vipInfo.level ? 'top-4' : 'top-7'
                        )}
                      >
                        {vipLevel === 0 && isNextLevel ? (
                          <div className="text-xl font-medium bgi-text-[var(--grayscale-60)]">
                            {t('activity_VIP_cards_next_level_tag')}
                          </div>
                        ) : null}
                        {vipLevel === vipInfo.level ? (
                          <div className="text-xl font-medium bgi-text-[var(--grayscale-60)]">
                            {t('activity_VIP_cards_my_level_tag')}
                          </div>
                        ) : null}
                        <img
                          className={cx('h-9')}
                          src={getImgUrl(
                            EResourceLevel.ICONS,
                            `vip_card_level_${vipInfo.level}`
                          )}
                          alt={'vip' + vipInfo.level}
                        />
                      </div>
                    </div>

                    <LvInfo
                      curLv={vipInfo.level}
                      userVipLevel={vipLevel}
                      maxLv={maxCurLv}
                      percent={percent}
                      deposit={
                        vipInfos[
                          vipLevel === vipInfo.level
                            ? vipInfo.level + 1
                            : vipInfo.level
                        ]?.deposit
                      }
                      rechargeAmount={rechargeAmount}
                      showProcess={setShowProcess(vipInfo.level)}
                    />
                  </div>
                </SwiperSlide>
              ) : null;
            })}
          </Swiper>
        </div>

        {/* 任務獎勵區域 */}
        <div className="px-0 mt-11">
          <div className={cx('grid grid-cols-2', 'gap-3')}>
            {taskAreaData.map((task, index) => {
              return (
                <div
                  key={renderI18N(task.titleKey, t)}
                  className={cx(
                    'min-h-24',
                    'relative rounded-md border border-[var(--base-1-main)] bgi-[var(--base-2-variant14)] overflow-hidden'
                  )}
                >
                  <div
                    key={renderI18N(task.titleKey, t)}
                    className={cx(
                      'px-3 h-full relative',
                      'flex flex-col justify-center ',
                      ' ',
                      {
                        'shadow-[0_0_4px_0_rgba(255,255,255,0.6),_0_0_8px_0_rgba(255,255,255,0.4)]':
                          task.status === BonusRecieveStatus.UNRECIEVED,
                      }
                    )}
                    style={{
                      backgroundImage: `url(${getImgUrl(
                        EResourceLevel.V,
                        'pattern'
                      )})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* <div
                className={cx('absolute top-0 left-0', {
                  'w-full h-full backdrop-brightness-[0.6]':
                    task.status === BonusRecieveStatus.LOCK,
                })}
              /> */}

                    <div className={cx('item-infos', 'flex items-center')}>
                      <div
                        className={cx(
                          FLEX_CENTER,
                          'shrink-0',
                          'rounded-full',
                          'p-1 box-border',
                          'w-10 h-10 mr-1.5'
                        )}
                      >
                        <Icon
                          className={cx(
                            'w-full'
                            //   {
                            //   'opacity-70':
                            //     task.status === BonusRecieveStatus.LOCK,
                            // }
                          )}
                          name={task.iconPath}
                        />
                      </div>
                      <div
                        className={cx(
                          'flex flex-col font-medium bgi-text-[var(--grayscale-100)]'
                        )}
                      >
                        <div className={cx('text-left text-sm')}>
                          {renderI18N(task.titleKey, t)}
                        </div>
                        <div className="text-base bgi-text-[var(--base-1-main)]">
                          {task.rewardType === VipRewardType.REBATE
                            ? `${task.value}%`
                            : formatMoney({ value: task.value })}
                        </div>
                      </div>
                    </div>

                    {/* 按鈕 共四張卡片，只有第一、二張會出現按鈕 */}
                    {index === 0 ? (
                      <button
                        className={cx(
                          'px-4 min-w-16 h-7',
                          'rounded-md',
                          'inline-flex justify-center items-center',
                          'absolute right-2 bottom-2 z-10 cursor-pointer', // z-10 是 加完border會無法觸發點擊事件
                          {
                            'bgi-[var(--base-1-variant3)]':
                              task.status === BonusRecieveStatus.UNRECIEVED,
                            // 'bgi-[var(--base-2-variant5)]':
                            //   task.status === BonusRecieveStatus.LOCK,
                            'bgi-[var(--base-2-variant5)]':
                              task.status === BonusRecieveStatus.RECIEVED ||
                              task.status === BonusRecieveStatus.LOCK,
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
                            'text-sm font-medium flex justify-center items-center flex-shrink-0',
                            {
                              'bgi-text-[var(--grayscale-100)]':
                                task.status === BonusRecieveStatus.UNRECIEVED,
                              'bgi-text-[var(--transparent-white-30)]':
                                task.status === BonusRecieveStatus.LOCK,
                              '':
                                task.status ===
                                BonusRecieveStatus.ONLY_DISPLAYED,
                            }
                          )}
                        >
                          {task.status === BonusRecieveStatus.LOCK ? (
                            <Icon
                              className={cx(lockIconCLass)}
                              name="ic_lock_2"
                            />
                          ) : (
                            <div
                              className={cx('text-sm font-medium', {
                                'bgi-text-[var(--transparent-white-30)]':
                                  task.status === BonusRecieveStatus.RECIEVED,
                                'bgi-text-[var(--base-2-variant5)]':
                                  task.status === BonusRecieveStatus.UNRECIEVED,
                              })}
                            >
                              {task.status === BonusRecieveStatus.UNRECIEVED
                                ? t('earn_my_rewards_withdraw_claim')
                                : null}
                              {task.status === BonusRecieveStatus.RECIEVED
                                ? t('activity_VIP_cards_claimed')
                                : null}
                            </div>
                          )}
                        </div>
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Table 1 */}
        <div
          className={cx(
            'mt-2',
            'rounded-md border border-[var(--base-1-main)] bgi-[var(--base-2-variant11)] overflow-hidden'
          )}
        >
          <div
            className={cx(
              'px-7 pt-5 pb-2 text-xl font-medium bgi-text-[var(--grayscale-100)] text-left'
            )}
          >
            {t('activity_VIP_monthly_cumulative_deposit_and_vip_levels')}
          </div>
          <VipTable
            theadTitles={[
              t('activity_VIP_table_header_vip_level'),
              t('activity_VIP_table_header_deposit'),
              t('activity_VIP_table_header_monthly_cashback'),
              t('activity_VIP_table_header_leveler_upgrade_bonus'),
              t('activity_VIP_table_header_free_daily_withdrawals'),
            ]}
            datas={table1Data}
            clearFormatMoneyIndex={4}
            styles={[
              {},
              {
                color: 'var(--base-1-main)',
              },
              {},
              {},
              {},
            ]}
          />
          <div
            className={cx(
              'px-6 py-5 box-border text-xs text-start bgi-[var(--base-2-variant8)]'
            )}
          >
            <p className="bgi-text-[var(--base-2-variant1)]">
              {t('activity_VIP_cash_bonus_note_1')}
            </p>
            <br />
            <p className="bgi-text-[var(--base-2-variant1)]">
              {t('activity_VIP_cash_bonus_note_2', {
                rewardDama: vipRewardDama,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VipPage;
