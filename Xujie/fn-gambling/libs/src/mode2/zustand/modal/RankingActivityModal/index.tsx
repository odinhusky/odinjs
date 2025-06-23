import { create } from 'zustand';
import { PromoteRankingJackpotResult } from '@mode2API/endpoint/promotepParameter/PostPromoteRankingJackpotEndpoint';

export interface RankingActivityModalParameter {}

export interface RankingActivityModalStoreTypes {
  isShowRankingActivityModal: boolean;
  setShowRankingActivityModal: (isShow: boolean) => void;

  appStartShownSeveralTimes: number;
  updateAppStartShownSeveralTimes: () => void;

  isNotShowToday: boolean;
  setIsNotShowToday: (bool: boolean) => void;

  // parameter: RankingActivityModalParameter;
  // setParameter: (parameter: RankingActivityModalParameter) => void;

  // countdownTime: number;
  // setCountDownTime: (value: number) => void;

  rankingRulesResult: PromoteRankingJackpotResult;
  setRankingRulesResult: (result: PromoteRankingJackpotResult) => void;
}

export const useRankingActivityModalStore =
  create<RankingActivityModalStoreTypes>((set, get) => ({
    isShowRankingActivityModal: false,
    setShowRankingActivityModal: (isShow) =>
      set(() => ({
        isShowRankingActivityModal: isShow,
      })),

    isNotShowToday: false,
    setIsNotShowToday: (bool) =>
      set(() => ({
        isNotShowToday: bool,
      })),

    appStartShownSeveralTimes: 0,
    updateAppStartShownSeveralTimes: () =>
      set(() => ({
        appStartShownSeveralTimes: get().appStartShownSeveralTimes + 1,
      })),

    // parameter: {},
    // setParameter: (parameter) => set(() => ({ parameter })),

    // countdownTime: 0,
    // setCountDownTime: (values) => set(() => ({ countdownTime: values })),

    rankingRulesResult: {
      jackpotAmount: 0,
      expiredAt: 0,
      rankingRates: [],
    },
    setRankingRulesResult: (result) =>
      set(() => ({ rankingRulesResult: result })),
  }));

export default useRankingActivityModalStore;
