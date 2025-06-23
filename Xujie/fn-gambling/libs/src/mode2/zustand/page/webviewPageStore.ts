import { create } from 'zustand';

export type WebviewPageStoreTypes = {
  isShowRechargeContent: boolean;
  setIsShowRechargeContent: (value: boolean) => void;
  gameName: string;
  setGameName: (state: string) => void;

  isWebViewPageHeaderShow: boolean;
  setWebViewPageHeaderShow: (state: boolean) => void;
  switchWebViewPageHeaderShow: () => void;
};

export const useMode2WebviewPageStore = create<WebviewPageStoreTypes>()(
  (set, get) => ({
    isShowRechargeContent: false,
    setIsShowRechargeContent: (value) =>
      set(() => ({ isShowRechargeContent: value })),
    gameName: '',
    setGameName: (state) => set(() => ({ gameName: state })),

    isWebViewPageHeaderShow: true,
    setWebViewPageHeaderShow: (value) =>
      set(() => ({ isWebViewPageHeaderShow: value })),
    switchWebViewPageHeaderShow: () =>
      set(() => ({ isWebViewPageHeaderShow: !get().isWebViewPageHeaderShow })),
  })
);
