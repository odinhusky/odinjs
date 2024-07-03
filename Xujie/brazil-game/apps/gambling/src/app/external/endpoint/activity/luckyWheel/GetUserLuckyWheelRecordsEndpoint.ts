import { GET_USER_LUCKY_WHEEL_RECORDS_URL } from '../../../ApiUrl';
import { LUCKY_WHEEL_LIST } from '../../../tags';
import { ExternelEndpoint } from '../../../types';
import { EmptyRequest } from '../../../types/Endpoints';
import { LevelType } from './PostLuckyWheelSpinEndpoint';

export type GetUserLuckyWheelRecordsResponseData = {
  id?: number;
  date?: string;
  description?: string;
  rewardAmount?: number;
  level?: LevelType;
};

export type GetUserLuckyWheelRecordsResponse = {
  code: number;
  msg: string;
  data: GetUserLuckyWheelRecordsResponseData[];
};

// 用戶轉盤紀錄
export const GetUserLuckyWheelRecordsEndpoint = (builder: ExternelEndpoint) =>
  builder.query<GetUserLuckyWheelRecordsResponse, EmptyRequest>({
    query: () => ({
      method: 'get',
      url: GET_USER_LUCKY_WHEEL_RECORDS_URL,
    }),
    providesTags: [LUCKY_WHEEL_LIST],
  });
