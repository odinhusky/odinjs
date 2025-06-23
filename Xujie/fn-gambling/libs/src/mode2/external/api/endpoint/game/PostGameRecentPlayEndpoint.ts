import { POST_GAME_RECENT_PLAY_URL } from '@mode2API/urls';
import { ExternalEndpoint } from '@mode2API/types';
import { GameResponse } from '@mode2API/endpoint/game/PostGameHomeEndpoint';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  fillGameListItemMissingValues,
  GameListItemResult,
  mapEnterGameType,
} from '@mode2/zustand/page/hallPageStore';

export const PostGameRecentPlayEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<GameListItemResult[], void>({
    query: () => {
      return {
        method: 'post',
        url: POST_GAME_RECENT_PLAY_URL,
        data: {},
      };
    },

    transformResponse,
  });

const mapGameListInfo = (list: GameResponse[]) => {
  return list.map((item: GameResponse) =>
    fillGameListItemMissingValues({
      name: item?.Name || '',
      platformId: item?.PlatformId || 0,
      gameId: item.GameId || 0,
      isHotGame: item?.IsHot === 1,
      isNewGame: item?.IsNew === 1,
      isFavorite: item?.IsCollect === 1,
      isMaintain: item?.IsMaintain === 1,
      maintainTime:
        item?.MaintainTime && item?.MaintainTime !== '0'
          ? item.MaintainTime
          : '',
      coverImageSrc: item?.Logo || item?.NameLogo || item?.HotLogo || '', // NameLogo是只帶有game name和黑色背景的圖
      manufacturerLogoUrl: item?.NameLogo || '',
      manufacturer: item?.Manufacturer || '',
      enterGameType: mapEnterGameType(
        item?.IsEnterLobby || 0,
        item?.IsGame || 0
      ),
      type: item?.Type || 0,
    })
  );
};

const transformResponse = (
  response: ResponseStructure<GameResponse[]>
): GameListItemResult[] => {
  const resp = response?.Body;
  return mapGameListInfo(resp || []);
};

export default PostGameRecentPlayEndpoint;
