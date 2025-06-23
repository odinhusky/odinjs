import { create } from 'zustand';
import { PromoteSurpriseRewardResult } from '@mode2API/endpoint/promotepParameter/PostPromoteSurpriseRewardEndpoint';

export interface SurpriseRewardModalStoreTypes {
  isShowSurpriseRewardModal: boolean;
  setShowSurpriseRewardModal: (isShow: boolean) => void;
  appStartShownSeveralTimes: number;
  updateAppStartShownSeveralTimes: () => void;

  parameter: PromoteSurpriseRewardResult;
  setParameter: (value: PromoteSurpriseRewardResult) => void;
}

export const useSurpriseRewardModalStore =
  create<SurpriseRewardModalStoreTypes>((set, get) => ({
    isShowSurpriseRewardModal: false,
    setShowSurpriseRewardModal: (isShow) =>
      set(() => ({
        isShowSurpriseRewardModal: isShow,
      })),

    appStartShownSeveralTimes: 0,
    updateAppStartShownSeveralTimes: () =>
      set(() => ({
        appStartShownSeveralTimes: get().appStartShownSeveralTimes + 1,
      })),

    parameter: {
      reward: 0,
      startTime: 0,
      endTime: 0,
    },
    setParameter: (value) => set(() => ({ parameter: value })),
  }));

export default useSurpriseRewardModalStore;
