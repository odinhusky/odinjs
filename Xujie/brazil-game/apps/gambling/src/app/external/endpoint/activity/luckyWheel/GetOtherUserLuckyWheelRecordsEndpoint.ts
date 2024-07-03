import { GET_OTHER_USER_LUCKY_WHEEL_RECORDS_URL } from "../../../ApiUrl";
import { LUCKY_WHEEL_LIST } from "../../../tags";
import { ExternelEndpoint } from "../../../types";
import { EmptyRequest } from "../../../types/Endpoints";

import { GetUserLuckyWheelRecordsResponseData } from "./GetUserLuckyWheelRecordsEndpoint";

export type GetOtherUserLuckyWheelRecordsResponse = {
  code: number;
  msg: string;
  data: GetUserLuckyWheelRecordsResponseData[]
}

// 其他用戶轉盤紀錄
export const GetOtherUserLuckyWheelRecordsEndpoint = (builder: ExternelEndpoint) => builder.query<GetOtherUserLuckyWheelRecordsResponse, EmptyRequest>({
  query: () => ({
    method: 'get',
    url: GET_OTHER_USER_LUCKY_WHEEL_RECORDS_URL,
  }),
  providesTags: [LUCKY_WHEEL_LIST]
})