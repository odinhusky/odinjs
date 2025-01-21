import { POST_RECHARGE_RECORDS_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../../endpoint/ResponseStructure';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';

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
};

type RechargeRecordsResult = {
  total: number;
  rechargeRecords: RechargeRecordItemResult[];
};

const defaultResult = {
  total: 0,
  rechargeRecords: [] as RechargeRecordItemResult[],
};

const recordStateMapping: Record<string, RechargeRecordStatus> = {
  '0': RechargeRecordStatus.PROCESSING,
  '1': RechargeRecordStatus.SUCCESS,
  '2': RechargeRecordStatus.FAIL,
  '3': RechargeRecordStatus.FAIL,
};
const mapRecordState = (state: string) => {
  return recordStateMapping[state] || RechargeRecordStatus.FAIL;
};

const transformResponse = (
  response: ResponseStructure<RechargeRecordsResponse>
): RechargeRecordsResult => {
  const resp = response?.Body;
  if (resp) {
    return {
      total: resp?.Total || 0,
      rechargeRecords:
        resp.Records?.map((item) => ({
          amount: extractApiMoneyString(item?.Amount || '0'),
          orderNumber: item?.OrderNumber || '',
          status: mapRecordState(`${item?.Status}`),
          timestamp: item?.Date || 0,
        })) || defaultResult.rechargeRecords,
    };
  }
  return defaultResult;
};
