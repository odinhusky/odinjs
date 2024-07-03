import { GET_LUCKY_WHEEL_CONFIG_URL } from "../../../ApiUrl";
import { LUCKY_WHEEL_LIST } from "../../../tags";
import { ExternelEndpoint } from "../../../types";
import { EmptyRequest } from "../../../types/Endpoints";

export type LuckyWheelUnit = {
  icon?: string;
  rewardAmount?: number;
  weightPercent?: number | null;
}

export type LuckyWheelConfigsType = {
  level?: 'Silver' | 'Gold' | 'Diamond',
  perSpinCost?: number;
  rewardConfigs?: LuckyWheelUnit[];
}

export type GetLuckyWheelConfigResponseData = {
  title?: string;
  content?: string;
  currentLuckyValue?: number;
  dama?: number;
  luckValue?: number;
  luckyWheelConfigs?: LuckyWheelConfigsType[];
}

export type GetLuckyWheelConfigResponse = {
  code: number;
  msg: string;
  data: GetLuckyWheelConfigResponseData
}

// 獲得轉盤配置
export const GetLuckyWheelConfigEndpoint = (builder: ExternelEndpoint) => builder.query<GetLuckyWheelConfigResponse, EmptyRequest>({
  query: () => ({
    method: 'get',
    url: GET_LUCKY_WHEEL_CONFIG_URL
  }),
  providesTags: [LUCKY_WHEEL_LIST]
})