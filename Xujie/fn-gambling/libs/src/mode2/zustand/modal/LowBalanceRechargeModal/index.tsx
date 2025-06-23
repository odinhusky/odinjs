import {
  PayBrokenInfoResult,
  PayBrokenOptionsResult,
} from '@libs/mode2/external/api/endpoint/wallet/PostPayBrokenConfigEndpoint';
import { create } from 'zustand';
import { PayChannelItem } from '../../page/WalletPage/walletPageRechargeContentStore';
import { RechargeCard } from '../../page/WalletPage/useWalletPageRechargeCardStore';

export interface LowBalanceRechargeModalParameter {}

export interface LowBalanceRechargeModalStoreTypes {
  isShowLowBalanceRechargeModal: boolean;
  setShowLowBalanceRechargeModal: (isShow: boolean) => void;
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
  rechargeUrl: string;
  setRechargeUrl: (url: string) => void;
  lowBalanceRechargeLimitedOffersEndTime: number;
  upLowBalanceRechargeLimitedOffersEndTime: (time: number) => void;
}

export const useLowBalanceRechargeModalStore =
  create<LowBalanceRechargeModalStoreTypes>((set) => ({
    isShowLowBalanceRechargeModal: false,
    setShowLowBalanceRechargeModal: (isShow) =>
      set(() => ({
        isShowLowBalanceRechargeModal: isShow,
      })),
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
    rechargeUrl: '',
    setRechargeUrl: (url) =>
      set(() => ({
        rechargeUrl: url,
      })),
    lowBalanceRechargeLimitedOffersEndTime: 0,
    upLowBalanceRechargeLimitedOffersEndTime: (time) =>
      set(() => ({
        lowBalanceRechargeLimitedOffersEndTime: time,
      })),
  }));

export default useLowBalanceRechargeModalStore;
