import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from './middlewareWrapper';

export interface ShowDatePickerStoreTypes {
  isShowDatePicker: boolean;
  setDatePicker: (isShowDatePicker: boolean) => void;
}

export const useShowDatePickerStore = create<ShowDatePickerStoreTypes>()(
  devtoolsAndPersistWrapper(
    '[DatePicker store] useShowDatePickerStore',
    (set) => ({
      isShowDatePicker: false,
      setDatePicker: (isShowDatePicker) =>
        set(() => ({ isShowDatePicker: isShowDatePicker })),
    })
  )
);
