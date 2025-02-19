import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { useMemo } from 'react';
import {
  HallPageTab,
  useMode2HallPageTabsStore,
  useHallPageActionsStore,
  HallPageIdObj,
} from '@mode2/zustand/page/hallPageStore';
import { cloneDeep, isArray } from 'lodash';
import { handleHallPageTabClick } from '@mode2/action/hallPageAction/actionType';
import useHallPageActions from '@mode2/action/hallPageAction/useHallPageActions';
import { useGameListStore } from '@mode2/zustand/gameListStore';
import { useDeepEffect } from '@libs/commonUtils';

export const useMode2HallPageTabs = () => {
  const { handleHallPageClick } = useHallPageActions();

  const favoriteGameList = useGameListStore((state) => state.favoriteGameList);

  const addOrRemoveFavoriteSuccessCount = useGameListStore(
    (state) => state.addOrRemoveFavoriteSuccessCount
  );

  const collectListLength =
    favoriteGameList && isArray(favoriteGameList) ? favoriteGameList.length : 0;

  const curTab = useMode2HallPageTabsStore((state) => state.curTab);

  const setTabList = useMode2HallPageTabsStore((state) => state.setTabList);

  const setHallPageTabActionList = useHallPageActionsStore(
    (state) => state.setHallPageTabActionList
  );

  const lobbyTab: HallPageTab = useMemo(
    () => ({
      btnTextKey: { i18nKey: 'home_game_zone_lobby' },
      iconName: 'ic_lobby',
      isNeedLogin: false,
      id: HallPageIdObj.LOBBY,
      isActive: curTab === HallPageIdObj.LOBBY,
      collectListLength,
      actionName: handleHallPageTabClick,
      payload: { tabId: HallPageIdObj.LOBBY },
    }),
    [curTab, collectListLength]
  );

  const favoriteTab: HallPageTab = useMemo(
    () => ({
      btnTextKey: { i18nKey: 'home_game_zone_favorite' },
      iconName: 'ic_favorite',
      isNeedLogin: true,
      isLogin: !!sdkUtils.getStorage(AppLocalStorageKey.TOKEN),
      id: HallPageIdObj.FAVORITE,
      isActive: curTab === HallPageIdObj.FAVORITE,
      collectListLength,
      actionName: handleHallPageTabClick,
      payload: { tabId: HallPageIdObj.FAVORITE },
    }),
    [curTab, collectListLength, addOrRemoveFavoriteSuccessCount]
  );

  const hotTab: HallPageTab = useMemo(
    () => ({
      btnTextKey: { i18nKey: 'home_game_zone_hot' },
      iconName: 'ic_popular',
      isNeedLogin: false,
      id: HallPageIdObj.HOT,
      isActive: curTab === HallPageIdObj.HOT,
      collectListLength,
      actionName: handleHallPageTabClick,
      payload: { tabId: HallPageIdObj.HOT },
    }),
    [curTab, collectListLength]
  );

  const casinoTab: HallPageTab = useMemo(
    () => ({
      btnTextKey: { i18nKey: 'home_game_zone_casino' },
      iconName: 'ic_casino',
      isNeedLogin: false,
      id: HallPageIdObj.CASINO,
      isActive: curTab === HallPageIdObj.CASINO,
      collectListLength,
      actionName: handleHallPageTabClick,
      payload: { tabId: HallPageIdObj.CASINO },
    }),
    [curTab, collectListLength]
  );

  const originalTab: HallPageTab = useMemo(
    () => ({
      btnTextKey: { i18nKey: 'home_game_zone_original' },
      iconName: 'ic_original',
      isNeedLogin: false,
      id: HallPageIdObj.ORIGINAL,
      isActive: curTab === HallPageIdObj.ORIGINAL,
      collectListLength,
      actionName: handleHallPageTabClick,
      payload: { tabId: HallPageIdObj.ORIGINAL },
    }),
    [curTab, collectListLength]
  );

  const slotsTab: HallPageTab = useMemo(
    () => ({
      btnTextKey: { i18nKey: 'home_game_zone_slots' },
      iconName: 'ic_slots',
      isNeedLogin: false,
      id: HallPageIdObj.SLOTS,
      isActive: curTab === HallPageIdObj.SLOTS,
      collectListLength,
      actionName: handleHallPageTabClick,
      payload: { tabId: HallPageIdObj.SLOTS },
    }),
    [curTab, collectListLength]
  );

  const gameTab: HallPageTab = useMemo(
    () => ({
      btnTextKey: { i18nKey: 'home_game_zone_game' },
      iconName: 'ic_game',
      isNeedLogin: false,
      id: HallPageIdObj.GAME,
      isActive: curTab === HallPageIdObj.GAME,
      collectListLength,
      actionName: handleHallPageTabClick,
      payload: { tabId: HallPageIdObj.GAME },
    }),
    [curTab, collectListLength]
  );

  const fishingTab: HallPageTab = useMemo(
    () => ({
      btnTextKey: { i18nKey: 'home_game_zone_fishing' },
      iconName: 'ic_fishing',
      isNeedLogin: false,
      id: HallPageIdObj.FISHING,
      isActive: curTab === HallPageIdObj.FISHING,
      collectListLength,
      actionName: handleHallPageTabClick,
      payload: { tabId: HallPageIdObj.FISHING },
    }),
    [curTab, collectListLength]
  );

  const sportsTab: HallPageTab = useMemo(
    () => ({
      btnTextKey: { i18nKey: 'home_game_zone_sports' },
      iconName: 'ic_sports',
      isNeedLogin: false,
      id: HallPageIdObj.SPORTS,
      isActive: curTab === HallPageIdObj.SPORTS,
      collectListLength,
      actionName: handleHallPageTabClick,
      payload: { tabId: HallPageIdObj.SPORTS },
    }),
    [curTab, collectListLength]
  );

  const mixTabList: HallPageTab[] = useMemo(
    () => [
      lobbyTab,
      favoriteTab,
      hotTab,
      casinoTab,
      originalTab,
      slotsTab,
      gameTab,
      fishingTab,
      sportsTab,
    ],
    [
      lobbyTab,
      favoriteTab,
      hotTab,
      casinoTab,
      originalTab,
      slotsTab,
      gameTab,
      fishingTab,
      sportsTab,
      addOrRemoveFavoriteSuccessCount, // 等成功拿到最新的我的最愛列表後，更新 tabList
    ]
  );

  useDeepEffect(() => {
    let list = cloneDeep(mixTabList);

    // v6 版本沒有 Lobby Tab
    if (import.meta.env['VITE_V_VERSION'] === 'v6') {
      list = list.slice(2); // 移除 lobby 以及 hot 的標籤
    }

    const actionList = list.map((item) => () => {
      handleHallPageClick({
        actionName: item.actionName,
        payload: item?.payload,
      });
    });

    setTabList(list);
    setHallPageTabActionList(actionList);
  }, [mixTabList]);
};

export default useMode2HallPageTabs;
