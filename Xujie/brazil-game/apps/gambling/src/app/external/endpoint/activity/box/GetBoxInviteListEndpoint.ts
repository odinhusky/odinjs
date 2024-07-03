import {ExternelEndpoint} from "../../../types";
import {GET_BOX_INVITE_LIST_URL} from "../../../ApiUrl";

export type GetBoxInviteListResponseDataInvitees = {
  effective: boolean; // 宝箱有效玩家
  invitee: string; // 下级玩家账号
  registerDate: string; // 注册日期
  achievements: {
    rule: 'RECHARGE' | 'BET_FLOW'; // 邀请有效规则
    value: number; // 阀值 金额单位(元)
  }[]; // 达成条件
}

type GetBoxInviteListResponseData = {
  invitees: GetBoxInviteListResponseDataInvitees[]; // 受邀请玩家
  inviteRechargeAmount?: number; // 有效邀请玩家累計充值金額(扣量)
  inviteRechargeNum?: number; // 有效邀請累計充值人数(扣量)
  effectiveDetailDisplay?: boolean // 開關，忽略狀態一率顯示「充值，投注」
}

type GetBoxInviteListResponse = {
  code: number;
  msg: string;
  data: GetBoxInviteListResponseData
}

export const GetBoxInviteListEndpoint = (builder: ExternelEndpoint) => builder.query<GetBoxInviteListResponse, null>({
  query: () => ({
    method: 'get',
    url: GET_BOX_INVITE_LIST_URL
  })
})