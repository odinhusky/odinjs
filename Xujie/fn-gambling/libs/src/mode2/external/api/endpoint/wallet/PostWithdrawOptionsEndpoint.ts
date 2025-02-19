import { ExternalEndpoint } from '@mode2API/types';
import { POST_WITHDRAW_OPTIONS_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface PostWithdrawOptionItemResponse {
  amount?: number;
}

export interface PostWithdrawOptionsResponse {
  options?: PostWithdrawOptionItemResponse[];
}

export interface WithdrawOptItemResul {
  index: number;
  amount: number;
}

export interface PostWithdrawOptionsResult {
  optItems: WithdrawOptItemResul[];
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
      };
    }) || [];
  return { optItems: optItems };
};
