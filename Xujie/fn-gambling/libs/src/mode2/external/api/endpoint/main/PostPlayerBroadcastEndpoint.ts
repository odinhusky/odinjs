import { POST_PLAYER_BROADCAST_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { WinGameItemResult } from '@mode2API/endpoint/game/PostGameHomeEndpoint';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';

interface PlayerBroadcastItemResponse {
  GameId?: number;
  Name?: string;
  Amount?: string;
  Type?: number;
}

type PlayerBroadcastResponse = PlayerBroadcastItemResponse[];

/**
 * 獲取平台上玩家近期活動資訊
 *
 * - 玩家在遊戲B贏了金額Ｃ
 * - 玩家提領了金額C
 */
export const PostPlayerBroadcastEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PlayerBroadcastResult, void>({
    query: () => ({
      method: 'post',
      url: POST_PLAYER_BROADCAST_URL,
    }),

    transformResponse,
  });

export type PlayerBroadcastResult = WinGameItemResult[];

const defaultResult = [] as PlayerBroadcastResult;

const transformResponse = (
  response: ResponseStructure<PlayerBroadcastResponse>
): PlayerBroadcastResult => {
  const resp = response?.Body;
  if (resp) {
    return resp.map((item) => ({
      gameId: item?.GameId || 0,
      name: item?.Name || '',
      amount: extractApiMoneyString(item?.Amount || ''),
      type: item?.Type || 0,
    }));
  }
  return defaultResult;
};
