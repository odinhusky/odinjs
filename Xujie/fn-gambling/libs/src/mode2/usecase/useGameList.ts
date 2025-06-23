import { useCallback, useEffect } from 'react';
import { useDeepEffect } from '@commonUtils/hooks';
import {
  usePostGameAllMutation,
  usePostGameHomeMutation,
  usePostHomeMutation,
} from '@mode2API/index';
import {
  computeFlatAllGameItem,
  useGameListInitStore,
  useGameListStore,
} from '@mode2/zustand/gameListStore';
import { usePlatformNotifyStore } from '@mode2/zustand/platform/platformNotifyStore';
import { usePlatformServicesStore } from '@mode2/zustand/platform/platformServicesStore';
import { usePlatformInfoStore } from '@mode2/zustand/platform/platformInfoStore';
import { HomeInfoResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { usePlatformDynamicConfigStore } from '@mode2/zustand/platform/platformDynamicConfig';
import isEmpty from 'lodash/isEmpty';
import { usePreloadDynamicResourcesStore } from '@mode2/zustand/preloadDynamicResourcesStore';
import { ExtraDynamicResourceLevels } from '@mode2/usecase/preloadResources/command/PreloadResourcesCommand';
import { GameListItemResult } from '../zustand/page/hallPageStore';
import { v4 as uuidv4 } from 'uuid';
import useLowBalanceRechargeModalStore from '@mode2/zustand/modal/LowBalanceRechargeModal';
import hallAdModelInvoker from '@mode2/usecase/announcement/command/HallAdModelInvoker';
import {
  HallAdModelCommand,
  SourceFrom,
} from '@mode2/usecase/announcement/command/HallAdModelCommand';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import dayjs from 'dayjs';
import useLowBalanceRescueBoxModalStore from '@mode2/zustand/modal/LowBalanceRescueBoxModal';
import useDepositJackpotWheelModalStore from '@mode2/zustand/modal/DepositJackpotWheelModal';
import sdkUtils from '@mode2/utils/sdk';

export const useGameList = () => {
  const [postHome, { data: homeInfo, isSuccess: isHomeInfoSuccessState }] =
    usePostHomeMutation();
  const [postGameHome, { data: gameHome }] = usePostGameHomeMutation();

  const [postAllGameList, { data: allGameListFromGameAllEndpointData }] =
    usePostGameAllMutation();

  const initStore = useGameListInitStore((state) => state);

  const setPlatformGameMap = useGameListStore(
    (state) => state.setPlatformGameMap
  );
  const setIsHomeInfoSuccess = useGameListStore(
    (state) => state.setIsHomeInfoSuccess
  );
  // const allGameListFromPostGameAllEndpoint = useGameListStore(
  //   (state) => state.allGameListFromPostGameAllEndpoint
  // );
  const setAllGameListFromPostGameAllEndpoint = useGameListStore(
    (state) => state.setAllGameListFromPostGameAllEndpoint
  );
  const setHotGameList = useGameListStore((state) => state.setHotGameList);
  const setWinGameList = useGameListStore((state) => state.setWinGameList);

  // 包含 enterGameType 1, 2, 3，目前不是真的所有的遊戲打平
  const setAllGameList = useGameListStore((state) => state.setAllGameList);

  const setBroadcastItems = usePlatformNotifyStore(
    (state) => state.setBroadcastItems
  );
  const setCarouselItems = usePlatformNotifyStore(
    (state) => state.setCarouselItems
  );
  const setApkInfoId = usePlatformNotifyStore((state) => state.setApkInfoId);

  const setServicesList = usePlatformServicesStore(
    (state) => state.setServicesList
  );

  const setPlatformItems = usePlatformInfoStore(
    (state) => state.setPlatformItems
  );
  const setSidebarPlatformItems = usePlatformInfoStore(
    (state) => state.setSidebarPlatformItems
  );

  const promoteGameIds = usePlatformDynamicConfigStore(
    (state) => state.promoteGameIds
  );
  // const setPromoteGameIds = usePlatformDynamicConfigStore(
  //   (state) => state.setPromoteGameIds
  // );
  const setDisplayRegisterReward = usePlatformDynamicConfigStore(
    (state) => state.setDisplayRegisterReward
  );

  const allGameItems = computeFlatAllGameItem();

  const setPreloadResources = usePreloadDynamicResourcesStore(
    (state) => state.setPreloadResources
  );

  // 第一次進入的時候檢查是否有拿到所有的 GameList，沒有的話就打 API 拿
  useDeepEffect(() => {
    const list = useGameListStore.getState().allGameListFromPostGameAllEndpoint;

    if (isEmpty(list)) postAllGameList();
  }, []);

  // API 拿到資料後過濾掉有重複的 GameItem
  useDeepEffect(() => {
    const allGames = allGameListFromGameAllEndpointData?.allGames;

    if (allGames && !isEmpty(allGames)) {
      const seen = new Set<string>();
      const uniqueGames: GameListItemResult[] = [];
      // const gameIconPreloadCommands: PreloadResourcesCommand[] = [];

      allGames.forEach((game) => {
        const key = `${game.gameId}-${game.platformId}-${game.name}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueGames.push(game);
          // gameIconPreloadCommands.push(
          //   new PreloadResourcesCommand({
          //     orderId: uuidv4(),
          //     src: game.coverImageSrc,
          //     type: ExtraDynamicResourceLevels.DYNAMIC_GAME_ICON,
          //   })
          // );
        }
      });

      // const uniqueGames = allGames.filter((game) => {
      //   const key = `${game.gameId}-${game.platformId}-${game.name}`;
      //   if (seen.has(key)) return false;
      //   seen.add(key);
      //   return true;
      // });

      // const gameIconPreloadCommands = uniqueGames.map((item) => {
      //   return new PreloadResourcesCommand({
      //     orderId: uuidv4(),
      //     src: item.coverImageSrc,
      //     type: ExtraDynamicResourceLevels.DYNAMIC_GAME_ICON,
      //   });
      // });
      //
      // Evan all game 先不做預載，有造成效能問題
      // PreloadResourcesInvoker.addAllCommand(gameIconPreloadCommands);
      setAllGameListFromPostGameAllEndpoint(uniqueGames);
    }
  }, [allGameListFromGameAllEndpointData]);

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

  // /**
  //  * 首頁 Banner res 由前端控制
  //  * 如果出現圖片加載失敗，代表 [../public/images/{v}/ || S3 ] 沒資源
  //  * @param results
  //  */
  // const mapAnnouncementBannerRes = (
  //   results: AnnouncementResult[]
  // ): AnnouncementResult[] => {
  //   return results.map((item) => {
  //     return {
  //       ...item,
  //       bannerUrl: item.bannerUrl,
  //       // bannerUrl: getFileNameByUrl(item.bannerUrl, false),
  //     };
  //   });
  // };

  useEffect(() => {
    setIsHomeInfoSuccess(isHomeInfoSuccessState);
  }, [isHomeInfoSuccessState]);

  // 預加載資源
  const handlePreloadResources = (homeInfo: HomeInfoResult) => {
    const allGameItems = [
      ...(homeInfo.platformInfo.sportsList || []),
      ...(homeInfo.platformInfo.fishingsList || []),
      ...(homeInfo.platformInfo.gamesList || []),
      ...(homeInfo.platformInfo.slotsList || []),
      ...(homeInfo.platformInfo.originalsList || []),
      ...(homeInfo.platformInfo.casinoList || []),
    ];

    const preloadResources = [
      ...homeInfo.preloadBannerResources.map((item) => ({
        src: item,
        type: ExtraDynamicResourceLevels.DYNAMIC_BANNER,
      })),
      ...allGameItems.map((item) => ({
        src: item.coverImageSrc,
        type: ExtraDynamicResourceLevels.DYNAMIC_GAME_ICON,
      })),
      // ...homeInfo.announcements.map((iteum) => ({
      //   src: item.lobbyBannerUrl,
      //   type: ExtraDynamicResourceLevels.DYNAMIC_BANNER,
      // })),
    ];

    setPreloadResources(preloadResources);
  };

  useDeepEffect(() => {
    if (!homeInfo) return;
    // console.log('@@@===> all game items ');
    handlePreloadResources(homeInfo);
    setPlatformGameMap(homeInfo.platformInfo);
    setBroadcastItems(homeInfo.broadcastList);
    // setCarouselItems(homeInfo.carouselItemList);
    setCarouselItems(homeInfo.carouselItemList);
    // setAnnouncementsItems(mapAnnouncementBannerRes(homeInfo.announcements));
    // setHallPopupAnnouncementsItems(homeInfo.hallPopupAnnouncements);
    setServicesList(homeInfo.customerServicesList);
    setSidebarPlatformItems(homeInfo.sidebarPlatform);
    setPlatformItems(homeInfo.platformGameList);
    setApkInfoId(homeInfo.apkInfoId);
    setDisplayRegisterReward(homeInfo.isDisplayRegisterReward);

    handleDepositJackpotWheelForShow(
      homeInfo.depositJackpotWheelLimitedOffersEndTimeForShow
    );

    handleLowBalanceRecharge(homeInfo.lowBalanceRechargeLimitedOffersEndTime);
    handleLowBalanceRescueBox(homeInfo.lowBalanceRescueBoxLimitedOffersEndTime);
  }, [homeInfo]);

  const userRole = useUserProfileStore((state) => state.userRole);
  const handleLowBalanceRecharge = useCallback(
    (limitedOffersEndTime: number) => {
      if (userRole !== UserRoleType.USER) {
        return;
      }

      if (limitedOffersEndTime < dayjs().unix()) {
        return;
      }
      useLowBalanceRechargeModalStore
        .getState()
        .upLowBalanceRechargeLimitedOffersEndTime(limitedOffersEndTime);

      hallAdModelInvoker.addUnshiftCommandFromImmediate(
        new HallAdModelCommand({
          uniqueId: uuidv4(),
          orderId: -1,
          parameter: '{}',
          type: AnnouncementType.LOW_BALANCE_RECHARGE,
          from: SourceFrom.IMMEDIATE,
          onShowAction: (uniqueId, type) => {
            useModalLayoutStore.getState().setHallAdModelCommandTypes({
              uniqueId: uniqueId,
              type: type,
              parameterJson: '{}',
              from: SourceFrom.IMMEDIATE,
            });
          },
        })
      );
    },
    [userRole]
  );

  const handleLowBalanceRescueBox = useCallback(
    (limitedOffersEndTime: number) => {
      if (!sdkUtils.isCurrentLogin()) {
        return;
      }

      if (limitedOffersEndTime < dayjs().unix()) {
        return;
      }
      useLowBalanceRescueBoxModalStore
        .getState()
        .upLowBalanceRescueBoxLimitedOffersEndTime(limitedOffersEndTime);
    },
    []
  );

  const handleDepositJackpotWheelForShow = useCallback(
    (limitedOffersEndTime: number) => {
      if (!sdkUtils.isCurrentLogin()) {
        return;
      }
      if (limitedOffersEndTime < dayjs().unix()) {
        return;
      }

      hallAdModelInvoker.addUnshiftCommandFromImmediate(
        new HallAdModelCommand({
          uniqueId: uuidv4(),
          orderId: -2,
          parameter: '{}',
          type: AnnouncementType.DEPOSIT_JACKPOT_WHEEL,
          from: SourceFrom.IMMEDIATE,
          onShowAction: (uniqueId, type) => {
            useModalLayoutStore.getState().setHallAdModelCommandTypes({
              uniqueId: uniqueId,
              type: type,
              parameterJson: '{}',
              from: SourceFrom.IMMEDIATE,
            });
          },
        })
      );
    },
    []
  );

  // Evan 首頁彈窗控制在 announcements內，後端會依照當前角色請求給不同的popup
  // ，因請求時機無法取得當前正確資訊
  // ，角色改變需要重新請求 postHome()
  useEffect(() => {
    if (!initStore.isInitialization || allGameItems.length === 0) {
      postHome();
      postGameHome();
      initStore.setInitialization(true);
    }
  }, []);

  // 為了組出不會有問題的 allGameItemList
  useDeepEffect(() => {
    if (!homeInfo || !gameHome) return;

    const list: GameListItemResult[] = [
      ...(gameHome.hotGames || []),
      ...(homeInfo.platformInfo.slotsList || []),
      ...(homeInfo.platformInfo.casinoList || []),
      ...(homeInfo.platformInfo.sportsList || []),
      ...(homeInfo.platformInfo.gamesList || []),
      ...(homeInfo.platformInfo.fishingsList || []),
      ...(homeInfo.platformInfo.originalsList || []),
    ];

    // console.log('!! list', list);
    setAllGameList(list);
  }, [homeInfo, gameHome]);
};
