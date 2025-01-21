import { create } from 'zustand';
import { devtoolsWrapper } from '../middlewareWrapper';
export type WebviewPageStoreTypes = {
  isShowRechargeContent: boolean;
  setIsShowRechargeContent: (value: boolean) => void;

};

export const useMode2WebviewPageStore = create<WebviewPageStoreTypes>()(
  devtoolsWrapper('[page store] useMode2WebviewPageStore', (set) => ({
    isShowRechargeContent: false,
    setIsShowRechargeContent: (value) =>
      set(() => ({ isShowRechargeContent: value })),
  }))
);
