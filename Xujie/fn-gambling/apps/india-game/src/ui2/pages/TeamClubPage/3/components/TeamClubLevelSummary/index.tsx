import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperClass } from 'swiper/types';

import paginationSetting from './paginationSetting';
import { cx } from '@libs/commonUtils';
import './index.scss';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import TeamClubLevelProgress from '../TeamClubLevelProgress';
import RedDot from '@components/RedDot';
import {
  EResourceLevel,
  formatMoney,
  formatMoneyAbbrev,
  formatMoneyAbbrev4Digits,
  getImgUrl,
} from '@libs/mode2/utils';
import { useRef, useState } from 'react';
import TeamClubLevelGetContent from '../TeamClubLevelGetContent';
import TeamClubSwiperNavigationBtn from '../TeamClubSwiperNavigationBtn';
import { clubLevelTable } from '../../const';
import { useTranslation } from 'react-i18next';
import {
  TeamLevelUnit,
  useTeamClubLevelSummaryStore,
  useTeamClubWithDrawStore,
} from '@libs/mode2/zustand/components/myRewardsContent';
import { handleTeamClubLevelSummaryDetailButtonClick } from '@mode2/action/actionTypes';
import { useTeamClubAction } from '@/action/teamClub/useTeamClubAction';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import QuestionTooltip from '@components/QuestionTooltip';
import BgPattern from '@components/BgPattern';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { useMode2SubordinateDataPageStore } from '@libs/mode2/zustand/page/SubordinateDataStore';

export const TeamClubLevelSummary = () => {
  const { t } = useTranslation();
  const teamLevelConfigList = useTeamClubLevelSummaryStore(
    (state) => state.teamLevelConfigList
  );

  const teamMemberSummaryData = useMode2SubordinateDataPageStore(
    (state) => state.teamMemberSummaryData
  );
  const currentTeamTotalBets = useTeamClubWithDrawStore(
    (state) => state.currentTeamTotalBets
  );

  const currentTeamLevel = useTeamClubLevelSummaryStore(
    (state) => state.currentTeamLevel
  );

  const isNewJoinNotice = useUserProfileStore((state) => state.isNewJoinNotice);

  // level 剛好跟 index 對齊
  const initialSlideIndex =
    currentTeamLevel <= 3 && currentTeamLevel >= 0 ? currentTeamLevel : 0;

  const { handleTeamClubClick } = useTeamClubAction();

  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);
  const [prevItem, setPrevItem] = useState<TeamLevelUnit | null>(null);

  const swiperRef = useRef<SwiperType>();
  const prevIdxRef = useRef<number | null>(0);

  const handleSlideChange = (swiper: SwiperClass) => {
    // console.log('!! prevIdxRef', prevIdxRef.current);
    if (prevIdxRef.current !== null) {
      const prevItem = teamLevelConfigList[prevIdxRef.current]; // 取得上一個 item 的資料
      console.log('上一個 item:', prevItem);
      setPrevItem(prevItem);
    }

    const realIndex = swiper.realIndex;
    const totalSlides = teamLevelConfigList.length;
    prevIdxRef.current = realIndex;

    setIsFirst(realIndex === 0);
    setIsLast(realIndex === totalSlides - 1);
  };

  return (
    <div className={cx('team_club_level', 'relative')}>
      <Swiper
        key={initialSlideIndex}
        initialSlide={initialSlideIndex}
        navigation={{
          prevEl: '.custom-prev',
          nextEl: '.custom-next',
        }}
        spaceBetween={'30%'}
        slidesPerView={1}
        centeredSlides={false}
        slideToClickedSlide={true}
        loop={false}
        autoplay={false}
        observer={true}
        observeParents={false}
        modules={[Autoplay, Pagination, Navigation]}
        pagination={paginationSetting}
        onSlideChange={handleSlideChange}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {teamLevelConfigList.map((item: TeamLevelUnit, index: number) => {
          const table = clubLevelTable[item.clubLevel];
          const memberPercent =
            (item.currentMembers / item.requiredMembers) * 100;

          const betPercent = (item.currentBets / item.requiredBets) * 100;

          return (
            <SwiperSlide className="relative cursor-pointer" key={item.id}>
              {({ isActive }) => (
                <div className={cx('w-full')}>
                  {/* 緞帶背景 */}
                  <img
                    src={getImgUrl(EResourceLevel.V, 'team_club_title_bg')}
                    alt="Bottom background"
                    className={cx(
                      'block',
                      'w-[178px] h-[38px]',
                      'absolute -left-[2px] top-2 z-[2]'
                    )}
                  />
                  <div className={cx('w-full', 'pl-[5px]', 'relative')}>
                    {/* 上半部 */}
                    <div
                      className={cx(
                        'w-full h-full',
                        'rounded-t-xl after-rounded-xl',
                        'border border-b-0 bgi-border-[var(--transparent-white-10)]',
                        'bgi-[var(--base-2-variant14)]',
                        'relative',
                        'overflow-hidden',
                        'pb-[26px]'
                      )}
                    >
                      {/* 背景格子圖 */}
                      <BgPattern />

                      <div className={cx('relative z-[2]', 'w-full')}>
                        {/* description */}
                        <div
                          className={cx(
                            'w-full h-9',
                            'pt-2 pb-1 px-2',
                            'rounded-t-lg',
                            'relative',
                            FLEX_ITEMS_CENTER
                          )}
                        >
                          <span
                            className={cx(
                              'bgi-text-[var(--base-1-main)] text-sm',
                              'block',
                              'mr-auto'
                            )}
                          >
                            {t(item.clubTitle)}
                          </span>
                        </div>
                        <div
                          className={cx(
                            'w-full',
                            'px-4 pt-2',
                            FLEX_COL,
                            'gap-3'
                          )}
                        >
                          <div
                            className={cx(FLEX_ITEMS_CENTER, 'gap-2', 'w-full')}
                          >
                            {/* Club Stars */}
                            <div
                              className={cx(
                                'bgi-text-[var(--transparent-white-70)]',
                                'text-base'
                              )}
                            >
                              {t('earn_my_rewards_my_team_club_level_title')}
                            </div>

                            {/* 等級 */}
                            <img
                              src={getImgUrl(EResourceLevel.V, table.src)}
                              alt="level_image"
                              className="block w-[82px] h-[26px]"
                            />

                            {/* 問號 tooltip */}
                            <QuestionTooltip
                              placement="bottomLeft"
                              title={t('earn_my_rewards_club_level_tips')}
                              overlayClassName={cx('team_club_tooltip')}
                              btnClassName={cx('w-6 h-6 !p-0')}
                              iconClassName={cx('w-6 h-6')}
                            />

                            {/* detail 按鈕 */}
                            <div
                              className={cx(
                                'w-auto',
                                'relative z-[1]',
                                'ml-auto'
                              )}
                            >
                              <BaseSecondaryBtn
                                className={cx(
                                  'w-auto h-7',
                                  'px-4 py-1',
                                  'bg-shadow-[var(--box-shadow-5)]'
                                )}
                                onClick={() => {
                                  handleTeamClubClick({
                                    actionName:
                                      handleTeamClubLevelSummaryDetailButtonClick,
                                    payload: { tab: index },
                                  });
                                }}
                                children={
                                  <>
                                    {t('earn_my_rewards_my_team_club_detail')}
                                  </>
                                }
                              />

                              {isNewJoinNotice ? (
                                <RedDot
                                  // type="img"
                                  className={cx(
                                    'absolute -right-1 -top-1 z-10 w-2 h-2'
                                  )}
                                />
                              ) : null}
                            </div>
                          </div>

                          {/* 進度條區塊 */}
                          <div
                            className={cx('w-full', FLEX_ITEMS_CENTER, 'gap-2')}
                          >
                            {/* 進度條 */}
                            <div
                              className={cx(
                                FLEX_CENTER,
                                'h-full',
                                'w-full',
                                'flex-1'
                              )}
                            >
                              {item.isHighest ? (
                                <div
                                  className={cx('w-full h-[64px]', FLEX_CENTER)}
                                >
                                  <span
                                    className={cx(
                                      'block',
                                      'bgi-text-[var(--base-2-variant2)]',
                                      'text-base'
                                    )}
                                  >
                                    {t('earn_my_rewards_club_level_hint')}
                                  </span>
                                </div>
                              ) : (
                                <div
                                  className={cx(
                                    FLEX_COL,
                                    'gap-2',
                                    'w-full',
                                    'team_club_progress'
                                  )}
                                >
                                  <TeamClubLevelProgress
                                    iconName="ic_member"
                                    progressName={{
                                      i18nKey:
                                        'earn_my_rewards_my_team_club_club_member',
                                    }}
                                    percent={memberPercent}
                                    numerator={
                                      teamMemberSummaryData.totalMembers || 0
                                    }
                                    denominator={formatMoneyAbbrev({
                                      value: item.requiredMembers,
                                      showCurrency: false,
                                    })}
                                    progressStrokeColor={
                                      table.mainThemeVariableName
                                    }
                                  />

                                  <TeamClubLevelProgress
                                    iconName="ic_bet"
                                    progressName={{
                                      i18nKey:
                                        'earn_my_rewards_my_team_club_club_bet',
                                    }}
                                    percent={betPercent}
                                    // issue 105行 邀請俱樂部 Club Bet 的分子 應該與 Club member 的分子一樣 會持續往上累加【吃 teamTotalBets 的參數值】
                                    numerator={formatMoney({
                                      value: currentTeamTotalBets,
                                    })}
                                    denominator={formatMoneyAbbrev4Digits({
                                      value: item.requiredBets,
                                    })}
                                    progressStrokeColor={
                                      table.mainThemeVariableName
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 下半部 */}
                    <div
                      className={cx(
                        'reward-list',
                        // 'min-h-[10px]',
                        'px-4 pt-2 pb-[34px] box-border',
                        FLEX_COL,
                        'gap-1',
                        'relative z-[2]',
                        'bgi-[var(--base-2-variant11)]',
                        'rounded-b-xl after-rounded-xl',
                        'border border-t-0 bgi-border-[var(--transparent-white-10)]'
                      )}
                    >
                      <span
                        className={cx(
                          'text-base font-medium bgi-text-[var(--transparent-white-70)]'
                        )}
                      >
                        {/* // TODO I18N */}
                        {(memberPercent >= 100 && betPercent >= 100) ||
                        index === 0
                          ? 'My Rebate'
                          : 'You will get'}
                      </span>
                      {/* 內容 */}
                      <TeamClubLevelGetContent
                        isActive={isActive}
                        subThemeClass={'bgi-[var(--base-2-variant13)]'}
                        borderThemeClass={
                          'bgi-border-[var(--transparent-white-10)]'
                        }
                        betRebateRate={item.betRebateRate}
                        firstDepositRebates={item.firstDepositRebates}
                        maxRewards={item.maxRewards}
                        prevItem={prevItem}
                      />
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Swiper Prev button */}
      <TeamClubSwiperNavigationBtn type="prev" isDisabled={isFirst} />

      {/* Swiper Next button */}
      <TeamClubSwiperNavigationBtn type="next" isDisabled={isLast} />
    </div>
  );
};

export default TeamClubLevelSummary;
