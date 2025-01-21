import { RefObject } from 'react';
import { create } from 'zustand';
import { GameListItemResult } from './hallPageStore';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';

export interface ModifyPageFormData {
  phone: string;
  username: string;
  password: string;
}

export interface usMoreGamePageStoreTypes {
  page: number;
  setPage: (page: number) => void;
  moreGameList: GameListItemResult[];
  setMoreGameList: (
    values:
      | GameListItemResult[]
      | ((prevData: GameListItemResult[]) => GameListItemResult[])
  ) => void;
  allLoaded: boolean;
  setAllLoaded: (bool: boolean) => void;
  manufacturer: string;
  setManufacturer: (manufacturer: string) => void;
  manufacturerLogoUrl: string;
  setManufacturerLogoUrl: (logo: string) => void;
}

export const useMoreGamePageStoreStore = create<usMoreGamePageStoreTypes>()(
  devtoolsAndPersistWrapper(
    '[page store] useMoreGamePageStoreStore',
    (set) => ({
      page: 1,
      setPage: (page) => set(() => ({ page })),
      moreGameList: [] as GameListItemResult[],
      setMoreGameList: (values) =>
        set((state: usMoreGamePageStoreTypes) => ({
          moreGameList:
            values instanceof Function ? values(state.moreGameList) : values,
        })),
      allLoaded: false,
      setAllLoaded: (bool) => set(() => ({ allLoaded: bool })),
      manufacturer: '',
      setManufacturer: (manufacturer) => set(() => ({ manufacturer })),
      manufacturerLogoUrl: '',
      setManufacturerLogoUrl: (logo) =>
        set(() => ({ manufacturerLogoUrl: logo })),
    })
  )
);

export interface usMoreGamePageRefsTypes {
  moreGamePageContainerRef: RefObject<HTMLDivElement> | null;
  setMoreGamePageContainerRef: (ref: RefObject<HTMLDivElement>) => void;
}

export const useMoreGamePageRefsStore = create<usMoreGamePageRefsTypes>(
  (set) => ({
    moreGamePageContainerRef: null,
    setMoreGamePageContainerRef: (ref) =>
      set(() => ({
        moreGamePageContainerRef: ref,
      })),
  })
);
