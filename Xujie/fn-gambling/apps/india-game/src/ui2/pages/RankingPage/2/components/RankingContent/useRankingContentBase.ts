import { useDeepEffect } from '@libs/commonUtils';
import { usePostRankingOngoingMutation } from '@libs/mode2/external/api';
import { RankingOngoingType } from '@libs/mode2/external/api/endpoint/ranking/PostRankingOngoingEndpoint';
import {
  RankingPeriodsTabs,
  useRankingPageStore,
} from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import { useEffect } from 'react';

export const useRankingContentBase = () => {
  const rankingSummaryPeriodsActiveTab = useRankingPageStore(
    (state) => state.rankingSummaryPeriodsActiveTab
  );
  const setRankingSummaryPeriodsActiveTab = useRankingPageStore(
    (state) => state.setRankingSummaryPeriodsActiveTab
  );

  const setCurrentDisplayPeriodsActiveTab = useRankingPageStore(
    (state) => state.setCurrentDisplayPeriodsActiveTab
  );

  const setIsRankingSummaryLoading = useRankingPageStore(
    (state) => state.setIsRankingSummaryLoading
  );

  const setDailyJackpotFromAmount = useRankingPageStore(
    (state) => state.setDailyJackpotFromAmount
  );

  const setDailyJackpotToAmount = useRankingPageStore(
    (state) => state.setDailyJackpotToAmount
  );

  const setMainContentJackpotAmount = useRankingPageStore(
    (state) => state.setMainContentJackpotAmount
  );

  const setMainContentJackpotAmountFrom = useRankingPageStore(
    (state) => state.setMainContentJackpotAmountFrom
  );

  const setMainContentJackpotRate = useRankingPageStore(
    (state) => state.setMainContentJackpotRate
  );

  const setMainContentRankingData = useRankingPageStore(
    (state) => state.setMainContentRankingData
  );

  const setMainContentMyRanking = useRankingPageStore(
    (state) => state.setMainContentMyRanking
  );

  const setIsRankingOngoingSuccess = useRankingPageStore(
    (state) => state.setIsRankingOngoingSuccess
  );

  const resetMainContentData = useRankingPageStore(
    (state) => state.resetMainContentData
  );

  const [postRankingOngoing, { isSuccess, data, isError, isLoading, error }] =
    usePostRankingOngoingMutation();

  useEffect(() => {
    setIsRankingOngoingSuccess(isSuccess);
  }, [isSuccess]);

  useEffect(() => {
    if (isLoading) {
      resetMainContentData();
    }
    setIsRankingSummaryLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // console.log(
    //   '!! 🚀 rankingSummaryPeriodsActiveTab changed:',
    //   rankingSummaryPeriodsActiveTab
    // );
    let type = RankingOngoingType.D;

    switch (rankingSummaryPeriodsActiveTab) {
      case RankingPeriodsTabs.DAILY:
        type = RankingOngoingType.D;
        break;
      case RankingPeriodsTabs.WEEKLY:
        type = RankingOngoingType.W;
        break;
      case RankingPeriodsTabs.MONTHLY:
        type = RankingOngoingType.M;
        break;
    }
    // setIsRankingSummaryLoading(true);
    postRankingOngoing({ ongoingType: type });

    // 切換 tab 時，重置排行榜資料
    // resetMainContentData();
  }, [rankingSummaryPeriodsActiveTab]);

  useDeepEffect(() => {
    // console.log('!! ✅ API success, updating state:', data);

    if (isSuccess && data) {
      // 紀錄 Daily 的值
      // resetMainContentData();
      if (rankingSummaryPeriodsActiveTab === RankingPeriodsTabs.DAILY) {
        setDailyJackpotToAmount(data.jackpotAmount);
        setDailyJackpotFromAmount(data.jackpotAmountFrom);
      }

      setMainContentJackpotAmount(data.jackpotAmount);
      setMainContentJackpotAmountFrom(data.jackpotAmountFrom);

      setMainContentJackpotRate(data.jackpotRate);
      setMainContentRankingData({
        rankingTop1: data.rankingTop1,
        rankingTop2: data.rankingTop2,
        rankingTop3: data.rankingTop3,
        otherRankings: [...data.otherRankings],
      });
      setMainContentMyRanking({ ...data.myRanking });
      // setIsRankingSummaryLoading(false);

      let type = RankingPeriodsTabs.DAILY;
      switch (data.currentOngoingType) {
        case RankingOngoingType.D:
          type = RankingPeriodsTabs.DAILY;
          break;
        case RankingOngoingType.W:
          type = RankingPeriodsTabs.WEEKLY;
          break;
        case RankingOngoingType.M:
          type = RankingPeriodsTabs.MONTHLY;
          break;
      }
      setCurrentDisplayPeriodsActiveTab(type);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    // console.log('!! ❌ API error occurred:', error);

    if (isError) {
      resetMainContentData();
      // setIsRankingSummaryLoading(false);
    }
  }, [isError, error]);

  useEffect(() => {
    return () => {
      resetMainContentData();
      setRankingSummaryPeriodsActiveTab(RankingPeriodsTabs.DAILY);
      setCurrentDisplayPeriodsActiveTab(RankingPeriodsTabs.DAILY);
      setIsRankingSummaryLoading(false);
    };
  }, []);
};

export default useRankingContentBase;
