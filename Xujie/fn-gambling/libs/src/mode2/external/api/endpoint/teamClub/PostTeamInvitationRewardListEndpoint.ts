import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_INVITATION_REWARD_LIST_URL } from '@mode2API/urls';

export type TeamInvitationRewardListRequest = {
  time: number; // unix Time
};

export interface TeamInvitationRewardItemResponse {
  commission?: number;
  createTime?: number;
  parentId?: number;
  playerId?: number;
  playerName?: string;
}

export interface TeamInvitationRewardItemResult {
  joinTime: number; //加入時間
  commissionAmount: number; //佣金
  inviteesId: string; // 受邀者Id
}

export interface TeamInvitationRewardListResult {
  totalCommissionAmount: number; // 總佣金
  items: TeamInvitationRewardItemResult[];
}

/**
 * for 俱樂部 - 邀請返佣金紀錄
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostTeamInvitationRewardListEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<
    TeamInvitationRewardListResult,
    TeamInvitationRewardListRequest
  >({
    query: (request) => {
      return {
        method: 'post',
        url: POST_TEAM_INVITATION_REWARD_LIST_URL,
        data: {
          ...request,
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<TeamInvitationRewardItemResponse[]>
): TeamInvitationRewardListResult => {
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
        inviteesId: `${item.playerId}`,
      };
    }) || [];

  return {
    totalCommissionAmount: totalCommissionAmount,
    items: items,
  };
};

export default PostTeamInvitationRewardListEndpoint;
