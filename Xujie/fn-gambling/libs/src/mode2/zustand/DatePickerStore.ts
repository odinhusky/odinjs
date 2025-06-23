import { create } from 'zustand';

export interface ShowDatePickerStoreTypes {
  isShowDatePicker: boolean;
  setDatePicker: (isShowDatePicker: boolean) => void;
}

export const useShowDatePickerStore = create<ShowDatePickerStoreTypes>()(
  (set) => ({
    isShowDatePicker: false,
    setDatePicker: (isShowDatePicker) =>
      set(() => ({ isShowDatePicker: isShowDatePicker })),
  })
);
