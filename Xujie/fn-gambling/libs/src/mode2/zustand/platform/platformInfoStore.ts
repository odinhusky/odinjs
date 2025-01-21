import { create } from 'zustand';
import { GameListItemResult } from '@mode2/zustand/page/hallPageStore';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';

export interface PlatformInfoStoreTypes {
  platformItems: GameListItemResult[];
  setPlatformItems: (list: GameListItemResult[]) => void;
  sidebarPlatformItems: GameListItemResult[];
  setSidebarPlatformItems: (list: GameListItemResult[]) => void;
  clear: () => void;
}

const initialUsePlatformInfoStoreData = {
  platformItems: [] as GameListItemResult[],
  sidebarPlatformItems: [] as GameListItemResult[],
};

/**
 * 平台資訊相關
 */
export const usePlatformInfoStore = create<PlatformInfoStoreTypes>()(
  devtoolsAndPersistWrapper('[platform store] usePlatformInfoStore', (set) => ({
    ...initialUsePlatformInfoStoreData,
    setPlatformItems: (list) => set(() => ({ platformItems: list })),
    setSidebarPlatformItems: (list) =>
      set(() => ({ sidebarPlatformItems: list })),
    clear: () =>
      set(() => ({
        ...initialUsePlatformInfoStoreData,
      })),
  }))
);
