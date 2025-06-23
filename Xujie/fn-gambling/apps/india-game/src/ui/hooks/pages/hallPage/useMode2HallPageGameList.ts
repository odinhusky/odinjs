import { useBreakPoint } from '@libs/commonUtils';
import {
  ExcludeLobbyHallPageTabIDType,
  GameListsObjType,
  HallPageIdObj,
  useHallPageActionsStore,
  useMode2HallPageGameListStore,
  useMode2HallPageTabsStore,
} from '@mode2/zustand/page/hallPageStore';
import { useDeepEffect } from '@commonUtils/hooks';
import useHallPageActions from '@mode2/action/hallPageAction/useHallPageActions';
import { handleHallPageTabClick } from '@mode2/action/actionTypes';
import {
  useGameListStore,
  computeAllGameList,
} from '@mode2/zustand/gameListStore';
import { usePlatformInfoStore } from '@libs/mode2/zustand/platform/platformInfoStore';

export const useMode2HallPageGameList = () => {
  const { isTablet, isDesktop, isMobile } = useBreakPoint();

  const { handleHallPageClick } = useHallPageActions();

  const curTab = useMode2HallPageTabsStore((state) => state.curTab);
  const tabList = useMode2HallPageTabsStore((state) => state.tabList);
  const favoriteGameList = useGameListStore((state) => state.favoriteGameList);

  const hotGameList = useGameListStore((state) => state.hotGameList);
  const platformGameMap = useGameListStore((state) => state.hotGameList);
  const platformItems = usePlatformInfoStore((state) => state.platformItems);

  const setCurTab = useMode2HallPageTabsStore((state) => state.setCurTab);
  const setGameList = useMode2HallPageGameListStore(
    (state) => state.setGameList
  );

  const setPlatformList = useMode2HallPageGameListStore(
    (state) => state.setPlatformList
  );

  const addScrollToTabsCount = useHallPageActionsStore(
    (state) => state.addScrollToTabsCount
  );

  // 當我的最愛列表裡面沒有項目的時候回到 Lobby
  useDeepEffect(() => {
    if (favoriteGameList.length === 0) setCurTab(HallPageIdObj.LOBBY);
  }, [favoriteGameList]);

  useDeepEffect(() => {
    const allGameList = computeAllGameList({
      isDesktop,
      isTablet,
      isMobile,
    });

    const {
      hotGameList,
      slotsList,
      casinoList,
      sportsList,
      gamesList,
      fishingsList,
      originalsList,
      platformList,
    } = allGameList;

    const gameListObj: GameListsObjType = {
      [HallPageIdObj.HOT]: {
        tabId: HallPageIdObj.HOT,
        list: hotGameList || [],
        tabName: { i18nKey: 'home_game_title_hot_game' }, // Hot
        iconName: 'ic_popular',
        isScroll: false,
        isUseDisplayCount: true,
        displayCount: isDesktop ? 18 : isTablet ? 12 : 9,
        isShowLoadmore: curTab === HallPageIdObj.LOBBY,
        showGameName: true,
        isShowHoverMask: true,
        actionClickAll: () => {
          handleHallPageClick({
            actionName: handleHallPageTabClick,
            payload: { tabId: HallPageIdObj.HOT },
          });
          addScrollToTabsCount();
        },
      },
      [HallPageIdObj.CASINO]: {
        tabId: HallPageIdObj.CASINO,
        list: casinoList || [],
        tabName: { i18nKey: 'home_game_title_casino_game' }, // Casino
        iconName: 'ic_casino',
        isException: true,
        isScroll: true,
        isUseDisplayCount: false,
        showGameName: false,
        isShowHoverMask: true,
        actionClickAll: () => {
          handleHallPageClick({
            actionName: handleHallPageTabClick,
            payload: { tabId: HallPageIdObj.CASINO },
          });
          addScrollToTabsCount();
        },
      },
      [HallPageIdObj.FAVORITE]: {
        tabId: HallPageIdObj.FAVORITE,
        list: favoriteGameList,
        tabName: { i18nKey: 'home_game_zone_favorite' }, // Favorite
        iconName: 'ic_favorite',
        isScroll: true,
        isUseDisplayCount: false,
        showGameName: true,
        isShowHoverMask: true,
        actionClickAll: () => {
          handleHallPageClick({
            actionName: handleHallPageTabClick,
            payload: { tabId: HallPageIdObj.FAVORITE },
          });
          addScrollToTabsCount();
        },
      },
      [HallPageIdObj.ORIGINAL]: {
        tabId: HallPageIdObj.ORIGINAL,
        list: originalsList || [],
        tabName: { i18nKey: 'home_game_title_original_game' }, // Original
        iconName: 'ic_original',
        isScroll: true,
        isUseDisplayCount: false,
        showGameName: true,
        isShowHoverMask: true,
        actionClickAll: () => {
          handleHallPageClick({
            actionName: handleHallPageTabClick,
            payload: { tabId: HallPageIdObj.ORIGINAL },
          });
          addScrollToTabsCount();
        },
      },
      [HallPageIdObj.SLOTS]: {
        tabId: HallPageIdObj.SLOTS,
        list: slotsList || [],
        tabName: { i18nKey: 'home_game_title_slots_game' }, // Slots
        iconName: 'ic_slots',
        isScroll: true,
        isUseDisplayCount: false,
        showGameName: true,
        isShowHoverMask: true,
        actionClickAll: () => {
          handleHallPageClick({
            actionName: handleHallPageTabClick,
            payload: { tabId: HallPageIdObj.SLOTS },
          });
          addScrollToTabsCount();
        },
      },
      [HallPageIdObj.GAME]: {
        tabId: HallPageIdObj.GAME,
        list: gamesList || [],
        tabName: { i18nKey: 'home_game_zone_game' }, // Game
        iconName: 'ic_game',
        isScroll: true,
        isUseDisplayCount: false,
        showGameName: true,
        isShowHoverMask: true,
        actionClickAll: () => {
          handleHallPageClick({
            actionName: handleHallPageTabClick,
            payload: { tabId: HallPageIdObj.GAME },
          });
          addScrollToTabsCount();
        },
      },
      [HallPageIdObj.FISHING]: {
        tabId: HallPageIdObj.FISHING,
        list: fishingsList || [],
        tabName: { i18nKey: 'home_game_title_fishing_game' }, // Fishing
        iconName: 'ic_fishing',
        isScroll: true,
        isUseDisplayCount: false,
        showGameName: true,
        isShowHoverMask: true,
        actionClickAll: () => {
          handleHallPageClick({
            actionName: handleHallPageTabClick,
            payload: { tabId: HallPageIdObj.FISHING },
          });
          addScrollToTabsCount();
        },
      },
      [HallPageIdObj.SPORTS]: {
        tabId: HallPageIdObj.SPORTS,
        list: sportsList || [],
        tabName: { i18nKey: 'home_game_title_sports_game' }, // Sports
        iconName: 'ic_sports',
        isScroll: true,
        isUseDisplayCount: false,
        showGameName: true,
        isShowHoverMask: true,
        actionClickAll: () => {
          handleHallPageClick({
            actionName: handleHallPageTabClick,
            payload: { tabId: HallPageIdObj.SPORTS },
          });
          addScrollToTabsCount();
        },
      },
    };

    const lobbyGameList = tabList.flatMap((item) => {
      if (
        item.id === HallPageIdObj.FAVORITE ||
        item.id === HallPageIdObj.LOBBY
      ) {
        // 只有當我的最愛裡面沒有資料的時候，或是 ID 是 lobby 的時候不顯示，其他都要顯示
        return [];
      }

      return gameListObj[item.id as ExcludeLobbyHallPageTabIDType];
    });

    // 最後組出來的 GameList
    // lobbyGameList 就是全部遊戲的列表都拿
    const gameList =
      curTab === HallPageIdObj.LOBBY ||
      import.meta.env['VITE_V_VERSION'] === 'v6'
        ? [...lobbyGameList]
        : [gameListObj[curTab]];

    // 供應商列表的 config
    const config = {
      list: platformList,
      tabName: { i18nKey: 'home_game_title_game_supplier' }, // Game Supplier
      iconName: 'ic_game_supplier',
      isScroll: true,
      isUseDisplayCount: false,
      showGameName: false,
      isShowHoverMask: false,
      actionClickAll: () => {},
    };

    setGameList(gameList);
    setPlatformList([config]);
  }, [
    curTab,
    favoriteGameList,
    hotGameList,
    platformGameMap,
    platformItems,
    tabList,
  ]);
};

export default useMode2HallPageGameList;
