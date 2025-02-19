import './index.scss';
import { useEffect, useRef, useState, useMemo } from 'react';
// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Swiper as SwiperType } from 'swiper'; // Swiper 实例类型
import 'swiper/css';
import 'swiper/css/navigation';
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
import Icon from '@components/Icon';
import useMyVipContentBase from '@mode2/usecase/page/activityPage/useMyVipContentBase';
import { isNaN } from 'lodash';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import UserInfo from '../UserInfo';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';
import { useBreakPoint } from '@libs/commonUtils';

const VipGroup = () => {
  useMyVipContentBase();
  const { t } = useTranslation();
  const { isMobile } = useBreakPoint();
  const { handleActivityPageClick } = useActivityPageActions();

  const mainElementRef = useTemplateLayoutStore(
    (state) => state.mainElementRef
  );

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
    return match ? getImgUrl(EResourceLevel.ICONS, match.img) : ''; // 默认图片或空字符串
  };

  useEffect(() => {
    return () => {
      swiperRef.current = null; // 组件卸载时清理引用
    };
  }, []);

  useEffect(() => {
    if (mainElementRef && mainElementRef.current) {
      if (mainElementRef.current.firstChild) {
        (mainElementRef.current.firstChild as HTMLElement).classList.add(
          '!px-0'
        );
      }
    }

    return () => {
      if (mainElementRef && mainElementRef.current) {
        if (mainElementRef.current.firstChild) {
          (mainElementRef.current.firstChild as HTMLElement).classList.remove(
            '!px-0'
          );
        }
      }
    };
  }, [mainElementRef]);

  const isEnabledCenterSlide = !isMobile || (isMobile && activeIndex !== 0);

  return (
    <div
      className={cx('vip-group bgi-text-[var(--grayscale-100)]')}
      style={{
        backgroundImage: `url(${getImgUrl(
          EResourceLevel.ICONS,
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
        <div className={cx('h-auto', 'flex justify-center', 'relative')}>
          <div
            className={cx('relative', 'w-full h-44', 'shrink-0 flex items-end')}
          >
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)} // 获取 Swiper 实例
              spaceBetween={20}
              slidesPerView={'auto'}
              onSlideChange={handleSlideChange}
              centeredSlides={isEnabledCenterSlide}
              loop={false}
              initialSlide={vipLevel - 1}
            >
              {vipInfos.map((vipInfo, index) => {
                let percent = 0;
                if (vipInfo.level < vipLevel) {
                  percent = 100;
                } else if (vipInfo.level === vipLevel + 1) {
                  percent = vipProgressPercent;
                }
                const isNextLevel = index === vipLevel + 1;

                return vipInfo.level !== 0 ? (
                  <SwiperSlide key={index} className="vip-card-slide">
                    <div className={cx('vip-card flex relative items-end', '')}>
                      <img
                        className="w-full h-full"
                        src={getImageForIndex(index)}
                        alt={'vip' + index}
                      />
                      <div
                        className={cx(
                          'flex items-center gap-4',
                          'absolute top-0 left-3'
                        )}
                      >
                        <img
                          className={cx('w-24')}
                          src={getImgUrl(
                            EResourceLevel.ICONS,
                            `vip_rank_${index}`
                          )}
                          alt={'vip' + index}
                        />
                        <div className={cx('')}>
                          {isNextLevel ? (
                            <div className="text-xl font-medium bgi-text-[var(--grayscale-60)]">
                              {t('activity_VIP_cards_next_level_tag')}
                            </div>
                          ) : null}
                          {vipLevel === index ? (
                            <div className="text-xl font-medium bgi-text-[var(--grayscale-60)]">
                              {/* TODO i18n */}
                              My level
                            </div>
                          ) : null}
                          <img
                            className={cx(index === activeIndex ? 'h-9' : '')}
                            src={getImgUrl(
                              EResourceLevel.ICONS,
                              `vip_card_level_${index}`
                            )}
                            alt={'vip' + index}
                          />
                        </div>
                      </div>

                      {index === 0 ? null : (
                        <LvInfo
                          curLv={vipInfo.level - 1}
                          vipLevel={vipLevel}
                          maxLv={maxCurLv}
                          percent={percent}
                          deposit={vipInfos[index]?.deposit}
                          rechargeAmount={rechargeAmount}
                          hiddenProcess={!isNextLevel && vipLevel !== index}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                ) : null;
              })}
            </Swiper>
          </div>
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
                        EResourceLevel.ICONS,
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
                          className={cx('w-full', {
                            'opacity-70':
                              task.status === BonusRecieveStatus.LOCK,
                          })}
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
                            : formatMoney(task.value)}
                        </div>
                      </div>
                    </div>

                    {/* 按鈕 共四張卡片，只有第一張第二張卡片會出現按鈕 */}
                    {[0, 1].includes(index) && activeIndex !== 0 ? (
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
                              className={cx('text-sm', {
                                'bgi-text-[var(--transparent-white-30)]':
                                  task.status === BonusRecieveStatus.RECIEVED,
                              })}
                            >
                              {/* TODO i18n */}
                              Claim
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
              'px-6 py-5 box-border text-xs text-center bgi-[var(--base-2-variant8)]'
            )}
          >
            <span className="bgi-text-[var(--base-2-variant1)]">
              {t('activity_VIP_cash_bonus_note')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VipGroup;
