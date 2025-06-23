import { ExternalEndpoint } from '@mode2API/types';
import { POST_RANKING_ONGOING_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export enum RankingOngoingType {
  D = 'D',
  W = 'W',
  M = 'M',
}

export interface RankingOngoingPayload {
  ongoingType: RankingOngoingType;
}

interface RankingInfoResponse {
  avatar?: string;
  avatarFrame?: string;
  betAmount?: number;
  lastRanking?: number;
  playerName?: string;
  ranking?: number;
  rewardRate?: number;
}

interface SelfRankingInfoResponse {
  betAmount?: number;
  lastRanking?: number;
  ranking?: number;
  rewardRate?: number;
}

interface RankingOngoingResponse {
  jackpotTo?: number;
  jackpotFrom?: number;
  jackpotRate?: number;
  ranksLeft?: number;
  rankings?: RankingInfoResponse[];
  selfRanking?: SelfRankingInfoResponse;
}

export interface RankingInfoResult {
  avatarId: number;
  playerName: string;
  currentRanking: number;
  lastRanking: number;
  betAmount: number;
  rewardRate: number;
}

export interface MyRankingResult {
  currentRanking: number; // 當前排名
  lastRanking: number; // 上次排名
  betAmount: number; //My bet {8}
  rewardRate: number; // My Reward {0}%
  ranksLeft: number;
}

export interface RankingOngoingResult {
  currentOngoingType: RankingOngoingType;
  jackpotAmount: number; // 視為 to
  jackpotAmountFrom: number; // 視為 from
  jackpotRate: number;

  // 排名
  rankingTop1: RankingInfoResult;
  rankingTop2: RankingInfoResult;
  rankingTop3: RankingInfoResult;
  // 其他排名
  otherRankings: RankingInfoResult[];

  // 個人排行資訊
  myRanking: MyRankingResult;
}

export const defaultRankingInfo: RankingInfoResult = {
  avatarId: 0,
  playerName: '',
  currentRanking: 0,
  lastRanking: 0,
  betAmount: 0,
  rewardRate: 0,
};

export const PostRankingOngoingEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RankingOngoingResult, RankingOngoingPayload>({
    query: (payload) => {
      return {
        method: 'post',
        url: POST_RANKING_ONGOING_URL,
        data: {
          period: payload.ongoingType,
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<RankingOngoingResponse>,
  meta: unknown,
  arg: RankingOngoingPayload
): RankingOngoingResult => {
  const resp = response.Body;

  const rankings =
    resp?.rankings?.map((item) => {
      return {
        avatarId: Number(item?.avatar || '0'),
        playerName: item?.playerName || '',
        currentRanking: item?.ranking || 0,
        lastRanking: item?.lastRanking || 0,
        betAmount: item?.betAmount || 0,
        rewardRate: item?.rewardRate || 0,
      };
    }) || [];

  const rankingTop1 =
    rankings.find((item) => item.currentRanking === 1) || defaultRankingInfo;
  const rankingTop2 =
    rankings.find((item) => item.currentRanking === 2) || defaultRankingInfo;
  const rankingTop3 =
    rankings.find((item) => item.currentRanking === 3) || defaultRankingInfo;
  const otherRankings = rankings.filter((item) => item.currentRanking > 3);

  return {
    currentOngoingType: arg.ongoingType,
    jackpotAmount: resp?.jackpotTo || 0,
    jackpotAmountFrom: resp?.jackpotFrom || 0,
    // jackpotAmountFrom: 0, // Odin Test 用
    jackpotRate: resp?.jackpotRate || 0,

    // 排名
    rankingTop1: rankingTop1,
    rankingTop2: rankingTop2,
    rankingTop3: rankingTop3,
    // 其他排名
    otherRankings: otherRankings,

    // 個人排行資訊
    myRanking: {
      currentRanking: resp?.selfRanking?.ranking || 0,
      lastRanking: resp?.selfRanking?.lastRanking || 0,
      betAmount: resp?.selfRanking?.betAmount || 0,
      rewardRate: resp?.selfRanking?.rewardRate || 0,
      ranksLeft: resp?.ranksLeft || 0, // ??
    },
  };
};

export default PostRankingOngoingEndpoint;
