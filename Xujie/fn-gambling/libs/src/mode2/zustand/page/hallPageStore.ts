import { create } from 'zustand';
import { RefObject } from 'react';
import {
  AnnouncementResult,
  BroadcastItemResult,
} from '@mode2API/endpoint/user/PostHomeEndpoint';
import {
  devtoolsAndPersistWrapper,
  devtoolsWrapper,
} from '../middlewareWrapper';
import { ActionClickPayloadMap as HallPageActionClickPayloadMap } from '@mode2/action/hallPageAction/useHallPageActions';
import { VoidAction } from '@mode2/@types/commonTypes';
import { I18NContent } from '@libs/mode2/@types/i18nType';

// - /////////////// Download Banner ///////////////////////
export interface Mode2HallPageDownloadBannerStoreTypes {
  isShowDownloadBanner: boolean;
  setIsShowDownloadBanner: (value: boolean) => void;
}

export const useMode2HallPageDownloadBannerStore =
  create<Mode2HallPageDownloadBannerStoreTypes>()(
    devtoolsWrapper('store [useMode2HallPageDownloadBannerStore]', (set) => ({
      isShowDownloadBanner: true,
      setIsShowDownloadBanner: (value) =>
        set(() => ({ isShowDownloadBanner: value })),
    }))
  );

// - /////////////// Bonus Modal ///////////////////////
export interface Mode2HallPageModalStoreTypes {
  isShowBonusModal: boolean;
  setIsShowBonusModal: (value: boolean) => void;
}

export const useMode2HallPageModalStore =
  create<Mode2HallPageModalStoreTypes>()(
    devtoolsWrapper('store [useMode2HallPageModalStore]', (set) => ({
      isShowBonusModal: false,
      setIsShowBonusModal: (value) => set(() => ({ isShowBonusModal: value })),
    }))
  );

// - /////////////// Banner ///////////////////////

export interface AnnouncementItem extends AnnouncementResult {}

export interface useMode2BannerStoreTypes {
  bannerList: AnnouncementItem[];
  setBannerList: (list: AnnouncementItem[]) => void;
}

export const useMode2BannerStore = create<useMode2BannerStoreTypes>()(
  devtoolsAndPersistWrapper('[page store] useMode2BannerStore', (set) => ({
    bannerList: [] as AnnouncementItem[],
    setBannerList: (list) => set(() => ({ bannerList: list })),
  }))
);

interface AnnouncementActionsStoreTypes {
  bannerActionList: VoidAction[];
  setBannerActionList: (list: VoidAction[]) => void;
}

// Actions 的行為就不做資料固化
export const useMode2BannerActionsStore = create<AnnouncementActionsStoreTypes>(
  (set) => ({
    bannerActionList: [] as VoidAction[],
    setBannerActionList: (list) => set(() => ({ bannerActionList: list })),
  })
);

// - //////////////// Marquee //////////////////////
export interface BroadcastItem extends BroadcastItemResult {}

export interface useMode2MarqueeListType {
  marqueeList: BroadcastItem[];
  setMarqueeList: (list: BroadcastItem[]) => void;
  fontColor: string;
  setFontColor: (color: string) => void;
}

export const useMode2MarqueeListStore = create<useMode2MarqueeListType>()(
  devtoolsAndPersistWrapper('store [useMode2MarqueeListStore]', (set) => ({
    marqueeList: [] as BroadcastItem[],
    setMarqueeList: (list) => set(() => ({ marqueeList: list })),
    fontColor: '#ffffff',
    setFontColor: (color) => set(() => ({ fontColor: color })),
  }))
);

interface marqueeActionsStoreTypes {
  marqueeActionList: VoidAction[];
  setMarqueeActionList: (list: VoidAction[]) => void;
}

// Actions 的行為就不做資料固化
export const useMode2MarqueeActionsStore = create<marqueeActionsStoreTypes>(
  (set) => ({
    marqueeActionList: [] as VoidAction[],
    setMarqueeActionList: (list) => set(() => ({ marqueeActionList: list })),
  })
);

// - HallPageRefs //////////////////////

export interface useMode2HallPageRefsType {
  scrollContainerRef: RefObject<HTMLDivElement> | null;
  setScrollContainerRef: (ref: RefObject<HTMLDivElement>) => void;
  scrollContentRef: RefObject<HTMLDivElement> | null;
  setScrollContentRef: (ref: RefObject<HTMLDivElement>) => void;
}

export const useMode2HallPageRefsStore = create<useMode2HallPageRefsType>(
  (set) => ({
    scrollContainerRef: null as RefObject<HTMLDivElement> | null,
    setScrollContainerRef: (ref) => set(() => ({ scrollContainerRef: ref })),
    scrollContentRef: null as RefObject<HTMLDivElement> | null,
    setScrollContentRef: (ref) => set(() => ({ scrollContentRef: ref })),
  })
);

// - //////////////// HallPageTabs //////////////////////

export const HallPageIdObj = {
  LOBBY: 'lobby',
  HOT: 'hot',
  CASINO: 'casino',
  ORIGINAL: 'original',
  SLOTS: 'slots',
  GAME: 'game',
  FISHING: 'fishing',
  SPORTS: 'sports',
  FAVORITE: 'favorite',
} as const;

export enum HallPageTabs {
  LOBBY,
  HOT,
  CASINO,
  ORIGINAL,
  SLOTS,
  GAME,
  FISHING,
  SPORTS,
  FAVORITE,
}

type ActionKeys = keyof HallPageActionClickPayloadMap;

export type HallPageTabIDType =
  (typeof HallPageIdObj)[keyof typeof HallPageIdObj];

export type HallPageTab = {
  id: HallPageTabIDType;
  btnTextKey: I18NContent;
  iconName: string;
  isActive: boolean;
  isNeedLogin: boolean;
  collectListLength: number;
  isLogin?: boolean;
  actionName: ActionKeys;
  payload?: HallPageActionClickPayloadMap[ActionKeys];
};

export interface useMode2TabsType {
  curTab: HallPageTabIDType;
  setCurTab: (tabID: HallPageTabIDType) => void;
  tabList: HallPageTab[] | [];
  setTabList: (list: HallPageTab[]) => void;
}

export const useMode2HallPageTabsStore = create<useMode2TabsType>()(
  devtoolsAndPersistWrapper(
    '[page store] useMode2HallPageTabsStore',
    (set) => ({
      curTab: HallPageIdObj.LOBBY as HallPageTabIDType,
      setCurTab: (tabID) => set(() => ({ curTab: tabID })),
      tabList: [] as HallPageTab[],
      setTabList: (list) => set(() => ({ tabList: list })),
    })
  )
);
interface HallPageActionsStoreTypes {
  hallPageTabActionList: VoidAction[];
  setHallPageTabActionList: (list: VoidAction[]) => void;
  scrollToTabsCount: number;
  addScrollToTabsCount: () => void;
}

export const useHallPageActionsStore = create<HallPageActionsStoreTypes>()(
  devtoolsWrapper(
    '[MyPage Action store] useMyPageActionsStore',
    (set, get) => ({
      hallPageTabActionList: {} as VoidAction[],
      setHallPageTabActionList: (list) =>
        set(() => ({ hallPageTabActionList: list })),
      scrollToTabsCount: 0,
      addScrollToTabsCount: () =>
        set(() => ({ scrollToTabsCount: get().scrollToTabsCount + 1 })),
    })
  )
);

// - //////////////// HallPageGameList //////////////////////

/**
 * 補足game list相關API缺漏的值,讓所有gameListsConfig.list維持同樣結構
 *
 * 相關api有 /game/home, /home, /game/colections, /game/search
 */
export const fillGameListItemMissingValues = (
  listItem: Partial<GameListItemResult>
): GameListItemResult => {
  return {
    gameId: 0,
    name: '',
    platform: '',
    gameName: '',
    platformId: 0,
    isHotGame: false,
    isFavorite: false,
    isMaintain: false,
    maintainTime: '',
    coverImageSrc: '',
    manufacturerLogoUrl: '',
    manufacturer: '',
    type: 0,
    enterGameType: 1,
    ...listItem,
  };
};

/** 1:直接進入游戏 2:進入大廳 3:進入游戲目錄 */
export enum EnterGameType {
  DIRECT = 1,
  LOBBY = 2,
  DIRECTORY = 3,
}

export const mapEnterGameType = (
  isEnterLobby: number,
  isGame: number
): EnterGameType => {
  // 目前看到直接進入遊戲的IsEnterLobby也會拿到1, 不確定有沒有IsEnterLobby拿到0的情況
  if (isGame === 1) {
    return EnterGameType.DIRECT;
  } else if (isEnterLobby === 1) {
    return EnterGameType.LOBBY;
  }
  return EnterGameType.DIRECTORY;
};

export type GameListItemResult = {
  gameId: number;
  name: string;
  platform: string;
  gameName: string;
  platformId: number;
  isHotGame: boolean;
  isFavorite: boolean;
  isMaintain: boolean;
  maintainTime: string;
  coverImageSrc: string;
  manufacturerLogoUrl: string;
  manufacturer: string;
  enterGameType: EnterGameType;
  type: number;
};

export type Mode2GameListConfig = {
  list: GameListItemResult[];
  tabName: I18NContent;
  iconName: string;
  isScroll: boolean;
  actionClickAll: () => void;
  isUseDisplayCount?: boolean;
  displayCount?: number;
  isShowLoadmore?: boolean;
  isException?: boolean;
  showGameName?: boolean;
  isShowHoverMask: boolean;
  isSupplierGameList?: boolean;
};

export type ExcludeLobbyHallPageTabIDType = Exclude<HallPageTabIDType, 'lobby'>;

export type GameListsObjType = Record<
  ExcludeLobbyHallPageTabIDType,
  Mode2GameListConfig
>;

export interface useMode2HallPageGameListType {
  gameList: Mode2GameListConfig[];
  setGameList: (list: Mode2GameListConfig[]) => void;
  platformList: Mode2GameListConfig[];
  setPlatformList: (list: Mode2GameListConfig[]) => void;
}

export const useMode2HallPageGameListStore =
  create<useMode2HallPageGameListType>()(
    devtoolsAndPersistWrapper(
      '[store useMode2HallPageGameListStore]',
      (set) => ({
        gameList: [] as Mode2GameListConfig[],
        setGameList: (list) => set(() => ({ gameList: list })),
        platformList: [] as Mode2GameListConfig[],
        setPlatformList: (list) => set(() => ({ platformList: list })),
      })
    )
  );

// - //////////////// HallPageStore //////////////////////

export interface useMode2HallPageType {
  isRefresh: boolean;
  setIsRefresh: (bool: boolean) => void;
}

export const useMode2HallPageStore = create<useMode2HallPageType>()(
  devtoolsWrapper('[page useMode2HallPageStore]', (set) => ({
    isRefresh: false,
    setIsRefresh: (bool) => set(() => ({ isRefresh: bool })),
  }))
);
