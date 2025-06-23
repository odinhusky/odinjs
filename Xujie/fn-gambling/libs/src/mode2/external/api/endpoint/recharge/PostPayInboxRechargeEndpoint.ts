import { ExternalEndpoint } from '@mode2API/types';
import { POST_PAY_INBOX_RECHARGE_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import {
  PayRechargePayload,
  PayRechargeResponse,
  PayRechargeResult,
} from '@mode2API/endpoint/info/PostPayRechargeEndpoint';

export interface PayInboxRechargePayload extends PayRechargePayload {}

export interface PayInboxRechargeResponse extends PayRechargeResponse {}

export interface PayInboxRechargeResult extends PayRechargeResult {}

export const PostPayInboxRechargeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PayInboxRechargeResult, PayInboxRechargePayload>({
    query: (payload: PayInboxRechargePayload) => {
      const data = {
        amount: payload.amount,
        isReward: payload.isReward ? 1 : 0,
        isTransferInGame: payload.isTransferInGame,
        payConfigName: payload.payConfigName,
        payType: payload.payType,
      };
      return {
        method: 'post',
        url: POST_PAY_INBOX_RECHARGE_URL,
        data: { ...data },
      };
    },
    transformResponse: transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PayInboxRechargeResponse>
): PayInboxRechargeResult => {
  const resp = response?.Body;
  return {
    rechargeUrl: resp?.Data || '',
  };
};
