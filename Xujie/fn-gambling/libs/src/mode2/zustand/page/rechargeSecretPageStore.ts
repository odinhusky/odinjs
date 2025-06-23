import {
  PayBrokenInfoResult,
  PayBrokenOptionsResult,
} from '@libs/mode2/external/api/endpoint/wallet/PostPayBrokenConfigEndpoint';
import { create } from 'zustand';
import { RechargeCard } from './WalletPage/useWalletPageRechargeCardStore';
import { PayChannelItem } from './WalletPage/walletPageRechargeContentStore';

export interface RechargeSecretPageParameter {}

export interface RechargeSecretPageStoreTypes {
  currentRecharge: PayBrokenOptionsResult;
  setCurrentRecharge: (recharge: PayBrokenOptionsResult) => void;
  currentRechargeCard: RechargeCard;
  setCurrentRechargeCard: (card: RechargeCard) => void;
  rechargeOptions: PayBrokenOptionsResult[];
  setRechargeOptions: (options: PayBrokenOptionsResult[]) => void; // 充值金額選項
  currentPayChannel: PayBrokenInfoResult;
  setCurrentPayChannel: (channel: PayBrokenInfoResult) => void;
  channelOptions: PayBrokenInfoResult[];
  setChannelOptions: (options: PayBrokenInfoResult[]) => void; // 充值方式
  rechargeSecretLimitedOffersEndTime: number;
  upRechargeSecretLimitedOffersEndTime: (time: number) => void;
  isShowRechargeContent: boolean;
  setShowRechargeContent: (isShow: boolean) => void;
}

export const useRechargeSecretPageStore = create<RechargeSecretPageStoreTypes>(
  (set) => ({
    currentRecharge: {} as PayBrokenOptionsResult,
    setCurrentRecharge: (recharge) =>
      set(() => ({
        currentRecharge: recharge,
      })),
    currentRechargeCard: RechargeCard.GENERAL,
    setCurrentRechargeCard: (card) =>
      set(() => ({
        currentRechargeCard: card,
      })),
    rechargeOptions: [],
    setRechargeOptions: (options) =>
      set(() => ({
        rechargeOptions: options,
      })),
    currentPayChannel: {} as PayChannelItem,
    setCurrentPayChannel: (channel) =>
      set(() => ({
        currentPayChannel: channel,
      })),
    channelOptions: [],
    setChannelOptions: (options) =>
      set(() => ({
        channelOptions: options,
      })),
    rechargeSecretLimitedOffersEndTime: 0,
    upRechargeSecretLimitedOffersEndTime: (time) =>
      set(() => ({
        rechargeSecretLimitedOffersEndTime: time,
      })),
    isShowRechargeContent: false,
    setShowRechargeContent: (isShow: boolean) =>
      set(() => ({
        isShowRechargeContent: isShow,
      })),
  })
);

export default useRechargeSecretPageStore;
