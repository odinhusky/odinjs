import sdkUtils from '@mode2/utils/sdk';
import {
  EnterGameType,
  GameListItemResult,
} from '@mode2/zustand/page/hallPageStore';
import {
  usePostEnterGameMutation,
  usePostGameCollectMutation,
} from '@mode2API/index';
import { useGameListStore } from '@mode2/zustand/gameListStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useEffect } from 'react';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';
import {
  EnterGameRequest,
  LaunchType,
} from '@mode2API/endpoint/game/PostEnterGameEndpoint';
import { useLoadingStore } from '@mode2/zustand/components/loadingStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useGuidanceDepositModalStore } from '@mode2/zustand/modal/GuidanceDepositModal/useGuidanceDepositModalStore';

export interface EnterGameParams {
  id: number | null;
  url: string;
  launchType: LaunchType | number;
}

export enum ClickEvent {
  ON_COLLECT,
  ON_ENTER_GAME,
}

export const useGameItemBase = () => {
  const navigate = useNavigateClick();

  const [postGameCollect, { isSuccess: isCollectSuccess }] =
    usePostGameCollectMutation();
  const triggerFavoriteAction = useGameListStore(
    (state) => state.triggerFavoriteAction
  );

  const setShowLoading = useLoadingStore((state) => state.setShowLoading);
  const [postEnterGame] = usePostEnterGameMutation();

  useEffect(() => {
    if (isCollectSuccess) {
      triggerFavoriteAction(); // 成功加入 或是 移除 我的最愛列表的時候累加 addOrRemoveFavoriteSuccessCount
    }
  }, [isCollectSuccess]);

  /** 將game item 加入/移出 最愛 */
  const onCollect = (item: GameListItemResult) => {
    const { gameId, isFavorite } = item;
    postGameCollect({ gameId: gameId, isCollect: isFavorite ? 0 : 1 });
  };

  /** 判斷game item底部是否需要顯示name */
  const isShowName = (
    item: GameListItemResult,
    showGameName: boolean
  ): boolean => {
    const { name, platform, gameName } = item;
    const hasName = !!name || !!platform || !!gameName;
    const flag = showGameName && hasName;
    return flag;
  };

  // useEffect(() => {}, [isSuccess, data]);

  /**
   * 處理game Item點擊後行為
   * 1.進入廠商的遊戲大廳 2.進入遊戲目錄 3.直接進入遊戲
   */
  const onEnterGame = (item: GameListItemResult) => {
    // 首次用戶 先引導到充值頁面
    const isFirstDeposit = useUserProfileStore.getState().isFirstDeposit;
    if (isFirstDeposit) {
      useGuidanceDepositModalStore.getState().setShowGuidanceDepositModal(true);
      console.log('@@@===> onEnterGame.isFirstDeposit');
      return;
    }

    const {
      gameId: enterGameId,
      platformId,
      enterGameType,
      manufacturer,
      type,
      manufacturerLogoUrl,
    } = item;
    // 1 push morePage 2 push webviewPage
    sdkUtils.playSound();

    const gameId = enterGameId || platformId;

    const handleEnterGame = (gameId: number) => {
      const requestData: EnterGameRequest = {
        gameId: +gameId,
      };
      setShowLoading(true);

      postEnterGame(requestData)
        .then((resp) => {
          if ('data' in resp && resp.data) {
            const data = resp.data;
            const state = {
              id: gameId,
              url: data.url,
              launchType: data.launchType,
            };
            if (data.launchType === LaunchType.REDIRECT) {
              sdkUtils.openBrowser(data.url);
            } else if (enterGameType === EnterGameType.DIRECT) {
              navigate(BasePagePathObj.GamePage, { state: state });
            } else if (enterGameType === EnterGameType.LOBBY) {
              navigate(BasePagePathObj.GameLobbyPage, { state: state });
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          setShowLoading(false);
        });
    };

    // 進入大廳or進入遊戲, 都是去開webview page
    if (enterGameType === EnterGameType.DIRECTORY) {
      // 進入遊戲目錄
      navigate(BasePagePathObj.MoreGamePage, {
        state: {
          manufacturer: manufacturer,
          manufacturerLogoUrl: manufacturerLogoUrl,
          type: type,
        },
      });
    } else {
      handleEnterGame(gameId);
    }
  };

  return {
    onEnterGame,
    onCollect,
    isShowName,
  };
};
