import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { create } from 'zustand';

export interface WalletPageSwitchContentTabsStoreTypes {
  curSwitchContentTabId: WalletPageTabType;
  setCurSwitchContentTabId: (id: WalletPageTabType) => void;
}

export const useWalletPageSwitchContentTabsStore =
  create<WalletPageSwitchContentTabsStoreTypes>((set) => ({
    curSwitchContentTabId: WalletPageTabType.DEPOSIT,
    setCurSwitchContentTabId: (id) => set(() => ({ curSwitchContentTabId: id })),
  }));
