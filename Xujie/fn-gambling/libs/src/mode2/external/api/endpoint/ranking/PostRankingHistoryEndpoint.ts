import { ExternalEndpoint } from '@mode2API/types';
import { POST_RANKING_HISTORY_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { RegisterPayload } from '@mode2API/endpoint/user/PostRegisterEndpoint';

export enum RankingHistoryType {
  D = 'D',
  W = 'W',
  M = 'M',
}

export interface RankingHistoryPayload {
  historyType: RankingHistoryType;
}

interface RankingInfoResponse {
  playerName?: string;
  betAmount?: number;
  rewardAmount?: number;
  ranking?: number;
}

interface RankingHistoryResponse {
  jackpot?: number;
  rankings?: RankingInfoResponse[];
}

export interface RankingHistoryInfoResult {
  indexKey: string;
  playerName: string;
  betAmount: number;
  rewardAmount: number;
  ranking: number;
}

export interface RankingHistoryResult {
  jackpotAmount: number;
  rankings: RankingHistoryInfoResult[];
}

export const PostRankingHistoryEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RankingHistoryResult, RankingHistoryPayload>({
    query: (payload) => {
      return {
        method: 'post',
        url: POST_RANKING_HISTORY_URL,
        data: {
          period: payload.historyType,
        },
      };
    },
    transformResponse,
  });
const transformResponse = (
  response: ResponseStructure<RankingHistoryResponse>,
  meta: unknown,
  arg: RankingHistoryPayload
): RankingHistoryResult => {
  const resp = response.Body;
  const rankings =
    resp?.rankings?.map((item, index) => {
      return {
        indexKey: `${arg.historyType}_${index}_${item?.ranking}_${item?.playerName}`,
        playerName: item?.playerName || '',
        betAmount: item?.betAmount || 0,
        rewardAmount: item?.rewardAmount || 0,
        ranking: item?.ranking || 0,
      };
    }) || [];
  return {
    jackpotAmount: resp?.jackpot || 0,
    rankings: rankings,
  };
};

export default PostRankingHistoryEndpoint;
