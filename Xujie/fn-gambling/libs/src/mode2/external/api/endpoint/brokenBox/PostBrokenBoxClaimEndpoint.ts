import { ExternalEndpoint } from '@mode2API/types';
import { POST_BROKEN_BOX_CLAIM_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export interface BrokenBoxClaimPayload {
  offerId: number;
}

export const PostBrokenBoxClaimEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<boolean, BrokenBoxClaimPayload>({
    query: (payload) => {
      return {
        method: 'post',
        url: POST_BROKEN_BOX_CLAIM_URL,
        data: { offerId: payload.offerId },
      };
    },
    transformResponse,
  });

const transformResponse = (response: ResponseStructure<string>): boolean => {
  const resp = response.Body;
  return response.Code === 200;
};
