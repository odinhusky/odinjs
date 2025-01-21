import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_DEPOSIT_REWARD_LIST_URL } from '@mode2API/urls';

export type TeamDepositRewardListRequest = {
  time: number; // unix Time
};

export interface TeamDepositRewardItemResponse {
  commission?: number;
  createTime?: number;
  parentId?: number;
  playerId?: number;
  playerName?: string;
}

export interface TeamDepositRewardItemResult {
  joinTime: number; //加入時間
  commissionAmount: number; //佣金
  subordinateId: string; // 下屬ID
}

export interface TeamDepositRewardListResult {
  totalCommissionAmount: number; // 總佣金
  items: TeamDepositRewardItemResult[];
}

/**
 * for [IN] 俱樂部 - 首充返佣金紀錄
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostTeamDepositRewardListEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<TeamDepositRewardListResult, TeamDepositRewardListRequest>({
    query: (request) => {
      return {
        method: 'post',
        url: POST_TEAM_DEPOSIT_REWARD_LIST_URL,
        data: {
          ...request,
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<TeamDepositRewardItemResponse[]>
): TeamDepositRewardListResult => {
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

export default PostTeamDepositRewardListEndpoint;
