import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_INVITATION_TASK_REWARD_LIST_URL } from '@mode2API/urls';

export type TeamInvitationTaskRewardListRequest = {
  time: number; // unix Time
};

export interface TeamInvitationTaskRewardItemResponse {
  commission?: number;
  createTime?: number;
  parentId?: number;
  playerId?: number;
  playerName?: string;
  numberOfInvited?: number;
}

export interface TeamInvitationTaskRewardItemResult {
  joinTime: number; //加入時間
  invitees: number; // 邀請人數
  commissionAmount: number; //佣金
}

export interface TeamInvitationTaskRewardListResult {
  totalCommissionAmount: number; // 總佣金
  items: TeamInvitationTaskRewardItemResult[];
}

/**
 * for 俱樂部 - 邀請任務返佣金紀錄
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostTeamInvitationTaskRewardListEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<
    TeamInvitationTaskRewardListResult,
    TeamInvitationTaskRewardListRequest
  >({
    query: (request) => {
      return {
        method: 'post',
        url: POST_TEAM_INVITATION_TASK_REWARD_LIST_URL,
        data: {
          ...request,
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<TeamInvitationTaskRewardItemResponse[]>
): TeamInvitationTaskRewardListResult => {
  const resp = response?.Body;

  const totalCommissionAmount =
    resp?.reduce(
      (commission, item) => (commission || 0) + (item.commission || 0),
      0
    ) || 0;

  const items =
    resp?.map((item) => {
      return {
        joinTime: item.createTime || 0,
        commissionAmount: item.commission || 0,
        invitees: item.numberOfInvited || 0,
      };
    }) || [];

  return {
    totalCommissionAmount: totalCommissionAmount,
    items: items,
  };
};

export default PostTeamInvitationTaskRewardListEndpoint;
