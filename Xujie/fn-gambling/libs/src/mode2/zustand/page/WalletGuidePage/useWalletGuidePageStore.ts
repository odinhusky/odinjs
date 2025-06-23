import { create } from 'zustand';
import { WalletGuideTutorialsType } from '@mode2/@types/walletGuideTutorialsType';
import { RechargeTutorialStatusResult } from '@mode2API/endpoint/active/PostRechargeTutorialStatusEndpoint';

export interface WalletGuidePageStoreTypes {
  currentTutorialsTab: WalletGuideTutorialsType;
  setTutorialsTab: (tab: WalletGuideTutorialsType) => void;

  tutorialStatusResult: RechargeTutorialStatusResult;
  setTutorialStatusResult: (result: RechargeTutorialStatusResult) => void;

  refreshTutorialStatusCount: number;
  refreshTutorialStatus: () => void;
}

export const useWalletGuidePageStore = create<WalletGuidePageStoreTypes>(
  (set, get) => ({
    currentTutorialsTab: WalletGuideTutorialsType.VIDEO,
    setTutorialsTab: (tab) => set(() => ({ currentTutorialsTab: tab })),
    tutorialStatusResult: {
      isEnable: false,
    },
    setTutorialStatusResult: (result) =>
      set(() => ({ tutorialStatusResult: result })),
    refreshTutorialStatusCount: 0,
    refreshTutorialStatus: () =>
      set(() => ({
        refreshTutorialStatusCount: get().refreshTutorialStatusCount + 1,
      })),
  })
);
