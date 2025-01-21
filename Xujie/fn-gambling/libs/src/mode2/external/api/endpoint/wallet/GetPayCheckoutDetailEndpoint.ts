import { ExternalEndpoint } from '@mode2API/types';
import { GET_PAY_CHECKOUT_DETAIL_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

type PayCheckoutDetailRequest = {
  txId: string;
};

interface PayCheckoutDetailResponse {
  payTxId?: string;
  orderId?: string;
  payAmount?: string;
  payType?: string;
  currency?: string;
  payAddress?: string;
  expirationTime?: number;
  exchangeRate?: number;
  crypto?: boolean;
  cryptoNetwork?: string;

  payMethod?: string;
  payUrl?: string;
  status?: number;
}

// for polling pay state
export enum PayCheckoutDetailStateResult {
  PENDING = 0,
  SUCCESS = 1,
  FAILED = 2,
}

export type PayCheckoutDetailResult = {
  payTxId: string;
  orderId: string;
  payAmount: number;
  payType: string;
  currency: string;
  payAddress: string;
  expirationTime: number;
  exchangeRate: number;
  crypto: boolean;
  cryptoNetwork: string;

  payMethod: string;
  payUrl: string;
  status: PayCheckoutDetailStateResult | number;
};
export const GetPayCheckoutDetailEndpoint = (builder: ExternalEndpoint) =>
  builder.query<PayCheckoutDetailResult, PayCheckoutDetailRequest>({
    query: (params: PayCheckoutDetailRequest) => ({
      method: 'get',
      url: GET_PAY_CHECKOUT_DETAIL_URL,
      params: params,
    }),

    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PayCheckoutDetailResponse>
): PayCheckoutDetailResult => {
  const resp = response.Body;

  return {
    payTxId: resp?.payTxId || '',
    orderId: resp?.orderId || '',
    payAmount: Number(resp?.payAmount || 0),
    payType: resp?.payType || '',
    currency: resp?.currency || '',
    payAddress: resp?.payAddress || '',
    expirationTime: resp?.expirationTime || 0,

    exchangeRate: resp?.exchangeRate || 0,
    crypto: resp?.crypto || false,
    cryptoNetwork: resp?.cryptoNetwork || '',
    payMethod: resp?.cryptoNetwork || '',
    payUrl: resp?.payUrl || '',
    status: resp?.status || PayCheckoutDetailStateResult.PENDING,
  };
};
