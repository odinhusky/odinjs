import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperClass } from 'swiper/types';

import paginationSetting from './paginationSetting';
import { cx } from '@libs/commonUtils';
import './index.scss';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import TeamClubLevelProgress from '../TeamClubLevelProgress';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import RedDot from '@components/RedDot';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { useRef, useState } from 'react';
import TeamClubLevelGetContent from '../TeamClubLevelGetContent';
import TeamClubSwiperNavigationBtn from '../TeamClubSwiperNavigationBtn';
import { clubLevelTable } from '../../const';
import { useTranslation } from 'react-i18next';
import {
  TeamLevelUnit,
  useTeamClubLevelSummaryStore,
} from '@libs/mode2/zustand/components/myRewardsContent';
import { handleTeamClubLevelSummaryDetailButtonClick } from '@mode2/action/actionTypes';
import { useTeamClubAction } from '@/action/teamClub/useTeamClubAction';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import QuestionTooltip from '@components/QuestionTooltip';

export const TeamClubLevelSummary = () => {
  const { t } = useTranslation();
  const teamLevelConfigList = useTeamClubLevelSummaryStore(
    (state) => state.teamLevelConfigList
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

  const swiperRef = useRef<SwiperType>();

  const handleSlideChange = (swiper: SwiperClass) => {
    const realIndex = swiper.realIndex;
    const totalSlides = teamLevelConfigList.length;

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

          return (
            <SwiperSlide className="relative cursor-pointer" key={item.id}>
              <div
                className={cx(
                  'w-full h-full',
                  'border bgi-border-[var(--base-1-light)]',
                  'after-rounded-lg rounded-lg',
                  'bgi-[var(--linear-1)]'
                )}
              >
                <div className={cx('relative', 'w-full')}>
                  {/* description */}
                  <div
                    className={cx(
                      'bgi-[var(--linear-4)]',
                      'w-full h-9',
                      'py-1 px-2',
                      'rounded-t-lg',
                      FLEX_ITEMS_CENTER
                    )}
                  >
                    <span
                      className={cx(
                        'bgi-text-[var(--grayscale-100)] text-sm',
                        'block',
                        'mr-auto'
                      )}
                    >
                      {t('earn_my_rewards_my_team_club_title')}
                    </span>

                    <div className={cx('w-auto', 'relative z-[1]')}>
                      <BasePrimaryBtn
                        className={cx('w-auto h-7', 'px-4 py-1')}
                        onClick={() => {
                          handleTeamClubClick({
                            actionName:
                              handleTeamClubLevelSummaryDetailButtonClick,
                            payload: { tab: index },
                          });
                        }}
                        children={
                          <>{t('earn_my_rewards_my_team_club_detail')}</>
                        }
                      />

                      {isNewJoinNotice ? (
                        <RedDot
                          type="img"
                          className={cx('absolute right-0 top-0 z-10')}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className={cx('w-full', 'px-2 pt-2', FLEX_COL, 'gap-1')}>
                    <div className={cx(FLEX_ITEMS_CENTER, 'w-full')}>
                      <span
                        className={cx(
                          'block',
                          'bgi-text-[var(--grayscale-100)]',
                          'text-sm',
                          'mr-2',
                          'self-start'
                        )}
                      >
                        {t('earn_my_rewards_my_team_club_level_title')}
                      </span>

                      {/* 等級 */}
                      <div
                        className={cx(
                          'relative',
                          FLEX_CENTER,
                          'gap-[2px]',
                          `${table.mainThemeClass}`,
                          'w-auto h-5',
                          'rounded-[2px]',
                          'bgi-border-[var(--transparent-white-20)]',
                          'after-rounded-sm',
                          'pl-1 pr-2 py-1',
                          'mr-auto'
                        )}
                      >
                        <img
                          src={getImgUrl(EResourceLevel.V, table.src)}
                          alt=""
                          className="w-[14px] h-[14px]"
                        />

                        <span
                          className={cx(
                            'text-xs bhi-text-[var(--grayscale-100)]'
                          )}
                        >
                          {table.levelText}
                        </span>
                      </div>

                      {/* 問號 tooltip */}
                      <QuestionTooltip
                        placement="bottomRight"
                        title={t('earn_my_rewards_club_level_tips')}
                        overlayClassName="team_club_tooltip"
                      />
                    </div>

                    <div className={cx('w-full', FLEX_ITEMS_CENTER, 'gap-2')}>
                      <div className={cx('w-16', 'relative')}>
                        <img
                          src={getImgUrl(EResourceLevel.V, table.src)}
                          alt=""
                          className="w-16 h-16"
                        />

                        {!item.isAchieve ? (
                          <img
                            src={getImgUrl(EResourceLevel.V, 'ic_lock')}
                            alt="Locked image"
                            className={cx(
                              'w-6 h-6',
                              'block',
                              'absolute right-0 bottom-0'
                            )}
                          />
                        ) : null}
                      </div>

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
                            className={cx(
                              'w-full h-[64px]',
                              FLEX_CENTER,
                              'bgi-[var(--transparent-white-10)]',
                              'rounded-lg'
                            )}
                          >
                            <span
                              className={cx(
                                'block',
                                'bgi-text-[var(--transparent-white-30)]',
                                'text-sm'
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
                              percent={
                                (item.currentMembers / item.requiredMembers) *
                                100
                              }
                              numerator={item.currentMembers}
                              denominator={item.requiredMembers}
                              progressStrokeColor={table.mainThemeVariableName}
                            />

                            <TeamClubLevelProgress
                              iconName="ic_bet"
                              progressName={{
                                i18nKey:
                                  'earn_my_rewards_my_team_club_club_bet',
                              }}
                              percent={
                                (item.currentBets / item.requiredBets) * 100
                              }
                              numerator={formatMoney({
                                value: item.currentBets,
                              })}
                              denominator={formatMoney({
                                value: item.requiredBets,
                              })}
                              progressStrokeColor={table.mainThemeVariableName}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 分隔線 */}
                {/*<div*/}
                {/*  className={cx('h-px', 'bgi-[var(--transparent-white-10)]')}*/}
                {/*></div>*/}

                {/* 下半部 */}
                <div
                  className={cx(
                    'reward-list',
                    'min-h-[100px]',
                    'p-2 pb-8',
                    FLEX_COL,
                    'gap-1'
                  )}
                >
                  {/*<h4*/}
                  {/*  className={cx(*/}
                  {/*    'bgi-text-[var(--grayscale-100)]',*/}
                  {/*    'text-base'*/}
                  {/*  )}*/}
                  {/*>*/}
                  {/*  {t('earn_my_rewards_my_team_club_reward_title')}...*/}
                  {/*</h4>*/}

                  {/* 內容 */}
                  <TeamClubLevelGetContent
                    subThemeClass={table.subThemeClass}
                    borderThemeClass={table.borderThemeClass}
                    betRebateRate={item.betRebateRate}
                    firstDepositRebates={item.firstDepositRebates}
                    maxRewards={item.maxRewards}
                  />
                </div>
              </div>
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
