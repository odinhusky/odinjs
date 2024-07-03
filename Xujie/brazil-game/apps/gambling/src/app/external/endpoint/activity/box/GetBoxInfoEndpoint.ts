import {ExternelEndpoint} from "../../../types";
import {GET_BOX_INFO_URL} from "../../../ApiUrl";
import {ActivityType} from "../ActivityType";

export type BoxInfoStep = {
  status: 'UNCLAIMED' | 'CLAIMED' | 'LOCKED'; // 宝箱状态
  icon: 'icon1' | 'icon2' | 'icon3'; // 宝箱Icon类型
  inviteNum: number; // 有效邀请人数
  rewardAmount: number; // 发放奖励金额
}

export type GetBoxInfoResponseData = {
  enabled: boolean; // 活动是否进行中
  type: ActivityType; // 活动类型
  title: string; // 活动标题
  bannerContext: string; // Banner文案
  content: string; // 活动敘述
  inviteNum: number; // 有效邀请人数
  invitationLink: string; // 邀请链结
  invitationFlag: number; // 是否顯示邀請連結區塊
  rules: {
    rule: 'RECHARGE' | 'BET_FLOW'; // 邀请有效规则
    value: number; // 阀值 金额单位(元)
  }[]; // 有效邀请规则
  steps: BoxInfoStep[]; // 奖励阶梯
}

export type GetBoxInfoResponse = {
  code: number;
  msg: string;
  data: GetBoxInfoResponseData
}



export const GetBoxInfoEndpoint = (builder: ExternelEndpoint) => builder.query<GetBoxInfoResponse, null>({
  query: () => ({
    method: 'get',
    url: GET_BOX_INFO_URL
  })
})