import { GET_LUCKY_WHEEL_LUCKY_VALUE_DETAIL_URL } from "../../../ApiUrl";
import { LUCKY_WHEEL_LIST } from "../../../tags";
import { ExternelEndpoint } from "../../../types";
import { EmptyRequest } from "../../../types/Endpoints";

export type GetLuckyWheelLuckyValueDetailResponseData = {
  totalDama?: number;
  usedLuckyValue?: number;
  expiredLuckyValue?: number;
  availableLuckyValue?: number;
}

export type GetLuckyWheelLuckyValueDetailResponse = {
  code: number;
  msg: string;
  data: GetLuckyWheelLuckyValueDetailResponseData
}

// 轉盤幸運值詳情
export const GetLuckyWheelLuckyValueDetailEndpoint = (builder: ExternelEndpoint) => builder.query<GetLuckyWheelLuckyValueDetailResponse, EmptyRequest>({
  query: () => ({
    method: 'get',
    url: GET_LUCKY_WHEEL_LUCKY_VALUE_DETAIL_URL
  }),
  providesTags: [LUCKY_WHEEL_LIST]
})