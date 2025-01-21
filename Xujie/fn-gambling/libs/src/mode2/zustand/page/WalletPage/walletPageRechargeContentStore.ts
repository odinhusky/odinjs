import {
  PayChannelInfoResult,
  PayOptionsResult,
} from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';
import { create } from 'zustand';
import { isEmpty } from 'lodash';

// 支付通道，選項
export interface PayOptionItem extends PayOptionsResult {
  onAction: () => void;
}

// 支付通道
export interface PayChannelItem extends PayChannelInfoResult {
  onAction: () => void;
  optionActions: PayOptionItem[];
}

export interface WalletPageRechargeContentStoreTypes {
  rechargeLimitStr: [string, string]; // ['min limit', 'max limit']
  setRechargeLimitStr: (stringArr: [string, string]) => void;

  originalPayChannelActionItems: PayChannelInfoResult[];
  setOriginalPayChannelActionItems: (list: PayChannelInfoResult[]) => void;

  allPayChannelActionItems: PayChannelItem[];
  setAllPayChannelActionItems: (list: PayChannelItem[]) => void;
  currentPayChannel: PayChannelInfoResult;
  setCurrentPayChannel: (info: PayChannelInfoResult) => void;
  currentPayOptionItems: PayOptionItem[];
  setCurrentPayOptionItems: (list: PayOptionItem[]) => void;
  currentPayOption: PayOptionsResult;
  setCurrentPayOption: (info: PayOptionsResult) => void;
  setDefaultPayOption: (info: PayChannelInfoResult) => void;
  currentOptIndexKey: string;
  setCurrentOptIndexKey: (indexKey: string) => void;
  currentOptAmount: number;
  setCurrentOptAmount: (amount: number) => void;
  currentOptRebateAmount: number;
  setCurrentOptRebateAmount: (rebateAmount: number) => void;
  currentOptCashBackRate: number;
  setCurrentOptCashBackRate: (cashBackRate: number) => void;
  reset: () => void;
}

export const useWalletPageRechargeContentStore =
  create<WalletPageRechargeContentStoreTypes>((set) => ({
    rechargeLimitStr: ['', ''],
    setRechargeLimitStr: (stringArr) =>
      set(() => ({ rechargeLimitStr: stringArr })),
    originalPayChannelActionItems: [] as PayChannelInfoResult[],
    setOriginalPayChannelActionItems: (list) =>
      set(() => ({ originalPayChannelActionItems: list })),
    allPayChannelActionItems: [] as PayChannelItem[],
    setAllPayChannelActionItems: (list: PayChannelItem[]) =>
      set((state: WalletPageRechargeContentStoreTypes) => {
        const payChannelIndex = list.findIndex(
          (item) => item.isDefaultSelected
        );
        const info: PayChannelItem = list[payChannelIndex];
        if (info) {
          state.currentPayChannel = info;
          state.currentPayOptionItems = info.optionActions;
          state.setDefaultPayOption(info);
        }
        return { allPayChannelActionItems: list };
      }),
    currentPayChannel: {
      onAction: () => {},
      optionActions: [] as PayOptionItem[],
    } as PayChannelItem,
    setCurrentPayChannel: (info: PayChannelInfoResult) =>
      set((state: WalletPageRechargeContentStoreTypes) => {
        const current = state.allPayChannelActionItems.find(
          (item) => item.payName === info.payName
        );
        if (current) {
          state.currentPayOptionItems = current.optionActions;
        }
        state.setDefaultPayOption(info);
        return { currentPayChannel: info };
      }),
    currentPayOptionItems: [] as PayOptionItem[],
    setCurrentPayOptionItems: (list: PayOptionItem[]) =>
      set(() => ({ currentPayOptionItems: list })),
    currentPayOption: {
      id: 0,
      amount: 0,
      name: '',
      rebate: 0,
      rebateAmount: 0,
      isHot: false,
      cashBackRate: 0,
      indexKey: '',
      fromChannelName: '',
      isHighBonus: false,
    } as PayOptionsResult,
    setCurrentPayOption: (info: PayOptionsResult) =>
      set(() => ({ currentPayOption: info })),
    setDefaultPayOption: (info) =>
      set(() => {
        if (isEmpty(info.options)) {
          return {};
        }
        const recommendOptions = info.options.find((v) => v.recommended);
        const opt = recommendOptions || info.options[0] || null;
        if (opt) {
          return {
            currentPayOption: opt,
          };
        }
        return {};
      }),
    currentOptIndexKey: '',
    setCurrentOptIndexKey: (indexKey) =>
      set(() => ({ currentOptIndexKey: indexKey })),
    currentOptAmount: 0,
    setCurrentOptAmount: (amount) => set(() => ({ currentOptAmount: amount })),
    currentOptRebateAmount: 0,
    setCurrentOptRebateAmount: (rebateAmount) =>
      set(() => ({ currentOptRebateAmount: rebateAmount })),
    currentOptCashBackRate: 0,
    setCurrentOptCashBackRate: (cashBackRate) =>
      set(() => ({ currentOptCashBackRate: cashBackRate })),
    reset: () =>
      set((state) => {
        const resetPayChannel = state.allPayChannelActionItems.find(
          (item) => item.isDefaultSelected
        );
        const payOptionItems =
          resetPayChannel?.optionActions || state.currentPayOptionItems;
        const optionItem = payOptionItems.find((item) => item.recommended);
        const optionItemIndexKey =
          optionItem?.indexKey || state.currentOptIndexKey;
        return {
          currentPayChannel: resetPayChannel || state.currentPayChannel,
          currentPayOptionItems: payOptionItems,
          currentPayOption: optionItem || state.currentPayOption,
          currentOptIndexKey: optionItemIndexKey,
        };
      }),
  }));
