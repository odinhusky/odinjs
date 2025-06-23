import { create } from 'zustand';
import { PromoteFirstChargeResult } from '@mode2API/endpoint/promotepParameter/PostPromoteFirstChargeEndpoint';

export interface Mode2FirstChargeModalStoreTypes {
  isNotShowToday: boolean;
  setIsNotShowToday: (value: boolean) => void;
  isShowFirstChargeDiscountModal: boolean;
  setIsShowFirstChargeDiscountModal: (value: boolean) => void;

  appStartShownSeveralTimes: number;
  updateAppStartShownSeveralTimes: () => void;

  parameters: PromoteFirstChargeResult;
  setParameters: (values: PromoteFirstChargeResult) => void;

  countdownTime: number;
  setCountDownTime: (value: number) => void;
}

export const useMode2FirstChargeModalStore =
  create<Mode2FirstChargeModalStoreTypes>()((set, get) => ({
    isNotShowToday: false,
    setIsNotShowToday: (value) => set(() => ({ isNotShowToday: value })),
    isShowFirstChargeDiscountModal: false,
    setIsShowFirstChargeDiscountModal: (value) =>
      set(() => ({ isShowFirstChargeDiscountModal: value })),

    parameters: {
      maxRebate: 0,
      items: [],
    },
    setParameters: (values) => set(() => ({ parameters: values })),
    countdownTime: 0,
    setCountDownTime: (values) => set(() => ({ countdownTime: values })),

    appStartShownSeveralTimes: 0,
    updateAppStartShownSeveralTimes: () =>
      set(() => ({
        appStartShownSeveralTimes: get().appStartShownSeveralTimes + 1,
      })),
  }));
