import { POST_PIGGY_BANK_DETAIL_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';

export interface IPiggyBankDetailResponse {
  Amount?: number;
  AllAmount?: number;
}

/** 存钱罐可領取金額資訊 */
export const PostPiggyBankDetailEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PiggyBankDetailResult, void>({
    query: () => ({
      method: 'post',
      url: POST_PIGGY_BANK_DETAIL_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

export type PiggyBankDetailResult = {
  amount: number;
  allAmount: number;
};

const transformResponse = (
  response: ResponseStructure<IPiggyBankDetailResponse>
): PiggyBankDetailResult => {
  const resp = response?.Body;
  return {
    amount: resp?.Amount || 0,
    allAmount: resp?.AllAmount || 0,
  };
};
