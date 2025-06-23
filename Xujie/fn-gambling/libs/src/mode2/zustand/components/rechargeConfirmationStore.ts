import { create } from 'zustand';

export interface RebateRewardModalStoreTypes {
  isShowRechargeConfirmationModal: boolean;
  setIsShowRechargeConfirmationModal: (value: boolean) => void;
}

export const useRechargeConfirmationModalStore =
  create<RebateRewardModalStoreTypes>()((set) => ({
    isShowRechargeConfirmationModal: false,
    setIsShowRechargeConfirmationModal: (value) =>
      set(() => ({ isShowRechargeConfirmationModal: value })),
  }));
