import { create } from 'zustand';

export interface RebateRewardModalStoreTypes {
  isShowRebateRewardModal: boolean;
  setIsShowRebateRewardModal: (value: boolean) => void;
  currentCash: number;
  setCurrentCash: (value: number) => void;
  appStartShownSeveralTimes: number;
  updateAppStartShownSeveralTimes: () => void;
}

export const useRebateRewardModalStore = create<RebateRewardModalStoreTypes>()(
  (set, get) => ({
    isShowRebateRewardModal: false,
    setIsShowRebateRewardModal: (value) =>
      set(() => ({ isShowRebateRewardModal: value })),
    currentCash: 0,
    setCurrentCash: (value) => set(() => ({ currentCash: value })),
    appStartShownSeveralTimes: 0,
    updateAppStartShownSeveralTimes: () =>
      set(() => ({
        appStartShownSeveralTimes: get().appStartShownSeveralTimes + 1,
      })),
  })
);
