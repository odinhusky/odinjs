import { cx } from '@libs/commonUtils';
import React from 'react';
import TeamClubWithdrawRewards from '../TeamClubWithdrawRewards';
import TeamClubLevelSummary from '../TeamClubLevelSummary';
import { FLEX_COL } from '@libs/constant/style';
import TeamClubShare from '../TeamClubShare';
import TeamClubWithdrawReceivedModal from '../TeamClubWithdrawReceivedModal';
import useTeamClubMyRewardContentBase from '@mode2/usecase/components/useTeamClubMyRewardContentBase';

const MyRewardsContent = () => {
  useTeamClubMyRewardContentBase();

  return (
    <div className={cx('text-[white]', FLEX_COL, 'gap-3 -ml-1')}>
      <TeamClubLevelSummary />

      <TeamClubWithdrawRewards />

      <TeamClubShare />

      <TeamClubWithdrawReceivedModal />
    </div>
  );
};

export default MyRewardsContent;
