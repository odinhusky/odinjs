import { ExternalEndpoint } from '@mode2API/types';
import { POST_INVITE_WHEEL_WITHDRAW_LIST_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface InviteWheelWithdrawResponse {
  withdrawAmount?: number;
  withdrawTime?: number;
}

export enum InviteWithdrawState {
  COMPLETED = 'COMPLETED', //（已完成）：
  PROCESSING = 'PROCESSING', //（處理中）
  FAILED = 'FAILED', //（失敗）
  CANCELED = 'CANCELED', //（已取消）
  UNKNOWN = 'UNKNOWN', // 未定義，未知
}

export interface InviteWithdrawItemResult {
  amount: number;
  time: number;
  state: InviteWithdrawState; // 只有 COMPLETED
}

export interface InviteWheelWithdrawResult {
  inviteWithdrawList: InviteWithdrawItemResult[];
}

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
      return {
        amount: item.withdrawAmount || 0,
        time: item.withdrawTime || 0,
        state: InviteWithdrawState.COMPLETED,
      };
    }) || [];

  const sortedListDesc = inviteWithdrawList.sort((a, b) => b.time - a.time);
  return {
    inviteWithdrawList: sortedListDesc,
  };
};

export default PostInviteWheelWithdrawListEndpoint;
