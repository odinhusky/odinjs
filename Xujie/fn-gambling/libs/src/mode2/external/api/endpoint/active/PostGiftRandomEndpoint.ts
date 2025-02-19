import { POST_GIFT_RANDOM_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { ExternalEndpoint } from '@mode2API/types';
import { extractApiMoneyString } from '@libs/commonUtils';

// dev test giftKey
// 9fdaa9bbbb3d460e93c4df3a010f219b
// c1b7fe98235d45bf8b16e869535a04df
// e3488c070ec04ec7a96bc06309121259

export interface GiftRandomRequest {
  giftKey: string;
}

export interface GiftRandomResponse {
  amount?: string;
}

export interface GiftRandomResult {
  redeemAmount: number;
}

export const PostGiftRandomEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<GiftRandomResult, GiftRandomRequest>({
    query: (data: GiftRandomRequest) => ({
      method: 'post',
      url: POST_GIFT_RANDOM_URL,
      data: {
        reqData: { ...data },
      },
    }),
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<GiftRandomResponse>
): GiftRandomResult => {
  const resp = response?.Body;
  const amount = extractApiMoneyString(resp?.amount || '0');
  return {
    redeemAmount: amount,
  };
};
