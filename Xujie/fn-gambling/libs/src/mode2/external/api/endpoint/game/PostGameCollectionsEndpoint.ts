import { POST_GAME_COLLECTIONS_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';
import {
  GameListItemResult,
  fillGameListItemMissingValues,
  EnterGameType,
} from '@libs/mode2/zustand/page/hallPageStore';

export interface GameCollectionsResponseItem {
  GameId?: number;
  GameName?: string;
  Logo?: string;
  IsCollect?: number;
  IsHot?: number;
  IsNew?: number;
  IsMaintain?: number;
  MaintainTime?: string; // 有可能會傳''或'0'
}

export type GameCollectionsResponse = GameCollectionsResponseItem[];

/** 獲取最愛遊戲列表 */
export const PostGameCollectionsEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<GameCollectionsResult, void>({
    query: () => ({
      method: 'post',
      url: POST_GAME_COLLECTIONS_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

export type GameCollectionsResult = {
  favoriteGameList: GameListItemResult[];
};

const defaultResult = {
  favoriteGameList: [],
};

const transformResponse = (
  response: ResponseStructure<GameCollectionsResponse>
): GameCollectionsResult => {
  const resp = response?.Body;
  if (resp) {
    return {
      favoriteGameList: resp.map((item) => {
        return fillGameListItemMissingValues({
          gameId: item?.GameId || 0,
          gameName: item?.GameName || '',
          coverImageSrc: item?.Logo || '',
          isFavorite: item?.IsCollect === 1,
          isMaintain: item?.IsMaintain === 1,
          maintainTime:
            item?.MaintainTime && item?.MaintainTime !== '0'
              ? item.MaintainTime
              : '',
          enterGameType: EnterGameType.DIRECT, // 能被加到最愛的只有能直接進入的遊戲
        });
      }),
    };
  }
  return defaultResult;
};
