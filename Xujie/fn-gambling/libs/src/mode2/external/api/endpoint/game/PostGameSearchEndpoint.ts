import { POST_GAME_SEARCH_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';
import {
  GameListItemResult,
  fillGameListItemMissingValues,
  mapEnterGameType,
} from '@libs/mode2/zustand/page/hallPageStore';

export interface GameSearchRequest {
  gameName: string;
  gameType: number;
  limit: number;
  manufacturer: string;
  page: number;
}

export interface GameSearchResponseItem {
  GameId?: number;
  Name?: string;
  Logo?: string;
  HotLogo?: string;
  ActiveLoge?: string;
  IsCollect?: number;
  IsMaintain?: number;
  MaintainTime?: string; // 有可能會傳''或'0'
  IsHot?: number;
  IsNew?: number;
  IsNotBet?: number;
  Type?: number;
  Manufacturer?: string;
  IsEnterLobby?: number;
  NameLogo?: string;
  ParentManufacturer?: string;
  IsGame?: number;
  PcLogo?: string;
}

export type GameSearchResponse = GameSearchResponseItem[];

/** 透過分頁方式獲取特定類型的遊戲列表 */
export const PostGameSearchEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<GameSearchResult, GameSearchRequest>({
    query: (data: GameSearchRequest) => ({
      method: 'post',
      url: POST_GAME_SEARCH_URL,
      data: {
        reqData: data,
      },
    }),

    transformResponse,
  });

export type GameSearchResult = GameListItemResult[];

const defaultResult = [] as GameSearchResult;

const transformResponse = (
  response: ResponseStructure<GameSearchResponse>
): GameSearchResult => {
  const resp = response?.Body;
  if (resp) {
    return resp.map((item) =>
      fillGameListItemMissingValues({
        gameId: item.GameId || 0,
        name: item.Name || '',
        coverImageSrc: item.Logo || item.NameLogo, // NameLogo是只帶有game name和黑色背景的圖
        isFavorite: item.IsCollect === 1,
        isMaintain: item?.IsMaintain === 1,
        maintainTime:
          item?.MaintainTime && item?.MaintainTime !== '0'
            ? item.MaintainTime
            : '',
        type: item.Type || 0,
        manufacturer: item.Manufacturer || '',
        enterGameType: mapEnterGameType(
          item.IsEnterLobby || 0,
          item.IsGame || 0
        ),
      })
    );
  }
  return defaultResult;
};
