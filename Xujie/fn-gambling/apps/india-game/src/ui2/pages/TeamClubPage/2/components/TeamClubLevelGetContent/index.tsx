import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import TeamClubLevelRewardUnit from '../TeamClubLevelRewardUnit';
import { cx } from '@libs/commonUtils';
import { formatMoney } from '@libs/mode2/utils';

interface TeamClubLevelGetContentProps {
  subThemeClass: string;
  borderThemeClass: string;
  betRebateRate: number;
  firstDepositRebates: number;
  maxRewards: number;
}

export const TeamClubLevelGetContent = ({
  subThemeClass,
  borderThemeClass,
  betRebateRate,
  firstDepositRebates,
  maxRewards,
}: TeamClubLevelGetContentProps) => {
  return (
    <div
      className={cx(
        FLEX_ITEMS_CENTER,
        'justify-between gap-2',
        'w-full',
        'rounded-lg',
        `${subThemeClass}`,
        `border ${borderThemeClass} after-rounded-lg`,
        'px-3 py-2'
      )}
    >
      <TeamClubLevelRewardUnit
        src="my_rewards_bet_rebate"
        i18nKey="earn_my_rewards_my_team_club_reward_bet"
        values={{
          percent: betRebateRate,
        }}
      />

      <TeamClubLevelRewardUnit
        src="my_rewards_first_deposit"
        i18nKey="earn_my_rewards_my_team_club_reward_deposit"
        values={{
          percent: firstDepositRebates,
        }}
      />

      <TeamClubLevelRewardUnit
        src="my_rewards_invite"
        i18nKey="earn_my_rewards_my_team_club_reward_invite"
        values={{
          maxReward: formatMoney({ value: maxRewards }),
        }}
      />
    </div>
  );
};

export default TeamClubLevelGetContent;
