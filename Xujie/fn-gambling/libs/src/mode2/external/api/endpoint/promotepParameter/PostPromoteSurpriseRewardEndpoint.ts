import { ExternalEndpoint } from '@mode2API/types';
import { POST_PROMOTE_SURPRISE_REWARD_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface PromoteSurpriseRewardResponse {
  endTime?: number;
  reward?: number;
  startTime?: number;
}

export interface PromoteSurpriseRewardResult {
  endTime: number;
  reward: number;
  startTime: number;
}

export const PostPromoteSurpriseRewardEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PromoteSurpriseRewardResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_PROMOTE_SURPRISE_REWARD_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PromoteSurpriseRewardResponse>
): PromoteSurpriseRewardResult => {
  const resp = response.Body;

  return {
    endTime: resp?.endTime || 0,
    reward: resp?.reward || 0,
    startTime: resp?.startTime || 0,
  };
};
