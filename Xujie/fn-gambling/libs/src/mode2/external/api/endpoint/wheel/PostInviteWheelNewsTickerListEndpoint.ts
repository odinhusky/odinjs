import { POST_INVITE_WHEEL_NEWS_TICKER_LIST_URL } from '@mode2API/urls';
import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { WheelNewsTickerListResult } from '@mode2API/endpoint/wheel/PostWheelNewsTickerListEndpoint';

interface InviteWheelNewsTickerResponse {
  playerId?: number;
  name?: string;
  amount?: number;
  createTime?: number;
}

// Evan Done
/**
 * [邀請] 輪盤，跑馬燈
 * @param builder
 * @constructor
 */
export const PostInviteWheelNewsTickerListEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<WheelNewsTickerListResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_INVITE_WHEEL_NEWS_TICKER_LIST_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<InviteWheelNewsTickerResponse[]>
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

export default PostInviteWheelNewsTickerListEndpoint;
