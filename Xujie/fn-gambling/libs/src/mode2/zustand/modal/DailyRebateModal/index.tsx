import { create } from 'zustand';
import { PostPromoteVipRebateResult } from '@mode2API/endpoint/promotepParameter/PostPromoteVipRebateEndpoint';

//{"betTime":1741026973 , "bets":678124 , "reward": 275.81}

export interface DailyRebateModalStoreTypes {
  isShowDailyRebateModal: boolean;
  setShowDailyRebateModal: (isShow: boolean) => void;

  appStartShownSeveralTimes: number;
  updateAppStartShownSeveralTimes: () => void;

  parameter: PostPromoteVipRebateResult;
  setParameter: (value: PostPromoteVipRebateResult) => void;
}

export const useDailyRebateModalStore = create<DailyRebateModalStoreTypes>(
  (set, get) => ({
    isShowDailyRebateModal: false,
    setShowDailyRebateModal: (isShow) =>
      set(() => ({
        isShowDailyRebateModal: isShow,
      })),

    appStartShownSeveralTimes: 0,
    updateAppStartShownSeveralTimes: () =>
      set(() => ({
        appStartShownSeveralTimes: get().appStartShownSeveralTimes + 1,
      })),

    parameter: {
      betTime: 0,
      bets: 0,
      rebate: 0,
    },
    setParameter: (value) => set(() => ({ parameter: value })),
  })
);

export default useDailyRebateModalStore;
