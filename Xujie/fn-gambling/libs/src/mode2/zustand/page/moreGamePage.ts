import { RefObject } from 'react';
import { create } from 'zustand';
import { GameListItemResult } from './hallPageStore';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';
import { cloneDeep } from 'lodash';
import { MoreGamePageTabType } from '@libs/mode2/@types/moreGamePageTabType';

export interface ModifyPageFormData {
  phone: string;
  username: string;
  password: string;
}

export interface usMoreGamePageStoreTypes {
  activeHorizonTab: MoreGamePageTabType;
  setActiveHorizonTab: (tabName: MoreGamePageTabType) => void;
  page: number;
  setPage: (page: number) => void;
  moreGameList: GameListItemResult[];
  setMoreGameList: (
    values:
      | GameListItemResult[]
      | ((prevData: GameListItemResult[]) => GameListItemResult[])
  ) => void;
  recentGameList: GameListItemResult[];
  setRecentGameList: (
    values:
      | GameListItemResult[]
      | ((prevData: GameListItemResult[]) => GameListItemResult[])
  ) => void;
  addRecentGameList: (item: GameListItemResult) => void;
  allLoaded: boolean;
  setAllLoaded: (bool: boolean) => void;

  // navigate 進到 morePage 時，從 param 帶進來的遊戲廠商資訊
  // 但之後如果 morePage 裡面切換 tab 的話， id | manufacturer | manufacturerLogoUrl | type 都會跟著更新
  activePlatformId: number;
  setActivePlatformId: (id: number) => void;
  activeManufacturer: string;
  setActiveManufacturer: (manufacturer: string) => void;
  activeManufacturerLogoUrl: string;
  setActiveManufacturerLogoUrl: (logo: string) => void;
  activePlatformType: number;
  setActivePlatformType: (type: number) => void;
  isMoreGameLoading: boolean;
  setIsMoreGameLoading: (isLoading: boolean) => void;
  scrollIntersectingCount: number;
  addScrollIntersectingCount: () => void;
}

export const useMoreGamePageStoreStore = create<usMoreGamePageStoreTypes>()(
  devtoolsAndPersistWrapper(
    '[page store] useMoreGamePageStoreStore',
    (set, get) => ({
      activeHorizonTab: MoreGamePageTabType.ALL,
      setActiveHorizonTab: (tabName) =>
        set(() => ({
          activeHorizonTab: tabName,
        })),
      page: 1,
      setPage: (page) => set(() => ({ page })),
      moreGameList: [] as GameListItemResult[],
      setMoreGameList: (values) =>
        set((state: usMoreGamePageStoreTypes) => ({
          moreGameList:
            values instanceof Function ? values(state.moreGameList) : values,
        })),
      recentGameList: [] as GameListItemResult[],
      setRecentGameList: (values) =>
        set((state: usMoreGamePageStoreTypes) => ({
          recentGameList:
            values instanceof Function ? values(state.recentGameList) : values,
        })),
      addRecentGameList: (item) =>
        set(() => {
          const updatedList: GameListItemResult[] = cloneDeep(
            get().recentGameList
          );

          const existingIndex = updatedList.findIndex(
            (gameItem) => gameItem.gameId === item.gameId
          );

          if (typeof existingIndex === 'number' && existingIndex !== -1) {
            updatedList.splice(existingIndex, 1);
          }

          updatedList.unshift({ ...item });

          return { recentGameList: updatedList };
        }),
      allLoaded: false,
      setAllLoaded: (bool) => set(() => ({ allLoaded: bool })),
      activePlatformId: 0,
      setActivePlatformId: (id) =>
        set(() => ({
          activePlatformId: id,
        })),
      activeManufacturer: '',
      setActiveManufacturer: (manufacturer) =>
        set(() => ({ activeManufacturer: manufacturer })),
      activeManufacturerLogoUrl: '',
      setActiveManufacturerLogoUrl: (logo) =>
        set(() => ({
          activeManufacturerLogoUrl: logo,
        })),
      activePlatformType: 0,
      setActivePlatformType: (type) =>
        set(() => ({ activePlatformType: type })),

      isMoreGameLoading: false,
      setIsMoreGameLoading: (isLoading) =>
        set(() => ({ isMoreGameLoading: isLoading })),

      scrollIntersectingCount: 0,
      addScrollIntersectingCount: () =>
        set(() => ({
          scrollIntersectingCount: get().scrollIntersectingCount + 1,
        })),
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
