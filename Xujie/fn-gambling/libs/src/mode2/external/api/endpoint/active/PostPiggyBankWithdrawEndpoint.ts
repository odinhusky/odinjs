import { POST_PIGGY_BANK_WITHDRAW_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';

/**
 * @example
 *
 * Success:
 * "{\"Code\":200,\"Msg\":\"\",\"Body\":\"Successfully received bonus!\"}"
 *
 * Failed:
 * "{\"Code\":400,\"Msg\":\"No bets were placed today and cannot be claimed!\",\"Body\":null}"
 */
export type PiggyBankWithdrawResponse = null | string;

/** 存钱罐提取 */
export const PostPiggyBankWithdrawEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PiggyBankWithdrawResult, void>({
    query: () => ({
      method: 'post',
      url: POST_PIGGY_BANK_WITHDRAW_URL,
      data: {
        reqData: {},
      },
    }),
    transformResponse,
  });

export type PiggyBankWithdrawResult = {
  withdrawResultMsg: string;
};

const transformResponse = (
  response: ResponseStructure<PiggyBankWithdrawResponse>
): PiggyBankWithdrawResult => {
  const resp = response?.Body;
  return {
    withdrawResultMsg: resp || '',
  };
};
