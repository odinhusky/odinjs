import { usePostRankingMyRewardsMutation } from '@mode2API/index';
import { useEffect } from 'react';
import { useEffectOnce } from '@libs/commonUtils';
import { useRankingPageStore } from '@mode2/zustand/page/RankingPage/rankingPageStore';

export const useRankingPageRewardsBase = () => {
  const [postRankingMyRewards, { isSuccess, data }] =
    usePostRankingMyRewardsMutation();

  const setRankingMyRewardResults = useRankingPageStore(
    (state) => state.setRankingMyRewardResults
  );

  useEffectOnce(() => {
    postRankingMyRewards();
  });

  useEffect(() => {
    if (isSuccess && data) {
      setRankingMyRewardResults(data.rewards);
    }
  }, [isSuccess, data]);
};

export default useRankingPageRewardsBase;
