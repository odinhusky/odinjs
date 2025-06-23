import { ExternalEndpoint } from '@mode2API/types';
import { POST_INVITE_WHEEL_WITHDRAW_LIST_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface InviteWheelWithdrawResponse {
  withdrawAmount?: number;
  withdrawTime?: number;
  status?: number; //審核狀態 : 0 未審核 1: 通過 2: 拒絕
  refuseCode?: number;
}

export enum InviteWithdrawState {
  COMPLETED = 'COMPLETED', //（已完成）：1
  PROCESSING = 'PROCESSING', //（處理中）0
  FAILED = 'FAILED', //（失敗）2
  CANCELED = 'CANCELED', //（已取消）
  UNKNOWN = 'UNKNOWN', // 未定義，未知
}

export interface InviteWithdrawItemResult {
  amount: number;
  time: number;
  state: InviteWithdrawState; // 只有 COMPLETED
  errorCode: number;
}

export interface InviteWheelWithdrawResult {
  totalRewards: number;
  inviteWithdrawList: InviteWithdrawItemResult[];
}

const mappingState: Record<number, InviteWithdrawState> = {
  [0]: InviteWithdrawState.PROCESSING,
  [1]: InviteWithdrawState.COMPLETED,
  [2]: InviteWithdrawState.FAILED,
};
// Evan Done
/**
 *  邀請輪盤領取紀錄
 * @param builder
 * @constructor
 */
export const PostInviteWheelWithdrawListEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<InviteWheelWithdrawResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_INVITE_WHEEL_WITHDRAW_LIST_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<InviteWheelWithdrawResponse[]>
): InviteWheelWithdrawResult => {
  const resp = response?.Body;

  const inviteWithdrawList =
    resp?.map((item) => {
      const state =
        mappingState[item?.status || 0] || InviteWithdrawState.PROCESSING;
      return {
        amount: item.withdrawAmount || 0,
        time: item.withdrawTime || 0,
        state: state,
        errorCode: item?.refuseCode || 0,
      };
    }) || [];

  const sortedListDesc = inviteWithdrawList.sort((a, b) => b.time - a.time);
  const totalRewards =
    inviteWithdrawList?.reduce(
      (rewards, item) => (rewards || 0) + (item.amount || 0),
      0
    ) || 0;
  return {
    totalRewards: totalRewards,
    inviteWithdrawList: sortedListDesc,
  };
};

export default PostInviteWheelWithdrawListEndpoint;
