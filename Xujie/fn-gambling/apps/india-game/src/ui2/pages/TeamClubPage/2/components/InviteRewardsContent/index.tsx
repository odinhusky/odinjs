import InviteRewardsSummary from './InviteRewardsSummary';
import InviteRewardMemberCumulative from './InviteRewardMemberCumulative';
import InviteRewardsMilestones from './InviteRewardsMilestones';
import useInviteRewardsBase from '@mode2/usecase/components/useInviteRewardsBase';

const InviteRewardsContent = () => {
  useInviteRewardsBase();
  return (
    <div className={'flex flex-col gap-4 justify-center'}>
      <InviteRewardsSummary />
      <InviteRewardMemberCumulative />
      <InviteRewardsMilestones />
    </div>
  );
};

export default InviteRewardsContent;
