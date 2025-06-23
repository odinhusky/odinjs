import { create } from 'zustand';

export enum RechargeWheelWinType {
  MONEY = 'money',
  SPIN = 'spin',
}

export enum RechargeWheelSpinLevelType {
  SILVER = 'silver',
  GOLD = 'gold',
  DIAMOND = 'diamond',
  SUPREME = 'supreme',
}

export interface RechargeWheelWinFeedBackStoreTypes {
  isShowWinFeedBack: boolean;
  winType: RechargeWheelWinType;
  moneyValue: number;
  spinLevel: RechargeWheelSpinLevelType;
  winSpinNumber: number;

  setIsShowWinFeedBack: (isShowWinFeedBack: boolean) => void;
  openWinMoney: (moneyValue: number) => void;
  openWinSpin: (
    spinLevel: RechargeWheelSpinLevelType,
    winSpinNumber: number
  ) => void;
}

export const rechargeWheelWinFeedBackStore =
  create<RechargeWheelWinFeedBackStoreTypes>()((set) => ({
    isShowWinFeedBack: false,
    winType: RechargeWheelWinType.MONEY,
    moneyValue: 0,
    spinLevel: RechargeWheelSpinLevelType.SILVER,
    winSpinNumber: 0,

    setIsShowWinFeedBack: (isShowWinFeedBack) =>
      set(() => ({ isShowWinFeedBack })),

    openWinMoney: (moneyValue) =>
      set(() => ({
        isShowWinFeedBack: true,
        winType: RechargeWheelWinType.MONEY,
        moneyValue,
      })),

    openWinSpin: (spinLevel, winSpinNumber) =>
      set(() => ({
        isShowWinFeedBack: true,
        winType: RechargeWheelWinType.SPIN,
        spinLevel,
        winSpinNumber,
      })),
  }));

export default rechargeWheelWinFeedBackStore;
