import { POST_LUCKY_WHEEL_SPIN_URL } from "../../../ApiUrl";
import { LUCKY_WHEEL_LIST } from "../../../tags";
import { ExternelEndpoint } from "../../../types";

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

export type PostLuckyWheelSpinResponseData = {
  rewardAmount: number
}

export type PostLuckyWheelSpinResponse = {
  code: number;
  msg: string;
  data: PostLuckyWheelSpinResponseData
};

export type LevelType = 'Silver' | 'Gold' | 'Diamond';

export type PostLuckyWheelSpinRequest = {
  level: LevelType;
}

// 獲得轉盤配置
export const PostLuckyWheelSpinEndpoint = (builder: ExternelEndpoint) => builder.mutation<PostLuckyWheelSpinResponse, PostLuckyWheelSpinRequest>({
  query: (requestData: PostLuckyWheelSpinRequest) => ({
    method: 'post',
    url: POST_LUCKY_WHEEL_SPIN_URL,
    data: requestData
  }),
  invalidatesTags: [LUCKY_WHEEL_LIST]
})