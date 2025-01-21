import { create } from 'zustand';

export enum RechargeCard {
  GENERAL = 'GENERAL',
  TOP_UP_BONUS = 'TOP_UP_BONUS',
  HIGH_BONUS = 'HIGH_BONUS',
}

export interface WalletPageRechargeCardUnit {
  card: RechargeCard;
  url: string;
  text: string;
  onAction: () => void;
}

// useWalletPageCardStore
export interface WalletPageRechargeCardStoreTypes {
  currentRechargeCard: RechargeCard;
  setCurrentRechargeCard: (card: RechargeCard) => void;
  rechargeCardList: WalletPageRechargeCardUnit[];
  setRechargeCardList: (list: WalletPageRechargeCardUnit[]) => void;
}

export const useWalletPageRechargeCardStore =
  create<WalletPageRechargeCardStoreTypes>((set) => ({
    currentRechargeCard: RechargeCard.GENERAL,
    setCurrentRechargeCard: (card) =>
      set(() => ({ currentRechargeCard: card })),
    rechargeCardList: [] as WalletPageRechargeCardUnit[],
    setRechargeCardList: (list) => set(() => ({ rechargeCardList: list })),
  }));

// Wallet Recharge HighBonus

export interface WalletRechargeHighBonusStoreTypes {
  isSupportHighBonus: boolean;
  setSupportHighBonus: (isSupport: boolean) => void;
  highBonusRemainTime: number;
  setHighBonusRemainTime: (remainTime: number) => void;
  highBonusCoolDownTime: number;
  setHighBonusCoolDownTime: (coolDownTime: number) => void;
}

export const useWalletRechargeHighBonusStore =
  create<WalletRechargeHighBonusStoreTypes>((set) => ({
    isSupportHighBonus: false,
    setSupportHighBonus: (isSupport) =>
      set(() => ({ isSupportHighBonus: isSupport })),
    highBonusRemainTime: 0,
    setHighBonusRemainTime: (remainTime) =>
      set(() => ({ highBonusRemainTime: remainTime })),
    highBonusCoolDownTime: 0,
    setHighBonusCoolDownTime: (coolDownTime) =>
      set(() => ({ highBonusCoolDownTime: coolDownTime })),
  }));
