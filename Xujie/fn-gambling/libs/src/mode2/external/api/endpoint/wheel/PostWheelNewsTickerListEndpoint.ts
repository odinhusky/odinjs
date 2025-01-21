import { POST_WHEEL_NEWS_TICKER_LIST_URL } from '@mode2API/urls';
import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface WheelNewsTickerResponse {
  playerId?: number;
  name?: string;
  amount?: number;
  createTime?: number;
}

export interface WheelNewsTickerResult {
  name: string;
  winAmount: number;
}

export interface WheelNewsTickerListResult {
  newsTickerList: WheelNewsTickerResult[];
}

// Evan Done
/**
 * [充值] 輪盤，跑馬燈
 * @param builder
 * @constructor
 */
export const PostWheelNewsTickerListEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<WheelNewsTickerListResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_WHEEL_NEWS_TICKER_LIST_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<WheelNewsTickerResponse[]>
): WheelNewsTickerListResult => {
  const resp = response?.Body;
  const newsTickerList =
    resp?.map((item) => {
      return {
        // playerId: item.playerId || 0,
        name: item.name || '',
        winAmount: item.amount || 0,
        // createTime: item.createTime || 0,
      };
    }) || [];
  return {
    newsTickerList: newsTickerList,
  };
};

export default PostWheelNewsTickerListEndpoint;
