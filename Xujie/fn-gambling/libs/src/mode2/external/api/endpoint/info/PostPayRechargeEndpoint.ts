import { POST_PAY_RECHARGE_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';

/**
 * isReward // 1 == top up bouns, 0 == general
 * payConfigName == PostPayConfigInfoWithOptionsEndpoint.payName ||
 * payType // 固定 upi
 */
export interface PayRechargePayload {
  amount: number;
  isReward: boolean;
  isTransferInGame: boolean;
  payConfigName: string;
  payType: string;

  isAddon: boolean; // 是否為複充加碼
  baseAmount: number; // 複充加碼金額
}

export interface PayRechargeResponse {
  PayChannel?: string;
  PayMode?: string;
  Data?: string;
}

/**
 * if payConfigName="dummypay"
 * => data="https://www.agoda.com"
 *
 * if payConfigName="tpay"
 * => data="https://platform-bucket-in.s3.ap-south-1.amazonaws.com/%E6%B5%8B%E8%AF%95%E7%94%A8/upload/dummy/checkout-page.html?userName=TPAY\\u0026orderNo=PIN1725962297320BA56\\u0026orderAmount=200.00"
 * dummypay和tpay兩者都可以充值成功
 */
export interface PayRechargeResult {
  rechargeUrl: string;
}

/** 錢包加值 */
export const PostPayRechargeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PayRechargeResult, PayRechargePayload>({
    query: (payload: PayRechargePayload) => {
      return {
        method: 'post',
        url: POST_PAY_RECHARGE_URL,
        data: {
          reqData: {
            amount: payload.amount,
            isReward: payload.isReward ? 1 : 0,
            isTransferInGame: payload.isTransferInGame,
            payConfigName: payload.payConfigName,
            payType: payload.payType,
            isAddon: payload.isAddon ? 1 : 0,
            baseAmount: payload.baseAmount,
          },
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PayRechargeResponse>
): PayRechargeResult => {
  const resp = response?.Body;
  return {
    rechargeUrl: resp?.Data || '',
  };
};
