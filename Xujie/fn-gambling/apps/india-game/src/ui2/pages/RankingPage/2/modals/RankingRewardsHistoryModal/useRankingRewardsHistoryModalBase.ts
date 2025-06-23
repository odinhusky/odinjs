import { useRankingRewardsHistoryModalStore } from '@mode2/zustand/page/RankingPage/rankingRewardsHistoryModalStore';
import { usePostRankingHistoryMutation } from '@mode2API/index';
import { useEffect } from 'react';

export const useRankingRewardsHistoryModalBase = () => {
  const rewardsHistoryTab = useRankingRewardsHistoryModalStore(
    (state) => state.rewardsHistoryTab
  );
  const setJackpotAmount = useRankingRewardsHistoryModalStore(
    (state) => state.setJackpotAmount
  );
  const setRankingRewards = useRankingRewardsHistoryModalStore(
    (state) => state.setRankingRewards
  );
  const resetData = useRankingRewardsHistoryModalStore(
    (state) => state.resetData
  );

  const [postRankingHistory, { isSuccess, data, isError }] =
    usePostRankingHistoryMutation();

  useEffect(() => {
    postRankingHistory({ historyType: rewardsHistoryTab });
  }, [rewardsHistoryTab]);

  useEffect(() => {
    if (isError) {
      resetData();
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess && data) {
      setJackpotAmount(data.jackpotAmount);
      setRankingRewards(data.rankings);
    }
  }, [isSuccess, data]);
};

export default useRankingRewardsHistoryModalBase;
