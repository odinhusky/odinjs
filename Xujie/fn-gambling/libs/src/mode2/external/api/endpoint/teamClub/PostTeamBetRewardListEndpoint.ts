import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_BET_REWARD_LIST_URL } from '@mode2API/urls';

export type TeamBetRewardListRequest = {
  time: number; // unix Time
};

export interface TeamBetRewardItemResponse {
  commission?: number;
  createTime?: number;
  parentId?: number;
  playerId?: number;
  playerName?: string;
}

export interface TeamBetRewardItemResult {
  joinTime: number; //加入時間
  commissionAmount: number; //佣金
  subordinateId: string; // 下屬ID
}

export interface TeamBetRewardListResult {
  totalCommissionAmount: number; // 總佣金
  items: TeamBetRewardItemResult[];
}

/**
 * for 俱樂部 - 投注反佣金紀錄
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostTeamBetRewardListEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<TeamBetRewardListResult, TeamBetRewardListRequest>({
    query: (request) => {
      return {
        method: 'post',
        url: POST_TEAM_BET_REWARD_LIST_URL,
        data: {
          ...request,
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<TeamBetRewardItemResponse[]>
): TeamBetRewardListResult => {
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
        subordinateId: `${item.playerId}`,
      };
    }) || [];

  return {
    totalCommissionAmount: totalCommissionAmount,
    items: items,
  };
};

export default PostTeamBetRewardListEndpoint;
