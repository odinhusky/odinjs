import { create } from 'zustand';
import { devtoolsWrapper } from '../middlewareWrapper';

export interface RebateRewardModalStoreTypes {
  isShowRechargeConfirmationModal: boolean;
  setIsShowRechargeConfirmationModal: (value: boolean) => void;
}

export const useRechargeConfirmationModalStore =
  create<RebateRewardModalStoreTypes>()(
    devtoolsWrapper(
      '[component store] useRechargeConfirmationModalStore',
      (set) => ({
        isShowRechargeConfirmationModal: false,
        setIsShowRechargeConfirmationModal: (value) =>
          set(() => ({ isShowRechargeConfirmationModal: value })),
      })
    )
  );
