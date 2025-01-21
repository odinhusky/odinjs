import { POST_PAY_RECHARGE_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';

/**
 * isReward // 1 == top up bouns, 0 == general
 * payConfigName == PostPayConfigInfoWithOptionsEndpoint.payName ||
 * payType // 固定 upi
 */
export type PayRechargeRequest = {
  amount: number;
  isReward: number;
  isTransferInGame: boolean;
  payConfigName: string;
  payType: string;
};

export interface PayRechargeResponse {
  PayChannel?: string;
  PayMode?: string;
  Data?: string;
}

/** 錢包加值 */
export const PostPayRechargeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PayRechargeResult, PayRechargeRequest>({
    query: (data: PayRechargeRequest) => ({
      method: 'post',
      url: POST_PAY_RECHARGE_URL,
      data: {
        reqData: data,
      },
    }),

    transformResponse,
  });

/**
 * if payConfigName="dummypay"
 * => data="https://www.agoda.com"
 *
 * if payConfigName="tpay"
 * => data="https://platform-bucket-in.s3.ap-south-1.amazonaws.com/%E6%B5%8B%E8%AF%95%E7%94%A8/upload/dummy/checkout-page.html?userName=TPAY\\u0026orderNo=PIN1725962297320BA56\\u0026orderAmount=200.00"
 * dummypay和tpay兩者都可以充值成功
 */
type PayRechargeResult = {
  rechargeUrl: string;
};

const defaultResult = {
  rechargeUrl: '',
};

const transformResponse = (
  response: ResponseStructure<PayRechargeResponse>
): PayRechargeResult => {
  const resp = response?.Body;
  if (resp) {
    return {
      rechargeUrl: resp?.Data || defaultResult.rechargeUrl,
    };
  }
  return defaultResult;
};
