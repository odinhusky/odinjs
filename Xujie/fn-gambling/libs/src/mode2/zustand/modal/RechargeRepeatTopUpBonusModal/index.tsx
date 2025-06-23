import { PayAdditionalResult } from '@libs/mode2/external/api/endpoint/recharge/PostPayAddOnConfigEndpoint';
import { create } from 'zustand';

export interface PayAddOnOption extends PayAdditionalResult {}

export interface RechargeRepeatTopUpBonusModalStoreTypes {
  isShowRechargeRepeatTopUpBonusModal: boolean;
  setIsShowRechargeRepeatTopUpBonusModal: (isShow: boolean) => void;
  payAddOnOptions: PayAddOnOption[];
  setPayAddOnOptions: (options: PayAddOnOption[]) => void;
  currentPayAddOnOption: PayAddOnOption | null;
  setCurrentPayAddOnOption: (option: PayAddOnOption) => void;
  closeClickCount: number;
  updateCloseClickCount: () => void;
}

export const useRechargeRepeatTopUpBonusModalStore =
  create<RechargeRepeatTopUpBonusModalStoreTypes>((set, get) => ({
    isShowRechargeRepeatTopUpBonusModal: false,
    setIsShowRechargeRepeatTopUpBonusModal: (isShow) =>
      set(() => ({
        isShowRechargeRepeatTopUpBonusModal: isShow,
      })),
    payAddOnOptions: [],
    setPayAddOnOptions: (options) =>
      set(() => ({
        payAddOnOptions: options,
      })),
    currentPayAddOnOption: null,
    setCurrentPayAddOnOption: (option) =>
      set(() => ({
        currentPayAddOnOption: option,
      })),
    closeClickCount: 0,
    updateCloseClickCount: () =>
      set(() => ({ closeClickCount: get().closeClickCount + 1 })),
  }));

export default useRechargeRepeatTopUpBonusModalStore;
