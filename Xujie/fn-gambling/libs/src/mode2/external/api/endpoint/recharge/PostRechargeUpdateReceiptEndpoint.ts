import { ExternalEndpoint } from '@mode2API/types';
import { POST_RECHARGE_UPDATE_RECEIPT_URL } from '@mode2API/urls';
import { ResponseStructure } from '../ResponseStructure';

export type RechargeUpdateReceiptRequest = {
  confirmCode: string; // 填寫的 UTR code
  orderId: string;
};

export type RechargeUpdateReceiptResult = {
  result: string;
};

/**
 * 充值订单异动收据资讯
 * 上報UTR code
 * @param builder
 * @constructor
 */
export const PostRechargeUpdateReceiptEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RechargeUpdateReceiptResult, RechargeUpdateReceiptRequest>({
    query: (request) => {
      return {
        method: 'post',
        url: POST_RECHARGE_UPDATE_RECEIPT_URL,
        data: { ...request },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<string>
): RechargeUpdateReceiptResult => {
  const resp = response?.Body;
  return {
    result: resp || '',
  };
};

export default PostRechargeUpdateReceiptEndpoint;
