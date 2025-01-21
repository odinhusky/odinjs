import { create } from 'zustand';

export interface WithdrawStoreTypes {
  withdrawVipLevel: number;
  setWithdrawVipLevel: (vipLevel: number) => void;
  withdrawTotalBalance: number;
  setWithdrawTotalBalance: (totalBalance: number) => void;
  withdrawLockAssets: number;
  setWithdrawLockAssets: (lockAssets: number) => void;
  dailyWithdrawLimit: number;
  setDailyWithdrawLimit: (limit: number) => void;
  withdrawProgress: number;
  setWithdrawProgress: (progress: number) => void;
}

const defaultRechargeResult = {
  withdrawVipLevel: 0,
  withdrawTotalBalance: 0,
  withdrawLockAssets: 0,
  dailyWithdrawLimit: 0,
  withdrawProgress: 0,
};

export const useWithdrawStore = create<WithdrawStoreTypes>((set) => ({
  ...defaultRechargeResult,
  setWithdrawVipLevel: (vipLevel) =>
    set(() => ({ withdrawVipLevel: vipLevel })),
  setWithdrawTotalBalance: (totalBalance) =>
    set(() => ({ withdrawTotalBalance: totalBalance })),
  setWithdrawLockAssets: (lockAssets) =>
    set(() => ({ withdrawLockAssets: lockAssets })),
  setDailyWithdrawLimit: (limit) => set(() => ({ dailyWithdrawLimit: limit })),
  setWithdrawProgress: (progress) =>
    set(() => ({ withdrawProgress: progress })),
}));
