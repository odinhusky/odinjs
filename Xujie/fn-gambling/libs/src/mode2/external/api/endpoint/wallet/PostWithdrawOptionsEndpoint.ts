import { ExternalEndpoint } from '@mode2API/types';
import { POST_WITHDRAW_OPTIONS_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface PostWithdrawOptionItemResponse {
  amount?: number;
  fee?: number;
}

export interface PostWithdrawOptionsResponse {
  options?: PostWithdrawOptionItemResponse[];
  withdrawAmount?: number; // 提现手续费
  withdrawRate?: number; // 提现手续费率
}

export interface WithdrawOptItemResul {
  index: number;
  amount: number;
  fee: number;
}

export interface PostWithdrawOptionsResult {
  optItems: WithdrawOptItemResul[];
  // fee: number;
  // feeRate: number;
}

export const PostWithdrawOptionsEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PostWithdrawOptionsResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_WITHDRAW_OPTIONS_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PostWithdrawOptionsResponse>
): PostWithdrawOptionsResult => {
  const resp = response?.Body;
  const optItems =
    resp?.options?.map((item, index) => {
      return {
        index: index,
        amount: item?.amount || 0,
        fee: item?.fee || 0,
      };
    }) || [];
  return {
    optItems: optItems,
    // fee: resp?.withdrawAmount || 0,
    // feeRate: resp?.withdrawRate || 0.0,
  };
};
