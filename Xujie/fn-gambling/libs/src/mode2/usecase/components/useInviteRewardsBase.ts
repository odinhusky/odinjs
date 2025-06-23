import {
  InviteesLevelMilestoneItem,
  useInviteRewardsContentStore,
} from '@mode2/zustand/components/inviteRewardsContentStore';
import { useEffect } from 'react';
import { useDeepEffect } from '@libs/commonUtils';
import { usePostTeamInviteInformationMutation } from '@mode2API/index';
import sdkUtils from '@mode2/utils/sdk';

export const useInviteRewardsBase = () => {
  const [postTeamInviteInformation, { data: teamInviteInformationData }] =
    usePostTeamInviteInformationMutation();

  const setTotalInvitationRewards = useInviteRewardsContentStore(
    (state) => state.setTotalInvitationRewards
  );
  const setTotalInvitees = useInviteRewardsContentStore(
    (state) => state.setTotalInvitees
  );
  const setValidInvitees = useInviteRewardsContentStore(
    (state) => state.setValidInvitees
  );
  const setDailyValidInvitees = useInviteRewardsContentStore(
    (state) => state.setDailyValidInvitees
  );
  const setRewardPerInvite = useInviteRewardsContentStore(
    (state) => state.setRewardPerInvite
  );

  const setRewardForInvitee = useInviteRewardsContentStore(
    (state) => state.setRewardForInvitee
  );
  const setDailyInviteLimit = useInviteRewardsContentStore(
    (state) => state.setDailyInviteLimit
  );
  const setMaxInvitationRewards = useInviteRewardsContentStore(
    (state) => state.setMaxInvitationRewards
  );
  const setMaxInvitees = useInviteRewardsContentStore(
    (state) => state.setMaxInvitees
  );
  const setInviteesLevelMilestoneItems = useInviteRewardsContentStore(
    (state) => state.setInviteesLevelMilestoneItems
  );
  const setValidMilestoneProgress = useInviteRewardsContentStore(
    (state) => state.setValidMilestoneProgress
  );
  const setInviteRewardsClaimAll = useInviteRewardsContentStore(
    (state) => state.setInviteRewardsClaimAll
  );
  const refreshInviteRewardsCount = useInviteRewardsContentStore(
    (state) => state.refreshInviteRewardsCount
  );

  const clear = useInviteRewardsContentStore((state) => state.clear);

  useEffect(() => {
    if (sdkUtils.isCurrentLogin()) {
      postTeamInviteInformation();
    } else {
      clear();
    }
  }, [refreshInviteRewardsCount]);

  useDeepEffect(() => {
    if (teamInviteInformationData) {
      const data = teamInviteInformationData;
      console.log('@@@===> teamInviteInformationData', data);

      setTotalInvitationRewards(data.totalInvitationRewards);
      setTotalInvitees(data.totalInvitees);
      setValidInvitees(data.validInvitees);
      setRewardPerInvite(data.rewardPerInvite);
      setRewardForInvitee(data.rewardForInvitee);
      setDailyValidInvitees(data.dailyValidInvitees);
      setDailyInviteLimit(data.dailyInviteLimit);
      setMaxInvitees(data.maxInviteCount);
      setMaxInvitationRewards(data.maxInviteRewards);
      setInviteRewardsClaimAll(data.primaryStatus);

      const inviteesLevelMilestoneItems: InviteesLevelMilestoneItem[] =
        data.inviteesLevelMilestoneRules.map((item, index) => {
          return {
            ...item,
            levelResName: `invite_rewards_goal_${index + 1}`,
            lastRequiredPeople:
              index === 0
                ? 0
                : data.inviteesLevelMilestoneRules[index - 1].requiredPeople,
          };
        });

      setInviteesLevelMilestoneItems(inviteesLevelMilestoneItems);

      // NOTE Evan 重要演算 精準目前進度百分比
      const blockAverage = inviteesLevelMilestoneItems
        ? 100 / (inviteesLevelMilestoneItems.length - 1)
        : 100;
      const validMilestoneProgress = [...inviteesLevelMilestoneItems].reduce(
        (acc, curr, currentIndex) => {
          const offset = 0.5;
          if (currentIndex === 0) {
            return acc + offset;
          }
          if (curr.isAchieve) {
            return acc + blockAverage;
          }

          if (
            curr.achieveCount <= curr.requiredPeople &&
            curr.achieveCount >= curr.lastRequiredPeople
          ) {
            const count =
              (curr.achieveCount - curr.lastRequiredPeople) /
              (curr.requiredPeople - curr.lastRequiredPeople);
            return acc + count * blockAverage;
          }
          return acc;
        },
        0
      );
      setValidMilestoneProgress(validMilestoneProgress);
    }
  }, [teamInviteInformationData]);
};

export default useInviteRewardsBase;
