import { ExternalEndpoint } from '@mode2API/types';
import { POST_RANKING_RULES_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface RankingRateInfoResponse {
  dailyRate?: number;
  monthlyRate?: number;
  rank?: string;
  weeklyRate?: number;
}

interface RankingRulesResponse {
  dailyTotalRebate?: number;
  weeklyTotalRebate?: number;
  monthlyTotalRebate?: number;
  rankingRates?: RankingRateInfoResponse[];
}

export interface RankingRateInfoResult {
  indexKey: string;
  rank: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
}

export interface RankingRulesResult {
  dailyTotalRebate: number;
  weeklyTotalRebate: number;
  monthlyTotalRebate: number;
  rankingRates: RankingRateInfoResult[];
}

export const PostRankingRulesEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RankingRulesResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_RANKING_RULES_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<RankingRulesResponse>
): RankingRulesResult => {
  const resp = response.Body;
  const rankingRates =
    resp?.rankingRates?.map((item, index) => {
      return {
        indexKey: `${index}_${item?.rank}`,
        rank: item?.rank || '',
        dailyRate: item?.dailyRate || 0,
        weeklyRate: item?.weeklyRate || 0,
        monthlyRate: item?.monthlyRate || 0,
      };
    }) || [];
  return {
    dailyTotalRebate: resp?.dailyTotalRebate || 0,
    weeklyTotalRebate: resp?.weeklyTotalRebate || 0,
    monthlyTotalRebate: resp?.monthlyTotalRebate || 0,
    rankingRates: rankingRates,
  };
};
export default PostRankingRulesEndpoint;
