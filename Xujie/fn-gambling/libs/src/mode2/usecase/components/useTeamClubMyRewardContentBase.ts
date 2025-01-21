import { usePostTeamInformationMutation } from '@libs/mode2/external/api';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import {
  TeamLevelUnit,
  useTeamClubLevelSummaryStore,
  useTeamClubWithDrawStore,
} from '@libs/mode2/zustand/components/myRewardsContent';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { get } from 'lodash';
import { useEffect } from 'react';

export const useTeamClubMyRewardContentBase = () => {
  // - 取得 <MyRewardsContent> 的資料
  const [
    postTeamInformation,
    { data: teamInformationData, isSuccess: isPostTeamInformationSuccess },
  ] = usePostTeamInformationMutation();

  console.log('@@ teamInformationData', teamInformationData);

  const setTeamLevelConfigList = useTeamClubLevelSummaryStore(
    (state) => state.setTeamLevelConfigList
  );

  const setCurrentTeamLevel = useTeamClubLevelSummaryStore(
    (state) => state.setCurrentTeamLevel
  );

  const setCurrentTotalTeamMembers = useUserProfileStore(
    (state) => state.setCurrentTotalTeamMembers
  );

  const setNewJoinNotice = useUserProfileStore(
    (state) => state.setNewJoinNotice
  );

  const setIsClaimable = useTeamClubWithDrawStore(
    (state) => state.setIsClaimable
  );

  const setRewards = useTeamClubWithDrawStore((state) => state.setRewards);

  const setTodayReward = useTeamClubWithDrawStore(
    (state) => state.setTodayReward
  );

  const setTotalReward = useTeamClubWithDrawStore(
    (state) => state.setTotalReward
  );

  const refreshTeamInformationCount = useTeamClubWithDrawStore(
    (state) => state.refreshTeamInformationCount
  );

  useEffect(() => {
    postTeamInformation();
  }, [refreshTeamInformationCount]);

  const newMemberJoinNotice = (currentMemberCount: number) => {
    if (currentMemberCount <= 0) {
      setNewJoinNotice(false);
      return;
    }
    const userId = useUserProfileStore.getState().id;
    const teamMemberTotalCount: Record<number, number> = JSON.parse(
      sdkUtils.getStorage(AppLocalStorageKey.TEAM_MEMBER_TOTAL_COUNT) || '{}'
    );
    const lastMemberCount: number = Number(teamMemberTotalCount[userId] || 0);
    setNewJoinNotice(currentMemberCount > lastMemberCount);
  };

  useEffect(() => {
    if (isPostTeamInformationSuccess) {
      const teamClubLevelItems = get(teamInformationData, 'teamClubLevelItems');
      const level = get(teamInformationData, 'currentTeamLevel', 0);

      if (teamClubLevelItems?.length === 4) {
        const list: TeamLevelUnit[] = teamClubLevelItems.map(
          (item, index, arr) => {
            // - 返回畫面需要的資料
            return {
              ...item,
              isHighest: index + 1 === arr.length,
              id: `level config ${item.level}`,
              clubLevel: item.level + 1,
            };
          }
        );

        setCurrentTeamLevel(level);
        setTeamLevelConfigList(list);
      }

      const isClaimable = get(
        teamInformationData,
        'teamClubWithdrawInfo.isClaimable',
        false
      );

      setIsClaimable(isClaimable);

      const rewards = get(
        teamInformationData,
        'teamClubWithdrawInfo.rewards',
        0
      );

      setRewards(rewards);

      const todayReward = get(
        teamInformationData,
        'teamClubWithdrawInfo.todayReward',
        0
      );

      setTodayReward(todayReward);

      const totalReward = get(
        teamInformationData,
        'teamClubWithdrawInfo.totalReward',
        0
      );

      setTotalReward(totalReward);

      const currentTotalTeamMembers = get(
        teamInformationData,
        'currentTotalTeamMembers',
        0
      );
      setCurrentTotalTeamMembers(currentTotalTeamMembers);
      newMemberJoinNotice(currentTotalTeamMembers);
    }
  }, [teamInformationData, isPostTeamInformationSuccess]);
};

export default useTeamClubMyRewardContentBase;
