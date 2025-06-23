import { POST_RECHARGE_RECORDS_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../../endpoint/ResponseStructure';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';
import dayjs from '@commonUtils/localizedDayjs';
import {
  receiptStateMapping,
  RechargeReceiptState,
} from '../recharge/PostRechargeQueryReceiptEndpoint';

export interface RechargeRecordsRequest {
  limit: number;
  page: number;
}

export interface RechargeRecordsItemResponse {
  OrderNumber?: string; //"DEV01726043646577200767"
  Amount?: string; // "666.00"
  Status?: number; // 1
  Date?: number; //1726043646
  Url?: string;

  Bonus?: number;
  PayType?: string;
  FinalTime?: number;
  ConfirmCode?: string; // 付款確認碼
  ConfirmCodeStatus?: number; // 付款確認碼狀態 0:未確認 1:已確認 2:駁回 3：再確認
}

export interface RechargeRecordsResponse {
  Total?: number;
  Records?: RechargeRecordsItemResponse[];
}

/** 充值紀錄 */
export const PostRechargeRecordsEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RechargeRecordsResult, RechargeRecordsRequest>({
    query: (reqData) => ({
      method: 'post',
      url: POST_RECHARGE_RECORDS_URL,
      data: {
        reqData,
      },
    }),

    transformResponse,
  });

export enum RechargeRecordStatus {
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

export type RechargeRecordItemResult = {
  amount: number;
  orderNumber: string;
  status: RechargeRecordStatus;
  timestamp: number;

  bonus: number;
  payType: string;
  finalTime?: number; //成功 或失敗時間
  UTRCode?: string;
  UTRState?: RechargeReceiptState;
};

type RechargeRecordsResult = {
  total: number;
  rechargeRecords: RechargeRecordItemResult[];
  inProgressRecharge2h: number; // 兩小時內處理中充值筆數
};

// const defaultResult = {
//   total: 0,
//   rechargeRecords: [] as RechargeRecordItemResult[],
//   rechargeCountLast2Hours: 0
// };

const recordStateMapping: Record<string, RechargeRecordStatus> = {
  '0': RechargeRecordStatus.PROCESSING,
  '1': RechargeRecordStatus.SUCCESS,
  '2': RechargeRecordStatus.FAIL,
  '3': RechargeRecordStatus.FAIL,
};
const mapRecordState = (state: string) => {
  return recordStateMapping[state] || RechargeRecordStatus.FAIL;
};

const mapRecordUTRState = (item: RechargeRecordsItemResponse) => {
  // QA: 沒有付款確認碼，只更新圖片也應該是未上報狀態
  if (!item?.ConfirmCode) return RechargeReceiptState.UNCOMPLETED;

  return (
    receiptStateMapping[
      item?.ConfirmCodeStatus === undefined ? -1 : item?.ConfirmCodeStatus
    ] || RechargeReceiptState.UNCOMPLETED
  );
};

const transformResponse = (
  response: ResponseStructure<RechargeRecordsResponse>
): RechargeRecordsResult => {
  const resp = response?.Body;
  const rechargeRecords =
    resp?.Records?.map((item) => ({
      amount: extractApiMoneyString(item?.Amount || '0'),
      orderNumber: item?.OrderNumber || '',
      status: mapRecordState(`${item?.Status}`),
      timestamp: item?.Date || 0,

      bonus: item?.Bonus || 0,
      payType: item?.PayType || '',
      finalTime: item?.FinalTime || 0,

      UTRCode: item?.ConfirmCode || '',
      UTRState: mapRecordUTRState(item),
    })) || [];

  const now = dayjs().unix(); // 當前時間（秒）
  const twoHoursAgo = now - 2 * 60 * 60; // 兩小時前的時間戳
  const inProgressRecharge2h = rechargeRecords.filter(
    ({ timestamp, status }) =>
      timestamp * 1000 > twoHoursAgo &&
      status === RechargeRecordStatus.PROCESSING
  ).length;

  return {
    total: resp?.Total || 0,
    rechargeRecords: rechargeRecords,
    inProgressRecharge2h: inProgressRecharge2h,
  };
};
