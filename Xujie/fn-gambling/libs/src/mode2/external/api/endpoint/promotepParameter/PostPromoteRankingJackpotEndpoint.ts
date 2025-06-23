import { ExternalEndpoint } from '@mode2API/types';
import { POST_PROMOTE_RANKING_JACKPOT_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface PromoteRankingJackpotRuleResponse {
  rank?: string;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
}

interface PromoteRankingJackpotResponse {
  expiredAt?: number;
  jackpotTo?: number;
  rules?: PromoteRankingJackpotRuleResponse[];
}

export interface PromoteRankingJackpotRateInfoResult {
  indexKey: string;
  rank: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
}

export interface PromoteRankingJackpotResult {
  jackpotAmount: number;
  expiredAt: number;
  rankingRates: PromoteRankingJackpotRateInfoResult[];
}

export const PostPromoteRankingJackpotEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PromoteRankingJackpotResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_PROMOTE_RANKING_JACKPOT_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PromoteRankingJackpotResponse>
): PromoteRankingJackpotResult => {
  const resp = response.Body;
  const rankingRates =
    resp?.rules?.map((item, index) => {
      return {
        indexKey: `${index}_${item?.rank}`,
        rank: item?.rank || '',
        dailyRate: item?.dailyRate || 0,
        weeklyRate: item?.weeklyRate || 0,
        monthlyRate: item?.monthlyRate || 0,
      };
    }) || [];
  return {
    jackpotAmount: resp?.jackpotTo || 0,
    expiredAt: resp?.expiredAt || 0,
    rankingRates: rankingRates,
  };
};
