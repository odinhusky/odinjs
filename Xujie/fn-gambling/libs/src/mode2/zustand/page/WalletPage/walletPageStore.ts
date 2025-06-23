import { create } from 'zustand';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';

export interface WalletWeakTipsState {
  isShow: boolean;
  isShowClose: boolean;
  title: string;
  content: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  onCloseCallback?: VoidFunction;
  onSecondaryCallback?: VoidFunction;
  onPrimaryCallback?: VoidFunction;
}

const resetWalletWeakTipsState: WalletWeakTipsState = {
  isShow: false,
  isShowClose: false,
  title: '',
  content: '',
  primaryBtnText: '',
  secondaryBtnText: '',
  onCloseCallback: undefined,
  onSecondaryCallback: undefined,
  onPrimaryCallback: undefined,
};

export interface WithdrawBottomTipsState {
  isShow: boolean;
  messages: string[];
  dismissCallback?: () => void;
}

const resetBottomTips: WithdrawBottomTipsState = {
  isShow: false,
  messages: [],
};

export interface WalletPageStoreStoreTypes {
  displayDashboardType: WalletDashboardType;
  setDisplayDashboardType: (value: WalletDashboardType) => void;

  // 提領狀態
  withdrawalsState: boolean;
  setWithdrawalsState: (state: boolean) => void;

  walletWeakTipsState: WalletWeakTipsState;
  setWalletWeakTipsState: (state: WalletWeakTipsState) => void;
  resetWalletWeakTipsState: () => void;

  withdrawBottomTipsState: WithdrawBottomTipsState;
  setWithdrawBottomTipsState: (state: WithdrawBottomTipsState) => void;
  resetWalletBottomTipsState: () => void;

  isShowBankAccountModal: boolean;
  setShowBankAccountModal: (state: boolean) => void;
}

// Evan for [V6] WalletPage 引導看板優先
export const useWalletPageStore = create<WalletPageStoreStoreTypes>((set) => ({
  displayDashboardType: WalletDashboardType.BALANCE,
  // displayDashboardType: WalletDashboardType.BALANCE,
  setDisplayDashboardType: (value) =>
    set(() => ({ displayDashboardType: value })),
  withdrawalsState: false,
  setWithdrawalsState: (value) => set(() => ({ withdrawalsState: value })),

  walletWeakTipsState: resetWalletWeakTipsState,
  setWalletWeakTipsState: (state) =>
    set(() => ({ walletWeakTipsState: state })),
  resetWalletWeakTipsState: () =>
    set(() => ({ walletWeakTipsState: resetWalletWeakTipsState })),

  withdrawBottomTipsState: resetBottomTips,
  setWithdrawBottomTipsState: (state) =>
    set(() => ({ withdrawBottomTipsState: state })),
  resetWalletBottomTipsState: () =>
    set(() => ({ withdrawBottomTipsState: resetBottomTips })),

  isShowBankAccountModal: false,
  setShowBankAccountModal: (state) =>
    set(() => ({ isShowBankAccountModal: state })),
}));
