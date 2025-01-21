import { ExternalEndpoint } from '@mode2API/types';
import { POST_PARTICIPATE_URL } from '@/external/urls';
export type ParticipateResponse = {
  rewardChunk: {
    type: string;
    amount: number;
    damaMultiplier: number;
  };
};
/**
 * for [IN]活动详情
 * @param builder
 * @constructor
 */
export const PostParticipateEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<ParticipateResponse, { campaignId: number }>({
    query: (data) => {
      return {
        method: 'post',
        url: POST_PARTICIPATE_URL,
        data,
      };
    },
  });
