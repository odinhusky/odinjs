import { useLocation } from 'react-router-dom';
import { useDeepEffect } from '@commonUtils/hooks';
import {
  usePostGameCollectionsMutation,
  usePostPiggyBankDetailMutation,
} from '@mode2API/index';
import sdkUtils from '@mode2/utils/sdk';
import {
  HallPageIdObj,
  useMode2HallPageModalStore,
  useMode2HallPageStore,
  useMode2HallPageTabsStore,
} from '@mode2/zustand/page/hallPageStore';
import { useEffect } from 'react';
import { useGameListStore } from '@mode2/zustand/gameListStore';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import dayjs from '@commonUtils/localizedDayjs';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import { deleteCachedFiles } from '@mode2/usecase/useClearCacheStorage';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';

export const useMode2HallPageInit = () => {
  const location = useLocation();

  const setFavoriteGameList = useGameListStore(
    (state) => state.setFavoriteGameList
  );
  const curTab = useMode2HallPageTabsStore((state) => state.curTab);

  const apkInfoId = usePlatformNotifyStore((state) => state.apkInfoId);

  const isRefresh = useMode2HallPageStore((state) => state.isRefresh);

  const setIsRefresh = useMode2HallPageStore((state) => state.setIsRefresh);

  const setCurrentCash = useRebateRewardModalStore(
    (state) => state.setCurrentCash
  );
  const setIsShowBonusModal = useMode2HallPageModalStore(
    (state) => state.setIsShowBonusModal
  );

  const [postGameCollections, { data: gameCollectionInfo }] =
    usePostGameCollectionsMutation();

  const [postPiggyBankDetail, { data: piggyBankDetail }] =
    usePostPiggyBankDetailMutation();

  useEffect(() => {
    if (piggyBankDetail) {
      setCurrentCash(piggyBankDetail.amount);
    }
  }, [piggyBankDetail]);

  useDeepEffect(() => {
    if (!gameCollectionInfo) return;
    setFavoriteGameList(gameCollectionInfo.favoriteGameList);
  }, [gameCollectionInfo]);

  const addOrRemoveFavoriteSuccessCount = useGameListStore(
    (state) => state.addOrRemoveFavoriteSuccessCount
  );

  // 補足原有的邏輯
  useEffect(() => {
    if (curTab === HallPageIdObj.FAVORITE) postGameCollections();
  }, [curTab]);

  useEffect(() => {
    if (sdkUtils.isCurrentLogin() && addOrRemoveFavoriteSuccessCount > 0) {
      postGameCollections();
    }
  }, [addOrRemoveFavoriteSuccessCount]);

  const initData = async () => {
    if (sdkUtils.isCurrentLogin()) {
      postGameCollections();
      postPiggyBankDetail();
    }
  };

  const showAnnouncePopUp = async () => {
    // Locale storage內有設定過今天不顯示, 而且已經超過expired time => 不顯示modal
    const modalInfo: string | null = await userLocalForage.getItem(
      UserLocalforageStoreKeys.BONUS_POPUP_INFO
    );
    console.log('modalInfo', modalInfo);
    if (modalInfo) {
      const [lastCheckTime, id] = modalInfo.split(';');

      const isCurrentModalId = Number(id) === apkInfoId;

      // 上次勾選後的一天內不會出現
      // 改 date unix 後續擴展 Exp 才會方便
      const isTimeExpired =
        +dayjs().startOf('day').unix() >
        Number(lastCheckTime) + 24 * 3600 * 1000;

      const shouldShowPopup = !isCurrentModalId || isTimeExpired;

      if (shouldShowPopup) {
        setIsShowBonusModal(true);
        userLocalForage.setItem(UserLocalforageStoreKeys.BONUS_POPUP_INFO, '');
      }
    } else {
      // 沒勾選過"今天不顯示" => 直接show modal
      setIsShowBonusModal(true);
    }
  };

  useEffect(() => {
    // 確保home API已經有正確設定好id,且不在login頁面
    const redirect = location.state?.redirect;
    if (!redirect && apkInfoId !== -1) {
      showAnnouncePopUp();
    }
  }, [location, apkInfoId]);

  useEffect(() => {
    initData();
  }, []);

  // 當如果是點選 Refresh Version 過來後，重新 Reload
  useEffect(() => {
    const reset = async () => {
      await deleteCachedFiles([]);
      sdkUtils.reloadWindow();
      setIsRefresh(false);
    };
    if (isRefresh) {
      reset();
    }
  }, [isRefresh]);
};

export default useMode2HallPageInit;
