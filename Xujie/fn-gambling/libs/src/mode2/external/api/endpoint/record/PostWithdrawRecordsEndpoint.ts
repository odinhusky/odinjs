import { POST_WITHDRAW_RECORDS_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';

export interface WithdrawRecordsRequest {
  limit: number;
  page: number;
}

export interface WithdrawRecordsItemResponse {
  OrderNumber?: string; //"DEV51727250621487633236"
  Amount?: number; // 121
  Date?: number; //1727250621
  Status?: number; // 0
  IsUpi?: number; //1
  Message?: string; // 失敗原因
  FinalTime?: number; // 結束時間，成功與失敗
}

export interface WithdrawRecordsResponse {
  Total?: number;
  Records?: WithdrawRecordsItemResponse[];
}

/** 提現紀錄 */
export const PostWithdrawRecordsEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<WithdrawRecordsResult, WithdrawRecordsRequest>({
    query: (reqData: WithdrawRecordsRequest) => ({
      method: 'post',
      url: POST_WITHDRAW_RECORDS_URL,
      data: {
        reqData,
      },
    }),

    transformResponse,
  });

export enum WithdrawRecordStatus {
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  FAIL_EXPIRED = 'FAIL_EXPIRED',
}

export type WithdrawRecordItemResult = {
  amount: number;
  orderNumber: string;
  status: WithdrawRecordStatus;
  timestamp: number; // 建立訂單時間
  message: string;
  withdrawType: string;
  successTime: number;
  failedTime: number;
  finalTime?: number;
};

type WithdrawRecordsResult = {
  total: number;
  withdrawRecords: WithdrawRecordItemResult[];
};

const defaultResult = {
  total: 0,
  withdrawRecords: [] as WithdrawRecordItemResult[],
};

const recordStateMapping: Record<string, WithdrawRecordStatus> = {
  '0': WithdrawRecordStatus.PROCESSING,
  '1': WithdrawRecordStatus.SUCCESS,
  '2': WithdrawRecordStatus.FAIL,
  '3': WithdrawRecordStatus.FAIL,
  '6': WithdrawRecordStatus.PROCESSING,
  '22': WithdrawRecordStatus.FAIL_EXPIRED,
};

const mapRecordState = (state: string) => {
  return recordStateMapping[state] || WithdrawRecordStatus.FAIL;
};

// const mockDatas = [
//   'IFSC error, please modify the request message or contact',
//   'IFSC error, please modify the request message or contact customer support. Just sample wording.',
//   'IFSC error, please modify the request message or contact customer support. Just sample wording. IFSC error, please modify the request message or contact customer',
//   'IFSC error, please modify the request message or contact customer support. Just sample wording. IFSC error, please modify the request message or contact customer support. Just sample wording.IFSC error, please modify the request message or contact customer support. Just sample wording. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer. IFSC error, please modify the request message or contact customer',
// ];
const transformResponse = (
  response: ResponseStructure<WithdrawRecordsResponse>
): WithdrawRecordsResult => {
  const resp = response?.Body;
  if (resp) {
    return {
      total: resp?.Total || 0,
      withdrawRecords:
        resp.Records?.map((item) => ({
          amount: item?.Amount || 0,
          orderNumber: item?.OrderNumber || '',
          status: mapRecordState(`${item?.Status}`),
          timestamp: item?.Date || 0,
          message: item?.Message || '',
          withdrawType: 'Online', // 無區分。先固定
          successTime: item?.FinalTime || 0,
          failedTime: item?.FinalTime || 0,
          finalTime: item?.FinalTime || 0,
        })) || defaultResult.withdrawRecords,
    };
  }
  return defaultResult;
};
