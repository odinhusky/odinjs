import { usePostRankingRulesMutation } from '@mode2API/index';
import { useEffect } from 'react';
import { useRankingPageStore } from '@mode2/zustand/page/RankingPage/rankingPageStore';
import { useEffectOnce } from '@libs/commonUtils';

export const useRankingPageRuleBase = () => {
  const [postRankingRules, { isSuccess, data }] = usePostRankingRulesMutation();

  const setRankingRulesResult = useRankingPageStore(
    (state) => state.setRankingRulesResult
  );

  useEffectOnce(() => {
    postRankingRules();
  });

  useEffect(() => {
    if (isSuccess && data) {
      setRankingRulesResult(data);
    }
  }, [isSuccess, data]);
};

export default useRankingPageRuleBase;
