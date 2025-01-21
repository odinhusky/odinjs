import { create } from 'zustand';
import { devtoolsWrapper } from "../middlewareWrapper";

export interface Mode2FirstChargeModalStoreTypes {
  isNotShowToday: boolean;
  setIsNotShowToday: (value: boolean) => void;
  isShowFirstChargeDiscountModal: boolean;
  setIsShowFirstChargeDiscountModal: (value: boolean) => void;
}

export const useMode2FirstChargeModalStore =
  create<Mode2FirstChargeModalStoreTypes>()(
    devtoolsWrapper('store [useMode2FirstChargeModalStore]', (set) => ({
      isNotShowToday: false,
      setIsNotShowToday: (value) => set(() => ({ isNotShowToday: value })),
      isShowFirstChargeDiscountModal: false,
      setIsShowFirstChargeDiscountModal: (value) => set(() => ({ isShowFirstChargeDiscountModal: value })),
    }))
  );