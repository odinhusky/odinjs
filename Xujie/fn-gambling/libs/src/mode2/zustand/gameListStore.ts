import { create } from 'zustand';
import { GameListItemResult } from '@libs/mode2/zustand/page/hallPageStore';
import { GameListCatagory } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { usePlatformInfoStore } from '@mode2/zustand/platform/platformInfoStore';
import { devtoolsAndPersistWrapper } from './middlewareWrapper';
import { WinGameItemResult } from '@mode2API/endpoint/game/PostGameHomeEndpoint';
import { DeviceBreakPointType } from '@libs/commonUtils';
import { generateGameList } from '@libs/constant/gameListDummyData';
import { cloneDeep } from 'lodash';

/** 攤平所有Game, 方便未來進行全域搜索 */
export const computeFlatAllGameItem = () => {
  const { hotGameList, platformGameMap } = useGameListStore.getState();
  const { platformItems } = usePlatformInfoStore.getState();

  return [
    ...(hotGameList || []),
    ...(platformGameMap.slotsList || []),
    ...(platformGameMap.casinoList || []),
    ...(platformGameMap.sportsList || []),
    ...(platformGameMap.gamesList || []),
    ...(platformGameMap.fishingsList || []),
    ...(platformGameMap.originalsList || []),
    ...platformItems,
  ];
};

const handleDefaultGameListBreakPoint = (
  type: number = 1,
  bp: DeviceBreakPointType
): GameListItemResult[] => {
  const { isDesktop, isTablet } = bp;
  return isDesktop
    ? generateGameList(7, type)
    : isTablet
    ? generateGameList(4, type)
    : generateGameList(3, type);
};

//
const handleDefaultGameList = (bp: DeviceBreakPointType) => {
  const defaultHotGameList = handleDefaultGameListBreakPoint(1, bp);
  const defaultSlotsGameList = handleDefaultGameListBreakPoint(1, bp);
  const defaultCasinoGameList = handleDefaultGameListBreakPoint(3, bp);
  const defaultSportsGameList = handleDefaultGameListBreakPoint(2, bp);
  const defaultGameList = handleDefaultGameListBreakPoint(3, bp);
  const defaultFishingGameList = handleDefaultGameListBreakPoint(3, bp);
  const defaultOriginalGameList = handleDefaultGameListBreakPoint(3, bp);

  return {
    defaultHotGameList,
    defaultSlotsGameList,
    defaultCasinoGameList,
    defaultSportsGameList,
    defaultGameList,
    defaultFishingGameList,
    defaultOriginalGameList,
  };
};

/** 統一管理所有來源的game list */
export const computeAllGameList = (bp: DeviceBreakPointType) => {
  const { hotGameList, platformGameMap, isHomeInfoSuccess } =
    useGameListStore.getState();
  const { platformItems } = usePlatformInfoStore.getState();
  const defaultList = handleDefaultGameList(bp);

  const hotGameListWithDefault =
    hotGameList === null && isHomeInfoSuccess
      ? defaultList.defaultHotGameList
      : hotGameList;

  const slotsGameListWithDefault =
    platformGameMap.slotsList === null && isHomeInfoSuccess
      ? defaultList.defaultSlotsGameList
      : platformGameMap.slotsList;

  const casinoGameListWithDefault =
    platformGameMap.casinoList === null && isHomeInfoSuccess
      ? defaultList.defaultCasinoGameList
      : platformGameMap.casinoList;

  const sportsGameListWithDefault =
    platformGameMap.sportsList === null && isHomeInfoSuccess
      ? defaultList.defaultSportsGameList
      : platformGameMap.sportsList;

  const gameListWithDefault =
    platformGameMap.gamesList === null && isHomeInfoSuccess
      ? defaultList.defaultGameList
      : platformGameMap.gamesList;

  const fishingGameListWithDefault =
    platformGameMap.fishingsList === null && isHomeInfoSuccess
      ? defaultList.defaultFishingGameList
      : platformGameMap.fishingsList;

  const originalGameListWithDefault =
    platformGameMap.originalsList === null && isHomeInfoSuccess
      ? defaultList.defaultOriginalGameList
      : platformGameMap.originalsList;

  return {
    hotGameList: hotGameListWithDefault,
    slotsList: slotsGameListWithDefault,
    casinoList: casinoGameListWithDefault,
    sportsList: sportsGameListWithDefault,
    gamesList: gameListWithDefault,
    fishingsList: fishingGameListWithDefault,
    originalsList: originalGameListWithDefault,
    platformList: platformItems,
  };
};

export interface GameListStoreTypes {
  hotGameList: GameListItemResult[] | null;
  setHotGameList: (list: GameListItemResult[]) => void;
  winGameList: WinGameItemResult[];
  setWinGameList: (list: WinGameItemResult[]) => void;
  winGamesIndex: number;
  setWinGamesIndex: (idx: number) => void;
  platformGameMap: {
    [key in keyof GameListCatagory]: GameListItemResult[] | null;
  };
  setPlatformGameMap: (map: {
    [key in keyof GameListCatagory]: GameListItemResult[];
  }) => void;
  isHomeInfoSuccess: boolean;
  setIsHomeInfoSuccess: (bool: boolean) => void;
  favoriteGameIds: number[];
  favoriteGameList: GameListItemResult[];
  setFavoriteGameList: (list: GameListItemResult[]) => void;
  addOrRemoveFavoriteSuccessCount: number; // 每當有加入/移除我的最愛成功的時候，數字會累加
  triggerFavoriteAction: () => void; // 累加數字
}

export interface GameListInitStoreTypes {
  isInitialization: boolean;
  setInitialization: (state: boolean) => void;
}

export const useGameListInitStore = create<GameListInitStoreTypes>((set) => ({
  isInitialization: false,
  setInitialization: (state) => set(() => ({ isInitialization: state })),
}));

const defaultGameListData = {
  hotGameList: null as GameListItemResult[] | null,
  winGameList: [] as WinGameItemResult[],
  winGamesIndex: 0,
  platformGameMap: {
    slotsList: null as GameListItemResult[] | null,
    casinoList: null as GameListItemResult[] | null,
    sportsList: null as GameListItemResult[] | null,
    gamesList: null as GameListItemResult[] | null,
    fishingsList: null as GameListItemResult[] | null,
    originalsList: null as GameListItemResult[] | null,
  },
  isHomeInfoSuccess: false,
  favoriteGameIds: [] as number[],
  favoriteGameList: [] as GameListItemResult[],
  addOrRemoveFavoriteSuccessCount: -1,
};

/**
 * 遊戲列表相關
 * [熱門遊戲，遊戲列表，收藏遊戲列表]
 */
export const useGameListStore = create<GameListStoreTypes>()(
  devtoolsAndPersistWrapper(
    '[gameList store] useGameListStore',
    (set, get) => ({
      ...cloneDeep(defaultGameListData),
      setHotGameList: (list) => set(() => ({ hotGameList: list })),
      setWinGameList: (list) => set(() => ({ winGameList: list })),
      setWinGamesIndex: (idx) => set(() => ({ winGamesIndex: idx })),
      setPlatformGameMap: (map) => set(() => ({ platformGameMap: map })),
      setIsHomeInfoSuccess: (bool) => set(() => ({ isHomeInfoSuccess: bool })),
      setFavoriteGameList: (list) =>
        set(() => ({
          favoriteGameIds: list.map((item) => item.gameId),
          favoriteGameList: list,
        })),
      triggerFavoriteAction: () =>
        set(() => ({
          addOrRemoveFavoriteSuccessCount:
            get().addOrRemoveFavoriteSuccessCount + 1,
        })),
    })
  )
);
