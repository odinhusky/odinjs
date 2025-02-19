import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import TeamClubLevelProgress from './TeamClubLevelProgress';
import { t } from 'i18next';
import { clubLevelTable } from '@pages/TeamClubPage/const';
import { useMode2SubordinateDataPageStore } from '@libs/mode2/zustand/page/SubordinateDataStore';
import QuestionTooltip from '@components/QuestionTooltip';

export const TeamClubLevelSummary = () => {
  const currentClubLevelData = useMode2SubordinateDataPageStore(
    (state) => state.currentClubLevelData
  );
  const teamMemberSummaryData = useMode2SubordinateDataPageStore(
    (state) => state.teamMemberSummaryData
  );

  return (
    <div
      className={cx(
        'w-full',
        'bgi-border-[var(--base-1-light)]',
        'after-rounded-lg',
        'rounded-lg',
        'bgi-[var(--linear-1)]'
      )}
    >
      <div className={cx('w-full p-2')}>
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
              `bgi-[var(${
                clubLevelTable[currentClubLevelData.clubLevel || 1]
                  .mainThemeVariableName
              })]`,
              'w-auto h-5',
              'rounded-[2px]',
              'bgi-border-[var(--transparent-white-20)]',
              'after-rounded-sm',
              'pl-1 pr-2 py-1',
              'mr-auto'
            )}
          >
            <img
              src={getImgUrl(
                EResourceLevel.V,
                clubLevelTable[currentClubLevelData.clubLevel || 1].src
              )}
              alt=""
              className="w-[14px] h-[14px]"
            />

            <span className={cx('text-xs bgi-text-[var(--grayscale-100)]')}>
              {clubLevelTable[currentClubLevelData.clubLevel || 1].levelText}
            </span>
          </div>

          <QuestionTooltip
            placement="bottomRight"
            title={t('earn_my_rewards_club_level_tips')}
            overlayClassName=""
            btnClassName="!p-0"
          />
        </div>

        <div className={cx('w-full', FLEX_ITEMS_CENTER, 'gap-2 mt-1')}>
          <div className={cx('w-16 shrink-0')}>
            <img
              src={getImgUrl(
                EResourceLevel.V,
                clubLevelTable[currentClubLevelData.clubLevel || 1].src
              )}
              alt=""
              className="w-16 h-16"
            />
          </div>

          {/* 進度條 */}
          {currentClubLevelData.isHighest ? (
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
            <div className={cx(FLEX_CENTER, 'h-full', 'w-full', 'flex-1')}>
              <div className={cx(FLEX_COL, 'gap-2', 'w-full')}>
                <TeamClubLevelProgress
                  iconName="ic_member"
                  progressName={t('earn_my_rewards_my_team_club_club_member')}
                  mainThemeVariableName={
                    clubLevelTable[currentClubLevelData.clubLevel || 1]
                      .mainThemeVariableName
                  }
                  percent={
                    (teamMemberSummaryData.totalMembers /
                      currentClubLevelData.requiredMembers) *
                    100
                  }
                  numerator={teamMemberSummaryData.totalMembers || 0}
                  denominator={currentClubLevelData.requiredMembers || 0}
                />

                <TeamClubLevelProgress
                  iconName="ic_bet"
                  progressName={t('earn_my_rewards_my_team_club_club_bet')}
                  mainThemeVariableName={
                    clubLevelTable[currentClubLevelData.clubLevel || 1]
                      .mainThemeVariableName
                  }
                  percent={
                    (currentClubLevelData.currentBets /
                      currentClubLevelData.requiredBets) *
                    100
                  }
                  numerator={currentClubLevelData.currentBets || 0}
                  denominator={currentClubLevelData.requiredBets || 0}
                  isCurrency={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamClubLevelSummary;
