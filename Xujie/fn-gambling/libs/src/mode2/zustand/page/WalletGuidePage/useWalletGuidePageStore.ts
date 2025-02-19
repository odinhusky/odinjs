import { create } from 'zustand';
import { WalletGuideTutorialsType } from '@mode2/@types/walletGuideTutorialsType';

export interface WalletGuidePageStoreTypes {
  currentTutorialsTab: WalletGuideTutorialsType;
  setTutorialsTab: (tab: WalletGuideTutorialsType) => void;
}

export const useWalletGuidePageStore = create<WalletGuidePageStoreTypes>(
  (set) => ({
    currentTutorialsTab: WalletGuideTutorialsType.VIDEO,
    setTutorialsTab: (tab) => set(() => ({ currentTutorialsTab: tab })),
  })
);
