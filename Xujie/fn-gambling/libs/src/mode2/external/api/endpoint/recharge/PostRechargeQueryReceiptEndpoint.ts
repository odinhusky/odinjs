import { ExternalEndpoint } from '@mode2API/types';
import { POST_RECHARGE_QUERY_RECEIPT_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export type RechargeQueryReceiptRequest = {
  orderId: string; // 訂單編號
};

interface RechargeQueryReceiptResponse {
  confirmCode?: string;
  confirmCodeStatus?: number;
  fileBase64?: string;
  fileExtension?: string;
  rejectRsn?: string;
}

export enum RechargeReceiptState {
  UNCOMPLETED = 'UNCOMPLETED', // (無上報過) -1， 後端回應 Body會是null
  COMPLETED = 'COMPLETED', //（已完成) 1
  PROCESSING = 'PROCESSING', //（處理中）0, 3
  REJECTED = 'REJECTED', //（拒絕）2
}

export interface RechargeQueryReceiptResult {
  confirmCode: string; // 已經上傳的 utr code
  state: RechargeReceiptState; // 狀態
  receiptFileBase64: string; // 已上傳檔案
  rejectMessage: string; // 拒絕原因
}

const receiptStateMapping: Record<number, RechargeReceiptState> = {
  [-1]: RechargeReceiptState.UNCOMPLETED,
  [0]: RechargeReceiptState.PROCESSING,
  [1]: RechargeReceiptState.COMPLETED,
  [2]: RechargeReceiptState.REJECTED,
  [3]: RechargeReceiptState.PROCESSING,
};

/**
 * 查询订单收据明细
 * @param builder
 * @constructor
 */
export const PostRechargeQueryReceiptEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RechargeQueryReceiptResult, RechargeQueryReceiptRequest>({
    query: (request) => {
      return {
        method: 'post',
        url: POST_RECHARGE_QUERY_RECEIPT_URL,
        data: { ...request },
      };
    },
    transformResponse: transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<RechargeQueryReceiptResponse>
): RechargeQueryReceiptResult => {
  const resp = response?.Body;
  const state =
    receiptStateMapping[
      resp?.confirmCodeStatus === undefined ? -1 : resp?.confirmCodeStatus
    ] || RechargeReceiptState.UNCOMPLETED;
  return {
    confirmCode: resp?.confirmCode || '',
    state: state,
    receiptFileBase64: resp?.fileBase64 || '',
    rejectMessage: resp?.rejectRsn || '',
  };
};

export default PostRechargeQueryReceiptEndpoint;
