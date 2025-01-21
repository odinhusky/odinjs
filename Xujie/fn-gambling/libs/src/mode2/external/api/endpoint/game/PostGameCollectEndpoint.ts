import { POST_GAME_COLLECT_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';

export interface GameCollectRequest {
  gameId: number;
  isCollect: number;
}

/**
 * @example
 *
 * Success:
 * 'Successfully collected games'
 */
export type GameCollectResponse = string;

/** 將遊戲加入最愛列表 */
export const PostGameCollectEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<ResponseStructure<GameCollectResponse>, GameCollectRequest>({
    query: (data: GameCollectRequest) => {
      const reqData = {
        gameId: data.gameId,
        isCollect: data.isCollect,
      };
      return {
        method: 'post',
        url: POST_GAME_COLLECT_URL,
        data: {
          reqData,
        },
      };
    },
  });
