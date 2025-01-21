import { POST_VIP_RECEIVE_MONTHLY_AWARD_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';

/**
 * @example
 *
 * "{\"Code\":200,\"Msg\":\"\",\"Body\":\"Successful operation\"}"
 */
export type VIPReceiveMonthlyAwardResponse = string;

/** VIP當前等級每月獎勵 */
export const VIPReceiveMonthlyAwardEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<VIPReceiveMonthlyAwardResult, void>({
    query: () => ({
      method: 'post',
      url: POST_VIP_RECEIVE_MONTHLY_AWARD_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

type VIPReceiveMonthlyAwardResult = {
  isReceiveSuccess: boolean;
};

const transformResponse = (
  response: ResponseStructure<string>
): VIPReceiveMonthlyAwardResult => {
  return {
    isReceiveSuccess: response?.Code === 200,
  };
};
