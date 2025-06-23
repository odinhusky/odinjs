import { ExternalEndpoint } from '@mode2API/types';
import { POST_PROMOTE_VIP_REBATE_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface PostPromoteVipRebateResponse {
  betTime?: number;
  bets?: number;
  rebate?: number;
}

export interface PostPromoteVipRebateResult {
  betTime: number;
  bets: number;
  rebate: number;
}

export const PostPromoteVipRebateEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PostPromoteVipRebateResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_PROMOTE_VIP_REBATE_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PostPromoteVipRebateResponse>
): PostPromoteVipRebateResult => {
  const resp = response.Body;

  return {
    betTime: resp?.betTime || 0,
    bets: resp?.bets || 0,
    rebate: resp?.rebate || 0,
  };
};
