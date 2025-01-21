import { POST_AGENT_TEAM_STATISTICS_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';

export interface AgentTeamStatisticsResponse {
  RegisterTeam?: number;
  RegisterSub?: number;
  RegisterSon?: number;
  TurnoverTeam?: number;
  TurnoverSub?: number;
  TurnoverSon?: number;
  RechargeTeam?: number;
  RechargeSub?: number;
  RechargeSon?: number;
  IncomeTeam?: number;
  IncomeSub?: number;
  IncomeSon?: number;
  RechargePlayerTeam?: number;
  RechargePlayerSub?: number;
  RechargePlayerSon?: number;
  ActualTurnoverTeam?: number;
  ActualTurnoverSub?: number;
  ActualTurnoverSon?: number;
  Lv1BetPercent?: number;
  Lv1RechargePercent?: number;
  Lv1RebatePercent?: number;
  Lv2BetPercent?: number;
  Lv2RechargePercent?: number;
  Lv2RebatePercent?: number;
}

/** 團隊統計相關資訊 */
export const PostAgentTeamStatisticsEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<AgentTeamStatisticsResult, void>({
    query: () => ({
      method: 'post',
      url: POST_AGENT_TEAM_STATISTICS_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

export type AgentTeamStatisticsResult = {
  betValueInfo: {
    all: number;
    lv1: number;
    lv2: number;
  };
  numberOfDepositInfo: {
    all: number;
    lv1: number;
    lv2: number;
  };
  activeMemberInfo: {
    all: number;
    thisWeek: number;
    lastWeek: number;
  };
  totalCommissionInfo: {
    all: number;
    lv1: number;
    lv2: number;
  };
};

const defaultResult = {
  betValueInfo: {
    all: 0,
    lv1: 0,
    lv2: 0,
  },
  numberOfDepositInfo: {
    all: 0,
    lv1: 0,
    lv2: 0,
  },
  activeMemberInfo: {
    all: 0,
    thisWeek: 0,
    lastWeek: 0,
  },
  totalCommissionInfo: {
    all: 0,
    lv1: 0,
    lv2: 0,
  },
};

const transformResponse = (
  response: ResponseStructure<AgentTeamStatisticsResponse>
): AgentTeamStatisticsResult => {
  const resp = response?.Body;
  if (resp) {
    return {
      betValueInfo: {
        all: resp?.TurnoverTeam || defaultResult.betValueInfo.all,
        lv1: resp?.TurnoverSub || defaultResult.betValueInfo.lv1,
        lv2: resp?.TurnoverSon || defaultResult.betValueInfo.lv2,
      },
      numberOfDepositInfo: {
        all: resp?.RechargeTeam || defaultResult.numberOfDepositInfo.all,
        lv1: resp?.RechargeSub || defaultResult.numberOfDepositInfo.lv1,
        lv2: resp?.RechargeSon || defaultResult.numberOfDepositInfo.lv2,
      },
      activeMemberInfo: {
        all: resp?.RechargePlayerTeam || defaultResult.activeMemberInfo.all,
        thisWeek:
          resp?.RechargePlayerSub || defaultResult.activeMemberInfo.thisWeek,
        lastWeek:
          resp?.RechargePlayerSon || defaultResult.activeMemberInfo.lastWeek,
      },
      totalCommissionInfo: {
        all: resp?.IncomeTeam || defaultResult.totalCommissionInfo.all,
        lv1: resp?.IncomeSub || defaultResult.totalCommissionInfo.lv1,
        lv2: resp?.IncomeSon || defaultResult.totalCommissionInfo.lv2,
      },
    };
  }
  return defaultResult;
};
