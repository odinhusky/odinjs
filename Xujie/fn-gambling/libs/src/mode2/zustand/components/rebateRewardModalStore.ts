import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';

export interface RebateRewardModalStoreTypes {
  isShowRebateRewardModal: boolean;
  setIsShowRebateRewardModal: (value: boolean) => void;
  currentCash: number;
  setCurrentCash: (value: number) => void;
}

export const useRebateRewardModalStore = create<RebateRewardModalStoreTypes>()(
  devtoolsAndPersistWrapper(
    '[component store] useRebateRewardModalStore',
    (set) => ({
      isShowRebateRewardModal: false,
      setIsShowRebateRewardModal: (value) =>
        set(() => ({ isShowRebateRewardModal: value })),
      currentCash: 0,
      setCurrentCash: (value) => set(() => ({ currentCash: value })),
    })
  )
);
