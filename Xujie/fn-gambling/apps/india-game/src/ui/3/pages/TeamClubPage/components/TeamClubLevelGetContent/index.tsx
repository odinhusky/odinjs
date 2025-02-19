import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import TeamClubLevelRewardUnit from '../TeamClubLevelRewardUnit';
import { cx } from '@libs/commonUtils';
import { formatMoney } from '@libs/mode2/utils';
import { TeamLevelUnit } from '@libs/mode2/zustand/components/myRewardsContent';
import { get } from 'lodash';

interface TeamClubLevelGetContentProps {
  isActive?: boolean;
  subThemeClass: string;
  borderThemeClass: string;
  betRebateRate: number;
  firstDepositRebates: number;
  maxRewards: number;
  prevItem: TeamLevelUnit | null;
}

export const TeamClubLevelGetContent = ({
  isActive,
  subThemeClass,
  borderThemeClass,
  betRebateRate,
  firstDepositRebates,
  maxRewards,
  prevItem,
}: TeamClubLevelGetContentProps) => {
  const prevBetRebateValue = get(prevItem, 'betRebateRate', 0);
  const prevFirstDepositRebatesValue = get(prevItem, 'firstDepositRebates', 0);
  const prevMaxRewardsValue = get(prevItem, 'maxRewards', 0);

  const commonProps = {
    isActive,
  };

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
        {...commonProps}
        src="my_rewards_bet_rebate"
        text1="Bet rebate"
        text2="up to "
        value={betRebateRate}
        prevValue={prevBetRebateValue}
      />

      <TeamClubLevelRewardUnit
        {...commonProps}
        src="my_rewards_first_deposit"
        text1="First deposit"
        text2="rebate "
        value={firstDepositRebates}
        prevValue={prevFirstDepositRebatesValue}
      />

      <TeamClubLevelRewardUnit
        {...commonProps}
        src="my_rewards_invite"
        text1="Invitate rewards"
        text2="up to "
        value={maxRewards}
        prevValue={prevMaxRewardsValue}
        formatter={(value) => `${formatMoney(value)}`}
      />
    </div>
  );
};

export default TeamClubLevelGetContent;
