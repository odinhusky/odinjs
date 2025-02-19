import { create } from 'zustand';
import { WithdrawOptItemResul } from '@mode2API/endpoint/wallet/PostWithdrawOptionsEndpoint';

// 當日剩餘可提現金額 (RemainingWithdrawLimit)
// VIP提現上限 (MaxWithdraw)
// 要求打碼 (RequireTurnover - Turnover)
// 提現次數 (WithdrawTimes)

export interface WithdrawOptItem extends WithdrawOptItemResul {
  isActive: boolean;
  disabled: boolean;
}

interface WithdrawLimit {
  remainingWithdrawLimit: number; //當日剩餘可提現金額 (RemainingWithdrawLimit)
  maxWithdraw: number; // VIP提現上限
  remainingBetToWithdraw: number; //要求打碼 (RequireTurnover - Turnover)
  withdrawTimes: number; // 提現次數
}

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
  withdrawLimit: WithdrawLimit;
  setWithdrawLimit: (value: WithdrawLimit) => void;

  withdrawOptions: WithdrawOptItem[];
  setWithdrawOptions: (value: WithdrawOptItem[]) => void;
}

const defaultRechargeResult = {
  withdrawVipLevel: 0,
  withdrawTotalBalance: 0,
  withdrawLockAssets: 0,
  dailyWithdrawLimit: 0,
  withdrawProgress: 0,
  withdrawLimit: {
    remainingWithdrawLimit: 0,
    maxWithdraw: 0,
    remainingBetToWithdraw: 0,
    withdrawTimes: 0,
  },
  withdrawOptions: [] as WithdrawOptItem[],
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
  setWithdrawLimit: (value) => set(() => ({ withdrawLimit: value })),
  setWithdrawOptions: (value) => set(() => ({ withdrawOptions: value })),
}));
