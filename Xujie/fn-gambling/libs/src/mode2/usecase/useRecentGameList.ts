import { useDeepEffect, useUpdateDeepEffect } from '@libs/commonUtils';
import { useMoreGamePageStoreStore } from '../zustand/page/moreGamePage';
import { useEffect } from 'react';

import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@libs/mode2/localforage/user';
import isArray from 'lodash/isArray';
import { GameListItemResult } from '../zustand/page/hallPageStore';
import { usePostGameRecentPlayMutation } from '../external/api';

export const useRecentGameList = () => {
  // const recentGameList = useMoreGamePageStoreStore(
  //   (state) => state.recentGameList
  // );
  const setRecentGameList = useMoreGamePageStoreStore(
    (state) => state.setRecentGameList
  );

  const [postGameRecentPlay, { data: recentGameList }] =
    usePostGameRecentPlayMutation();

  useEffect(() => {
    postGameRecentPlay();
  }, []);

  useDeepEffect(() => {
    console.log('!! @@@===> data', recentGameList);

    if (recentGameList && isArray(recentGameList))
      setRecentGameList(recentGameList);
  }, [recentGameList]);

  // const handleGetListFromLocalForage = async () => {
  //   const savedRecentGameList = await userLocalForage.getItem(
  //     UserLocalforageStoreKeys.RECENT_GAME_LIST
  //   );
  //   console.log('!! savedRecentGameList', savedRecentGameList);
  //   if (
  //     savedRecentGameList &&
  //     isArray(savedRecentGameList) &&
  //     savedRecentGameList.length > 0
  //   ) {
  //     setRecentGameList(savedRecentGameList);
  //   }
  // };
  // const handleSetListFromLocalForage = async (list: GameListItemResult[]) => {
  //   userLocalForage.setItem(UserLocalforageStoreKeys.RECENT_GAME_LIST, list);
  //   console.log('!! list', list);
  //   if (list && isArray(list) && list.length > 0) {
  //     setRecentGameList(list);
  //   }
  // };
  // useEffect(() => {
  //   handleGetListFromLocalForage();
  // }, []);
  // useUpdateDeepEffect(() => {
  //   console.log('!! recentGameList', recentGameList);
  //   handleSetListFromLocalForage(recentGameList);
  // }, [recentGameList]);
};

export default useRecentGameList;
