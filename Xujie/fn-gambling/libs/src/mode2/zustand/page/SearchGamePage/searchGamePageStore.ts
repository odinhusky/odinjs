import { RefObject } from 'react';
import { create } from 'zustand';
import { FixedSizeGrid as Grid, GridOnScrollProps } from 'react-window';

export type SearchGamePageStoreTypes = {
  isShowSearchGamePageScrollTopBtn: boolean;
  setIsShowSearchGamePageScrollTopBtn: (isShow: boolean) => void;

  searchGamePageGridContainerRef: RefObject<Grid> | null;
  setSearchGamePageGridContainerRef: (ref: RefObject<Grid>) => void;
};

export const useSearchGamePageStore = create<SearchGamePageStoreTypes>()(
  (set) => ({
    isShowSearchGamePageScrollTopBtn: false,
    setIsShowSearchGamePageScrollTopBtn: (isShow) =>
      set(() => ({ isShowSearchGamePageScrollTopBtn: isShow })),

    searchGamePageGridContainerRef: null,
    setSearchGamePageGridContainerRef: (ref) =>
      set(() => ({
        searchGamePageGridContainerRef: ref,
      })),
  })
);

export default useSearchGamePageStore;
