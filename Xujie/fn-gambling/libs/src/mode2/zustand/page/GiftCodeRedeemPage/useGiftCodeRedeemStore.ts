import { create } from 'zustand';

interface IRedeemDescList {
  i18nKey: string;
}

export enum GiftCodeRedeemScenarios {
  PAGE = 'PAGE',
  MODAL = 'MODAL',
  UNKNOWN = 'UNKNOWN',
}

export interface GiftCodeRedeemStoreTypes {
  redeemGiftCodeSubmitObj: {
    scenarios: GiftCodeRedeemScenarios;
    count: number;
    giftCode: string;
  };
  setRedeemGiftCodeSubmit: (
    scenarios: GiftCodeRedeemScenarios,
    giftCode: string
  ) => void;
  resetSubmitObj: (
    scenarios: GiftCodeRedeemScenarios,
    resetInput: boolean
  ) => void;
  isGiftRedeemFinish: boolean;
  setGiftRedeemFinish: (isFinish: boolean) => void;
  giftCode: string;
  setGiftCode: (giftCode: string) => void;
  showRedeemGiftCodeModal: boolean;
  setShowRedeemGiftCodeModal: (isFinish: boolean) => void;
  showMaxLimitModal: boolean;
  setShowMaxLimitModal: (value: boolean) => void;
  redeemDescList: IRedeemDescList[];
  setRedeemDescList: (value: IRedeemDescList[]) => void;
}

export const useGiftCodeRedeemStore = create<GiftCodeRedeemStoreTypes>(
  (set, get) => ({
    redeemGiftCodeSubmitObj: {
      scenarios: GiftCodeRedeemScenarios.UNKNOWN,
      count: 0,
      giftCode: '',
    },
    setRedeemGiftCodeSubmit: (
      scenarios: GiftCodeRedeemScenarios,
      giftCode: string
    ) =>
      set(() => ({
        redeemGiftCodeSubmitObj: {
          scenarios: scenarios,
          count: get().redeemGiftCodeSubmitObj.count + 1,
          giftCode: giftCode,
        },
      })),
    resetSubmitObj: (scenarios: GiftCodeRedeemScenarios, resetInput: boolean) =>
      set(() => ({
        redeemGiftCodeSubmitObj: {
          scenarios: scenarios,
          count: 0,
          giftCode: '',
        },
        isGiftRedeemFinish: true,
        giftCode: resetInput ? '' : get().giftCode,
      })),
    isGiftRedeemFinish: true,
    setGiftRedeemFinish: (isFinish: boolean) =>
      set(() => ({ isGiftRedeemFinish: isFinish })),
    giftCode: '',
    setGiftCode: (value: string) => set(() => ({ giftCode: value })),
    showRedeemGiftCodeModal: false,
    setShowRedeemGiftCodeModal: (value: boolean) =>
      set(() => ({ showRedeemGiftCodeModal: value })),
    showMaxLimitModal: false,
    setShowMaxLimitModal: (value: boolean) =>
      set(() => ({ showMaxLimitModal: value })),
    redeemDescList: [],
    setRedeemDescList: (value: IRedeemDescList[]) =>
      set(() => ({ redeemDescList: value })),
  })
);
