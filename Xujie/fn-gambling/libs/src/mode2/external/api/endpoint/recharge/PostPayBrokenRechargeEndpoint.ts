import { ExternalEndpoint } from '@mode2API/types';
import { POST_PAY_BROKEN_RECHARGE_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  PayRechargePayload,
  PayRechargeResponse,
  PayRechargeResult,
} from '@mode2API/endpoint/info/PostPayRechargeEndpoint';

export interface PayBrokenRechargePayload extends PayRechargePayload {}

export interface PayBrokenRechargeResponse extends PayRechargeResponse {}

export interface PayBrokenRechargeResult extends PayRechargeResult {}

export const PostPayBrokenRechargeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PayBrokenRechargeResult, PayBrokenRechargePayload>({
    query: (payload: PayBrokenRechargePayload) => {
      const data = {
        amount: payload.amount,
        isReward: payload.isReward ? 1 : 0,
        isTransferInGame: payload.isTransferInGame,
        payConfigName: payload.payConfigName,
        payType: payload.payType,
      };
      return {
        method: 'post',
        url: POST_PAY_BROKEN_RECHARGE_URL,
        data: { ...data },
      };
    },
    transformResponse: transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PayBrokenRechargeResponse>
): PayBrokenRechargeResult => {
  const resp = response?.Body;
  return {
    rechargeUrl: resp?.Data || '',
  };
};
