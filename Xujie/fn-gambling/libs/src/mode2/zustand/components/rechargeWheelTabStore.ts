import { create } from 'zustand';

export type RechargeWheelType = 'silver' | 'gold' | 'diamond' | 'supreme';

interface RechargeWheelTabStoreTypes {
  activeRechargeActiveTab: RechargeWheelType; // tabType
  setActiveRechargeActiveTab: (type: RechargeWheelType) => void;
}

export const useRechargeWheelTabStore = create<RechargeWheelTabStoreTypes>(
  (set) => ({
    activeRechargeActiveTab: 'silver',
    setActiveRechargeActiveTab: (type: RechargeWheelType) =>
      set({ activeRechargeActiveTab: type }),
  })
);
