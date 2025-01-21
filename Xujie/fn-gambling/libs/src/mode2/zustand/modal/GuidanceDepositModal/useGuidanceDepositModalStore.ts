import { create } from 'zustand';

export interface GuidanceDepositModalStoreTypes {
  isShowGuidanceDepositModal: boolean;
  setShowGuidanceDepositModal: (isShow: boolean) => void;
}

export const useGuidanceDepositModalStore =
  create<GuidanceDepositModalStoreTypes>((set) => ({
    isShowGuidanceDepositModal: false,
    setShowGuidanceDepositModal: (isShow) =>
      set(() => ({ isShowGuidanceDepositModal: isShow })),
  }));
