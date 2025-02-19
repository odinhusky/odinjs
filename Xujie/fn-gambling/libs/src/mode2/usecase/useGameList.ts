import { useEffect } from 'react';
import { useDeepEffect, useImgUrlByBreakPoint } from '@commonUtils/hooks';
import { usePostGameHomeMutation, usePostHomeMutation } from '@mode2API/index';
import {
  computeFlatAllGameItem,
  useGameListInitStore,
  useGameListStore,
} from '@mode2/zustand/gameListStore';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import { usePlatformServicesStore } from '@mode2/zustand/platform/platformServicesStore';
import { usePlatformInfoStore } from '@mode2/zustand/platform/platformInfoStore';
import { AnnouncementResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';
import sdkUtils from '@mode2/utils/sdk';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { isEmpty } from 'lodash';

export const useGameList = () => {
  const [postHome, { data: homeInfo, isSuccess: isHomeInfoSuccessState }] =
    usePostHomeMutation();
  const [postGameHome, { data: gameHome }] = usePostGameHomeMutation();

  const initStore = useGameListInitStore((state) => state);

  const setPlatformGameMap = useGameListStore(
    (state) => state.setPlatformGameMap
  );
  const setIsHomeInfoSuccess = useGameListStore(
    (state) => state.setIsHomeInfoSuccess
  );
  const setBroadcastItems = usePlatformNotifyStore(
    (state) => state.setBroadcastItems
  );
  const setCarouselItems = usePlatformNotifyStore(
    (state) => state.setCarouselItems
  );
  const setApkInfoId = usePlatformNotifyStore((state) => state.setApkInfoId);
  const setAnnouncementsItems = usePlatformNotifyStore(
    (state) => state.setAnnouncementsItems
  );
  const setServicesList = usePlatformServicesStore(
    (state) => state.setServicesList
  );
  const setPlatformItems = usePlatformInfoStore(
    (state) => state.setPlatformItems
  );
  const setSidebarPlatformItems = usePlatformInfoStore(
    (state) => state.setSidebarPlatformItems
  );

  const setHotGameList = useGameListStore((state) => state.setHotGameList);
  const setWinGameList = useGameListStore((state) => state.setWinGameList);

  const promoteGameIds = usePlatformDynamicConfigStore(
    (state) => state.promoteGameIds
  );

  const setPromoteGameIds = usePlatformDynamicConfigStore(
    (state) => state.setPromoteGameIds
  );

  const setDisplayRegisterReward = usePlatformDynamicConfigStore(
    (state) => state.setDisplayRegisterReward
  );

  const allGameItems = computeFlatAllGameItem();

  // 新增localImgUrl字段
  // const setCarouselItemList = (items: CarouselItemResult[]) => {
  //   return items.map((item) => {
  //     const name = getFileNameByUrl(item.logoUrl, false);
  //     const fileName = name.split('.')[0];
  //     const format = name.split('.')[1];
  //     // 例如：item.logoUrl = [https://xxx.xxx.xxx/1.gif]
  //     // 例如：item.logoUrl = [https://xxx.xxx.xxx/2.png]
  //     // 判斷 .gif 在本地資源就要拿副檔名
  //     // 如果不是，就只給filename，副檔名由 getImgUrl 內判斷是否支援 webp，或直接拿本地png資源
  //     const bannerUrl = ['gif'].includes(format)
  //       ? getImgUrl(EResourceLevel.POPUP_BANNER, fileName, `.${format}`)
  //       : getImgUrl(EResourceLevel.POPUP_BANNER, fileName);
  //     return {
  //       ...item,
  //       localImgUrl: bannerUrl,
  //     };
  //   });
  // };

  useDeepEffect(() => {
    const promoteGameId = Number(
      sdkUtils.getStorage(AppLocalStorageKey.PROMOTE_GAME_ID) || '-1'
    );
    if (promoteGameId > 0) {
      setPromoteGameIds([promoteGameId]);
    }
  }, []);

  useDeepEffect(() => {
    if (!gameHome) return;
    const sortedHotGamesItems = isEmpty(promoteGameIds)
      ? [...gameHome.hotGames]
      : [...gameHome.hotGames].sort((a, b) => {
          const indexA = promoteGameIds.indexOf(a.gameId); // 查找索引
          const indexB = promoteGameIds.indexOf(b.gameId);

          if (indexA === -1 && indexB === -1) return 0; // 都不在 topGameIds 中，保留原順序
          if (indexA === -1) return 1; // a 不在 topGameIds，排後
          if (indexB === -1) return -1; // b 不在 topGameIds，排後
          return indexA - indexB; // 按 topGameIds 順序排序
        });

    setHotGameList(sortedHotGamesItems);
    setWinGameList(gameHome.winGames);
  }, [gameHome, promoteGameIds]);

  /**
   * 首頁 Banner res 由前端控制
   * 如果出現圖片加載失敗，代表 [../public/images/{v}/ || S3 ] 沒資源
   * @param results
   */
  const mapAnnouncementBannerRes = (
    results: AnnouncementResult[]
  ): AnnouncementResult[] => {
    return results.map((item) => {
      return {
        ...item,
        bannerUrl: item.bannerUrl,
        // bannerUrl: getFileNameByUrl(item.bannerUrl, false),
      };
    });
  };

  useEffect(() => {
    setIsHomeInfoSuccess(isHomeInfoSuccessState);
  }, [isHomeInfoSuccessState]);

  useDeepEffect(() => {
    if (!homeInfo) return;
    setPlatformGameMap(homeInfo.platformInfo);
    setBroadcastItems(homeInfo.broadcastList);
    // setCarouselItems(homeInfo.carouselItemList);
    setCarouselItems(homeInfo.carouselItemList);
    setAnnouncementsItems(mapAnnouncementBannerRes(homeInfo.announcements));
    setServicesList(homeInfo.customerServicesList);
    setSidebarPlatformItems(homeInfo.sidebarPlatform);
    setPlatformItems(homeInfo.platformGameList);
    setApkInfoId(homeInfo.apkInfoId);
    setDisplayRegisterReward(homeInfo.isDisplayRegisterReward);
  }, [homeInfo]);

  useEffect(() => {
    if (!initStore.isInitialization || allGameItems.length === 0) {
      postHome();
      postGameHome();
      initStore.setInitialization(true);
    }
  }, []);
};
