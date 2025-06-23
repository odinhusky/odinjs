import { ExternalEndpoint } from '@mode2API/types';
import { POST_GAME_ALL_URL } from '@mode2API/urls';

import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  fillGameListItemMissingValues,
  GameListItemResult,
  mapEnterGameType,
} from '@mode2/zustand/page/hallPageStore';
import { GameResponse } from '@mode2API/endpoint/user/PostHomeEndpoint';

interface GameAllResponse {
  Games?: GameResponse[];
}

export interface GameAllResult {
  allGames: GameListItemResult[];
}

export const PostGameAllEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<GameAllResult, void>({
    query: () => {
      const reqData = {
        reqData: {},
      };
      return {
        method: 'post',
        url: POST_GAME_ALL_URL,
        data: reqData,
      };
    },

    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<GameAllResponse>
): GameAllResult => {
  const resp = response?.Body;
  const games =
    resp?.Games?.map((item: GameResponse) =>
      fillGameListItemMissingValues({
        name: item.Name,
        platform: item?.Platform,
        platformId: item?.PlatformId,
        gameId: item.GameId || 0,
        isHotGame: item.IsHot === 1,
        isNewGame: item.IsNew === 1,
        isMaintain: item?.IsMaintain === 1,
        maintainTime:
          item?.MaintainTime && item?.MaintainTime !== '0'
            ? item.MaintainTime
            : '',
        coverImageSrc: item.Logo || item.NameLogo, // NameLogo是只帶有game name和黑色背景的圖
        manufacturerLogoUrl: item.NameLogo,
        manufacturer: item.Manufacturer,
        enterGameType: mapEnterGameType(
          item.IsEnterLobby || 0,
          item.IsGame || 0
        ),
        type: item.Type,
      })
    ) || [];

  // 排序 hot & new
  const sortGames = games.sort((a, b) => {
    const scoreA = (a.isHotGame ? 2 : 0) + (a.isNewGame ? 1 : 0);
    const scoreB = (b.isHotGame ? 2 : 0) + (b.isNewGame ? 1 : 0);
    return scoreB - scoreA; // 分数高的排前面
  });

  return {
    allGames: sortGames,
  };
};
