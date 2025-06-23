import { ExternalEndpoint } from '@mode2API/types';
import { POST_VIP_CLAIM_REBATE_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export const PostVipClaimRewardEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<string, void>({
    query: () => ({
      method: 'post',
      url: POST_VIP_CLAIM_REBATE_URL,
      data: {},
    }),
    transformResponse,
  });

const transformResponse = (response: ResponseStructure<string>): string => {
  const resp = response?.Body;
  return resp || '';
};
