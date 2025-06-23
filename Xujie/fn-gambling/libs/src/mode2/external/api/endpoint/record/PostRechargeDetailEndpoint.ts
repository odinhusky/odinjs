import { ExternalEndpoint } from '@mode2API/types';
import { POST_RECHARGE_DETAIL_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export interface RechargeDetailPayload {
  orderId: string;
}

export enum RechargeOrderStatus {
  PENDING = 'PENDING', // 待支付 0
  SUCCESS = 'SUCCESS', // 支付成功 1
  FAILED = 'FAILED', // 支付失败 2
  CREATION_FAILED = 'CREATION_FAILED', // 订单生成失败3
}

interface RechargeDetailResponse {
  amount?: number;
  confirmTime?: number;
  createTime?: number;
  orderId?: string;
  payType?: string;
  status?: number; //0待支付1支付成功2支付失败3订单生成失败
}

export interface RechargeDetailResult {
  amount: number;
  orderId: string;
  payType: string;
  createTime: number; // 訂單生成時間
  confirmTime: number; // 處理失敗時間 || 處理成功時間
  orderStatus: RechargeOrderStatus; // 訂單狀態
}

const stateMapping: Record<number, RechargeOrderStatus> = {
  [0]: RechargeOrderStatus.PENDING, //待支付
  [1]: RechargeOrderStatus.SUCCESS, //支付成功
  [2]: RechargeOrderStatus.FAILED, //2支付失败
  [3]: RechargeOrderStatus.CREATION_FAILED, //订单生成失败
};

export const PostRechargeDetailEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RechargeDetailResult, RechargeDetailPayload>({
    query: (payload) => {
      return {
        method: 'post',
        url: POST_RECHARGE_DETAIL_URL,
        data: {
          ...payload,
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<RechargeDetailResponse>
): RechargeDetailResult => {
  const resp = response?.Body;
  const orderStatus =
    stateMapping[resp?.status || 0] || RechargeOrderStatus.PENDING;
  return {
    orderId: resp?.orderId || '',
    amount: resp?.amount || 0,
    payType: resp?.payType || '',
    createTime: resp?.createTime || 0,
    confirmTime: resp?.confirmTime || 0,
    orderStatus: orderStatus,
  };
};
