import { ExternalEndpoint } from '@mode2API/types';
import { POST_PROMOTE_FIRST_CHARGE_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface PromoteFirstChargeResponse {
  amount?: number;
  reward?: number;
}

export interface PromoteFirstChargeInfoResult {
  amount: number;
  reward: number;
  totalAmount: number;
  rebate: number;
}

export interface PromoteFirstChargeResult {
  maxRebate: number;
  items: PromoteFirstChargeInfoResult[];
}

export const PostPromoteFirstChargeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PromoteFirstChargeResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_PROMOTE_FIRST_CHARGE_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PromoteFirstChargeResponse[]>
): PromoteFirstChargeResult => {
  const resp = response.Body;

  const results: PromoteFirstChargeInfoResult[] =
    resp?.slice(0, 4).map((item) => {
      const amount = item?.amount || 0;
      const reward = item?.reward || 0;
      const rebate = amount > 0 ? reward / amount : 0;
      return {
        amount: amount,
        reward: reward,
        totalAmount: amount + reward,
        rebate: Number(rebate.toFixed(2)),
      };
    }) || [];

  const maxRebate =
    results.length > 0 ? Math.max(...results.map((r) => r.rebate)) : 0;

  return {
    maxRebate: maxRebate,
    items: results,
  };
};
