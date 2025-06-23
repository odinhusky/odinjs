import {
  useMode2InviteEarnStore,
  useMode2InvitePageTeamStore,
} from '@mode2/zustand/page/invitePageStore';
import { useEffect } from 'react';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';
import dayjs from '@commonUtils/localizedDayjs';

export const useInviteRecommend = () => {
  const refreshPromoteHomeData = useMode2InviteEarnStore(
    (state) => state.refreshPromoteHomeData
  );
  const promoteHomeData = useMode2InviteEarnStore(
    (state) => state.promoteHomeData
  );

  const setLastFetchTime = useMode2InviteEarnStore(
    (state) => state.setLastFetchTime
  );
  const setTotalNumberOfInvitees = useMode2InvitePageTeamStore(
    (state) => state.setTotalNumberOfInvitees
  );
  const setNewNumberOfInvitees = useMode2InvitePageTeamStore(
    (state) => state.setNewNumberOfInvitees
  );
  const setWeeklySalaryReward = useMode2InvitePageTeamStore(
    (state) => state.setWeeklySalaryReward
  );
  const setRankingRewards = useMode2InvitePageTeamStore(
    (state) => state.setRankingRewards
  );

  const setEnableRankingReward = usePlatformDynamicConfigStore(
    (state) => state.setEnableRankingReward
  );

  const setRateInfo = useMode2InvitePageTeamStore((state) => state.setRateInfo);

  // useDeepEffect(() => {
  //   if (dayjs().valueOf() >= fetchInterval + lastFetchTime && isLogin) {
  //     postPromoteHome();
  //   }
  // }, [lastFetchTime, isLogin]);

  useEffect(() => {
    if (promoteHomeData) {
      setLastFetchTime(dayjs().valueOf());
      setEnableRankingReward(promoteHomeData.isEnableRankingReward);
      setRateInfo(promoteHomeData.rateInfo);
      const { teamMemberSummary, salaryRewardSummary, rankingRewardSummary } =
        promoteHomeData;
      const totalNumberOfInvitees = {
        bodyData: [
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_total_people' },
            bodyValue: teamMemberSummary.totalCount,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_level_1' },
            bodyValue: teamMemberSummary.totalLevel1Count,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_level_2' },
            bodyValue: teamMemberSummary.totalLevel2Count,
          },
        ],
      };

      const newNumberOfInvitees = {
        bodyData: [
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_today' },
            bodyValue: teamMemberSummary.todayCount,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_yesterday' },
            bodyValue: teamMemberSummary.yesterdayCount,
          },
        ],
      };

      const weeklySalaryReward = {
        bodyData: [
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_all' },
            bodyValue: salaryRewardSummary.totalReward,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_this_week' },
            bodyValue: salaryRewardSummary.thisWeekReward,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_last_week' },
            bodyValue: salaryRewardSummary.lastWeekReward,
          },
        ],
      };

      const rankingRewards = {
        bodyData: [
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_all' },
            bodyValue: rankingRewardSummary.totalReward,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_this_week' },
            bodyValue: rankingRewardSummary.thisWeekReward,
          },
          {
            bodyTitle: { i18nKey: 'earn_money_team_data_content_last_week' },
            bodyValue: rankingRewardSummary.lastWeekReward,
          },
        ],
      };

      setTotalNumberOfInvitees(totalNumberOfInvitees);
      setNewNumberOfInvitees(newNumberOfInvitees);
      setWeeklySalaryReward(weeklySalaryReward);
      setRankingRewards(rankingRewards);
    }
  }, [promoteHomeData]);

  // 不可以  deps[isLogin]， 會造成多次觸發， 直接拿 token 判斷
  const fetchNow = () => {
    // const token = sdkUtils.getStorage(AppLocalStorageKey.TOKEN);
    refreshPromoteHomeData();
    // if (!isEmpty(token)) {
    //   postPromoteHome();
    // }
  };

  return { fetchNow: fetchNow };
};
