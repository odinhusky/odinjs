import { CONTAINER_CLASS, estimateIncomeList } from '@pages/TeamClubPage/const';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import TeamClubRulesEstimateUnit from '../TeamClubRulesEstimateUnit';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';
// import { useTeamClubRulesStore } from '@libs/mode2/zustand/page/teamClubRulesPageStore';
// import { isEmpty } from 'lodash';

interface TeamClubRulesEstimateIncomeProps {}

export const TeamClubRulesEstimateIncome =
  ({}: TeamClubRulesEstimateIncomeProps) => {
    // const teamClubEstimatedRulesItems = useTeamClubRulesStore(
    //   (state) => state.teamClubEstimatedRulesItems
    // );

    // const list = !isEmpty(teamClubEstimatedRulesItems)
    //   ? teamClubEstimatedRulesItems.map((item, index) => ({
    //       id: `income-${item.level}`,
    //       order: index + 1,
    //       totalBet: item.requiredBets,
    //       upTo: item.monthMaxRebates,
    //     }))
    //   : estimateIncomeList;

    return (
      <div className={cx(CONTAINER_CLASS)}>
        <RulesImgTitle
          title={{ i18nKey: 'earn_rules_title_estimated_income' }}
        />

        <RulesContainer
          className={cx(
            'p-3',
            FLEX_COL,
            'gap-2',
            'bg-shadow-[var(--shadow-team-club-border)]'
          )}
          children={
            <>
              {estimateIncomeList.map((item, index) => (
                <TeamClubRulesEstimateUnit key={item.id} {...item} />
              ))}
            </>
          }
        />
      </div>
    );
  };

export default TeamClubRulesEstimateIncome;
