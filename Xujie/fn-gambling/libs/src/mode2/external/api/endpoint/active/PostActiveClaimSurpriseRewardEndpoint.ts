import { ExternalEndpoint } from '@mode2API/types';
import { POST_ACTIVE_CLAIM_SURPRISE_REWARD_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export const PostActiveClaimSurpriseRewardEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<string, void>({
    query: () => ({
      method: 'post',
      url: POST_ACTIVE_CLAIM_SURPRISE_REWARD_URL,
      data: {},
    }),
    transformResponse,
  });

const transformResponse = (response: ResponseStructure<string>): string => {
  const resp = response?.Body;
  return resp || '';
};
