import { create } from 'zustand';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import { WithdrawOptItemResul } from '@mode2API/endpoint/wallet/PostWithdrawOptionsEndpoint';

// - Wallet Page Store

// - Wallet Switch Tab
export interface WalletPageSwitchTabUnit {
  id: WalletPageTabType;
  url: string;
  urlActive: string;
  label: I18NContent;
}

export interface WalletPageSwitchTabsStoreTypes {
  walletSwitchTabList: WalletPageSwitchTabUnit[];
  setWalletSwitchTabList: (list: WalletPageSwitchTabUnit[]) => void;
}

export const useWalletPageSwitchTabsStore =
  create<WalletPageSwitchTabsStoreTypes>((set) => ({
    walletSwitchTabList: [] as WalletPageSwitchTabUnit[],
    setWalletSwitchTabList: (list) =>
      set(() => ({ walletSwitchTabList: list })),
  }));

export interface WalletPageSwitchTabsActionsStoreTypes {
  walletSwitchTabListActions: (() => void)[];
  setWalletSwitchTabListAcions: (list: (() => void)[]) => void;
}

/** Action不做固化 */
export const useWalletPageSwitchTabsActionsStore =
  create<WalletPageSwitchTabsActionsStoreTypes>((set) => ({
    walletSwitchTabListActions: [] as (() => void)[],
    setWalletSwitchTabListAcions: (list) =>
      set(() => ({ walletSwitchTabListActions: list })),
  }));

// - Wallet Page Withdraw Content

export interface WalletPageWithdrawContentStoreTypes {
  withdrawAmountInputValue: string;
  setWithdrawAmountInputValue: (value: string) => void;
  withdrawPasswordInputValue: string;
  setWithdrawPasswordInputValue: (password: string) => void;
  withdrawLimitStr: [number, number];
  setWithdrawLimitValue: (limitArr: [number, number]) => void;
  disabled: boolean;
  setDisabled: (value: boolean) => void;

  withdrawAmountSelected: WithdrawOptItemResul;
  setWithdrawAmountSelected: (value: WithdrawOptItemResul) => void;
}

export const useWalletPageWithdrawContentStore =
  create<WalletPageWithdrawContentStoreTypes>()((set) => ({
    withdrawAmountInputValue: '',
    setWithdrawAmountInputValue: (value) =>
      set(() => ({ withdrawAmountInputValue: value })),
    withdrawPasswordInputValue: '',
    setWithdrawPasswordInputValue: (password) =>
      set(() => ({ withdrawPasswordInputValue: password })),
    withdrawLimitStr: [0, 0] as [number, number],
    setWithdrawLimitValue: (limitArr: [number, number]) =>
      set(() => ({ withdrawLimitStr: limitArr })),
    disabled: false,
    setDisabled: (value) => set({ disabled: value }),

    withdrawAmountSelected: {
      index: 0,
      amount: 0,
      fee: 0,
    },
    setWithdrawAmountSelected: (value) =>
      set(() => ({ withdrawAmountSelected: value })),
  }));
