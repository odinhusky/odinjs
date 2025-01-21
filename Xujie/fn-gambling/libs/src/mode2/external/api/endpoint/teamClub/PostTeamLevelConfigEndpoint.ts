import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_LEVEL_CONFIG_URL } from '@mode2API/urls';

export interface TeamLevelConfigResponse {
  firstDepositCashback1?: number;
  level?: number;
  rebate1?: number;
  rebate2?: number;
  rebate3?: number;
  requiredBet?: number;
  requiredNum?: number;
}

export interface TeamLevelConfigItemResult {
  level: number; // 等級
  requiredBets: number; // 所需投注 //requiredBet
  requiredMembers: number; // 所需成員 //requiredNum
  firstDepositRebatesRate: number; // 首次充值反水率 // firstDepositCashback1
  // 代理
  agentLevel1RebatesRate: number; // 代理等級1反水率
  agentLevel2RebatesRate: number; // 代理等級2反水率
  agentLevel3RebatesRate: number; // 代理等級1反水率
}

const defaultTeamLevelConfigItems = [0, 1, 2, 3].map((item) => {
  return {
    level: item,
    requiredBets: 0,
    requiredMembers: 0,
    firstDepositRebatesRate: 0,
    // 代理
    agentLevel1RebatesRate: 0,
    agentLevel2RebatesRate: 0,
    agentLevel3RebatesRate: 0,
  };
});

/**
 * for 俱樂部 - 查詢團隊獎勵設定
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostTeamLevelConfigEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<TeamLevelConfigItemResult[], void>({
    query: () => {
      return {
        method: 'post',
        url: POST_TEAM_LEVEL_CONFIG_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<TeamLevelConfigResponse[]>
): TeamLevelConfigItemResult[] => {
  const resp = response?.Body;

  return (
    resp?.map((item) => {
      return {
        level: item.level || 0,
        requiredBets: item.requiredBet || 0,
        requiredMembers: item.requiredNum || 0,
        firstDepositRebatesRate: parseFloat(
          ((item.firstDepositCashback1 || 0) * 100).toFixed(2)
        ),
        agentLevel1RebatesRate: parseFloat(
          ((item.rebate1 || 0) * 100).toFixed(2)
        ),
        agentLevel2RebatesRate: parseFloat(
          ((item.rebate2 || 0) * 100).toFixed(2)
        ),
        agentLevel3RebatesRate: parseFloat(
          ((item.rebate3 || 0) * 100).toFixed(2)
        ),
      };
    }) || defaultTeamLevelConfigItems
  );
};

export default PostTeamLevelConfigEndpoint;
