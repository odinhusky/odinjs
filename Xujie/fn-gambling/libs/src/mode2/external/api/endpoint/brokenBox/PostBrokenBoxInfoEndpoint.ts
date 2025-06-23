import { ExternalEndpoint } from '@mode2API/types';
import { POST_BROKEN_BOX_INFO_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface BrokenBoxInfoResponse {
  id?: number;
  reward?: number;
}

export interface BrokenBoxInfoResult {
  offerId: number;
  reward: number;
}

export const PostBrokenBoxInfoEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<BrokenBoxInfoResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_BROKEN_BOX_INFO_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<BrokenBoxInfoResponse>
): BrokenBoxInfoResult => {
  const resp = response.Body;
  return {
    offerId: resp?.id || 0,
    reward: resp?.reward || 0,
  };
};
