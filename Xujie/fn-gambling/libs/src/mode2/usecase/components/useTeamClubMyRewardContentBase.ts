import { INV6 } from '@libs/constant/versions';
import {
  usePostTeamInformationMutation,
  usePostTeamMemberSummaryMutation,
} from '@libs/mode2/external/api';
import sdkUtils from '@libs/mode2/utils/sdk';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import {
  TeamLevelUnit,
  useTeamClubLevelSummaryStore,
  useTeamClubWithDrawStore,
} from '@libs/mode2/zustand/components/myRewardsContent';
import { useMode2SubordinateDataPageStore } from '@libs/mode2/zustand/page/SubordinateDataStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import get from 'lodash/get';
import { useEffect } from 'react';

export const useTeamClubMyRewardContentBase = () => {
  const isV6 = import.meta.env['VITE_V_VERSION'] === INV6;
  // - 取得 <MyRewardsContent> 的資料
  const [
    postTeamInformation,
    { data: teamInformationData, isSuccess: isPostTeamInformationSuccess },
  ] = usePostTeamInformationMutation();

  // - 取得 Detail 按鈕的紅點 和 俱樂部 成員數量，IN[V6]是固定顯示俱樂部成員數量
  const [postTeamMemberSummary, { data: teamMemberSummaryData, isSuccess }] =
    usePostTeamMemberSummaryMutation();

  console.log('@@ teamInformationData', teamInformationData);
  console.log('@@ isV6', isV6);

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
  const setCurrentTeamTotalBets = useTeamClubWithDrawStore(
    (state) => state.setCurrentTeamTotalBets
  );

  const refreshTeamInformationCount = useTeamClubWithDrawStore(
    (state) => state.refreshTeamInformationCount
  );

  const setTeamMemberSummaryData = useMode2SubordinateDataPageStore(
    (state) => state.setTeamMemberSummaryData
  );

  useEffect(() => {
    postTeamInformation();
  }, [refreshTeamInformationCount]);

  useEffect(() => {
    if (isV6) {
      postTeamMemberSummary();
    }
  }, []);

  // IN[V6] 改為 從usePostTeamMemberSummaryMutation 獲取, 其他版本照舊
  const newMemberJoinNotice = (currentMemberCount: number) => {
    // if (isV6) {
    //   setNewJoinNotice(false);
    //   return;
    // }

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

  /**
   * 俱樂部title
   * @param currentTeamLevel 當前等級
   * @param level 每一個item的等級
   * @param length 共有幾個等級
   * @returns
   */
  const getRewardsTitle = (
    currentTeamLevel: number,
    level: number,
    length: number
  ) => {
    if (level === length - 1) return 'earn_highest_star';
    if (currentTeamLevel < level) {
      return 'earn_next_team_club';
    } else {
      return 'earn_my_rewards_my_team_club_title';
    }
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
              clubTitle: getRewardsTitle(
                level,
                item.level,
                teamClubLevelItems.length
              ),
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

      const currentTeamTotalBets = get(
        teamInformationData,
        'currentTeamTotalBets'
      );
      setCurrentTeamTotalBets(currentTeamTotalBets || 0);

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

      if (!isV6) {
        newMemberJoinNotice(currentTotalTeamMembers);
      }
    }
  }, [teamInformationData, isPostTeamInformationSuccess]);

  // for[IN][V6]
  useEffect(() => {
    if (isV6 && isSuccess && teamMemberSummaryData) {
      setTeamMemberSummaryData(teamMemberSummaryData);
      // 是否有新成員加入
      const hasNewMembers = get(teamMemberSummaryData, 'hasNewMembers');
      setNewJoinNotice(hasNewMembers);
    }
  }, [isSuccess, teamMemberSummaryData]);
};

export default useTeamClubMyRewardContentBase;
