import { POST_AGENT_WEEK_RANKING_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';

export interface AgentWeekRankingRequest {
  weekType?: number; // -1: last week, 不帶參數: this week
}

interface AgentWeekRankingListItemResponse {
  Ranking?: number;
  PlayerId?: string;
  TeamTurnover?: string; //"₹24,000"
  ActiveUser?: number;
  RankingReward?: string; //"₹4,001"
}

export interface AgentWeekRankingResponse {
  RankingList?: AgentWeekRankingListItemResponse[];
  CountDown?: number;
  PlayerId?: number;
  RankingRewards?: string; //"₹0"
  ThisWeekRanking?: null; // TODO: 補上非null時結構
  LastWeekRanking?: null; // TODO: 補上非null時結構
}

/** 每週排名獎勵列表資料 */
export const PostAgentWeekRankingEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<AgentWeekRankingResult, AgentWeekRankingRequest>({
    query: (reqData) => ({
      method: 'post',
      url: POST_AGENT_WEEK_RANKING_URL,
      data: {
        reqData: reqData,
      },
    }),

    transformResponse,
  });

type RankingItemResult = {
  ranking: number;
  id: string;
  betAmount: number;
  bonus: number;
};

export type AgentWeekRankingResult = {
  rankingBonus: number;
  countDownSec: number; // 剩餘秒數
  rankingList: RankingItemResult[];
};

const defaultResult = {
  rankingBonus: 0,
  countDownSec: 0,
  rankingList: [],
};

const transformResponse = (
  response: ResponseStructure<AgentWeekRankingResponse>
): AgentWeekRankingResult => {
  const resp = response?.Body;
  if (resp) {
    return {
      rankingBonus: extractApiMoneyString(resp?.RankingRewards || '0'),
      countDownSec: resp?.CountDown || defaultResult.countDownSec,
      rankingList:
        resp?.RankingList?.map((item) => {
          return {
            ranking: item?.Ranking || 0,
            id: item?.PlayerId || '',
            betAmount: extractApiMoneyString(item?.TeamTurnover || '0'),
            bonus: extractApiMoneyString(item?.RankingReward || '0'),
          };
        }) || defaultResult.rankingList,
    };
  }
  return defaultResult;
};
