import { POST_GAME_HOME_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';
import {
  GameListItemResult,
  fillGameListItemMissingValues,
  mapEnterGameType,
} from '@libs/mode2/zustand/page/hallPageStore';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';

interface IGameResponse {
  GameId?: number;
  Name?: string;
  Type?: number;
}

export interface GameResponse extends IGameResponse {
  Logo?: string;
  HotLogo?: string;
  ActiveLoge?: string;
  IsCollect?: number;
  IsMaintain?: number;
  MaintainTime?: string; // 有可能會傳''或'0'
  IsHot?: number;
  IsNew?: number;
  IsNotBet?: number;
  Manufacturer?: string;
  IsEnterLobby?: number;
  NameLogo?: string;
  ParentManufacturer?: string;
  IsGame?: number;
  PcLogo?: string;
  PlatformId?: number;
}

interface WinGameResponse extends IGameResponse {
  Amount?: string;
}

interface GameHomeResponse {
  MaintainMap?: null;
  Histories?: GameResponse[];
  Collections?: GameResponse[];
  HotGames?: GameResponse[];
  WinGames?: WinGameResponse[];
}

/** 獲取熱門遊戲列表 */
export const PostGameHomeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<HomeGameResult, void>({
    query: () => {
      const reqData = {
        reqData: {},
      };
      return {
        method: 'post',
        url: POST_GAME_HOME_URL,
        data: reqData,
      };
    },

    transformResponse,
  });

export type WinGameItemResult = {
  gameId: number;
  name: string;
  amount: number;
  type: number;
};

export type HomeGameResult = {
  hotGames: GameListItemResult[];
  winGames: WinGameItemResult[];
};

const defaultResult = {
  hotGames: [],
  winGames: [],
};

const mapWinGames = (raw: WinGameResponse[]): WinGameItemResult[] => {
  return raw
    .map((item) => ({
      gameId: item?.GameId || 0,
      name: item?.Name || '',
      amount: extractApiMoneyString(item?.Amount || '0'),
      type: item?.Type || 0,
    }))
    .filter((item) => {
      return item.amount > 0;
    });
};

const mapGameListInfo = (raw: GameResponse[]) => {
  return raw.map((item: GameResponse) =>
    fillGameListItemMissingValues({
      name: item?.Name || '',
      gameId: item?.GameId || 0,
      isHotGame: item?.IsHot === 1,
      isNewGame: item?.IsNew === 1,
      isFavorite: item?.IsCollect === 1,
      isMaintain: item?.IsMaintain === 1,
      maintainTime:
        item?.MaintainTime && item?.MaintainTime !== '0'
          ? item.MaintainTime
          : '',
      platform: item?.Manufacturer || item?.Name || '', // hotgame 沒有 platform，前端友善防呆
      coverImageSrc: item?.HotLogo || '',
      manufacturerLogoUrl: item?.NameLogo || '',
      manufacturer: item?.Manufacturer || '',
      enterGameType: mapEnterGameType(item.IsEnterLobby || 0, item.IsGame || 0),
      type: item?.Type || 0,
      platformId: item?.PlatformId || 0,
    })
  );
};

const transformResponse = (
  response: ResponseStructure<GameHomeResponse>
): HomeGameResult => {
  const resp = response?.Body;
  if (resp) {
    return {
      hotGames: mapGameListInfo(resp?.HotGames || []) || [],
      winGames: mapWinGames(resp?.WinGames || []) || [],
    };
  }
  return defaultResult;
};
