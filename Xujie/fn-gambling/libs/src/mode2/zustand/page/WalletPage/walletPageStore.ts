import { create } from 'zustand';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';

export interface WalletPageStoreStoreTypes {
  displayDashboardType: WalletDashboardType;
  setDisplayDashboardType: (value: WalletDashboardType) => void;

  // 提領狀態
  withdrawalsState: boolean;
  setWithdrawalsState: (state: boolean) => void;
}

// Evan for [V6] WalletPage 引導看板優先
export const useWalletPageStore = create<WalletPageStoreStoreTypes>((set) => ({
  displayDashboardType: WalletDashboardType.BALANCE,
  // displayDashboardType: WalletDashboardType.BALANCE,
  setDisplayDashboardType: (value) =>
    set(() => ({ displayDashboardType: value })),
  withdrawalsState: false,
  setWithdrawalsState: (value) => set(() => ({ withdrawalsState: value })),
}));
