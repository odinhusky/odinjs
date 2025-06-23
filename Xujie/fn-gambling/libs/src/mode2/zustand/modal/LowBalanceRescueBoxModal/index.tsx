import { create } from 'zustand';
import { BrokenBoxInfoResult } from '@mode2API/endpoint/brokenBox/PostBrokenBoxInfoEndpoint';

export interface LowBalanceRescueBoxModalStoreTypes {
  isShowLowBalanceRescueBoxModal: boolean;
  setShowLowBalanceRescueBoxModal: (isShow: boolean) => void;
  lowBalanceRescueBoxLimitedOffersEndTime: number;
  upLowBalanceRescueBoxLimitedOffersEndTime: (time: number) => void;
  lowBalanceRewardInfo: BrokenBoxInfoResult;
  setLowBalanceRewardInfo: (info: BrokenBoxInfoResult) => void;
}

export const useLowBalanceRescueBoxModalStore =
  create<LowBalanceRescueBoxModalStoreTypes>((set) => ({
    isShowLowBalanceRescueBoxModal: false,
    setShowLowBalanceRescueBoxModal: (isShow) =>
      set(() => ({
        isShowLowBalanceRescueBoxModal: isShow,
      })),
    lowBalanceRescueBoxLimitedOffersEndTime: 0,
    upLowBalanceRescueBoxLimitedOffersEndTime: (time) =>
      set(() => ({
        lowBalanceRescueBoxLimitedOffersEndTime: time,
      })),
    lowBalanceRewardInfo: {
      offerId: 0,
      reward: 0,
    },
    setLowBalanceRewardInfo: (info) =>
      set(() => ({
        lowBalanceRewardInfo: info,
      })),
  }));

export default useLowBalanceRescueBoxModalStore;
