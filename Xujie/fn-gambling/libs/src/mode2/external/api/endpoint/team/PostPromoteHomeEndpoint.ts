import { POST_PROMOTE_HOME_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../../endpoint/ResponseStructure';

interface PromoteHomeResponse {
  PlayerId?: number; // down
  ReferralCode?: string; // down
  ReferralLink?: string; // down
  BonusAmount?: string; // string to number 0.0 // down
  YesterdayPromoteNum?: number; // down
  TodayPromoteNum?: number; // down
  TotalPromoteNum?: number; // down
  TotalRankingReward?: number; // down
  ThisWeekRankingReward?: number; // down
  LastWeekRankingReward?: number; // down
  TotalSalaryReward?: number; // down
  ThisWeekSalaryReward?: number; // down
  LastWeekSalaryReward?: number; // down
  TotalLv1PromoNum?: number; // down
  TotalLv2PromoNum?: number; // down
  Lv1Rate?: string; // string to number 0.0 // down
  Lv2Rate?: string; // string to number 0.0 // down
  Lv3Rate?: string; // string to number 0.0 // down
  IsPlayerWeekRankingRewardEnable?: boolean;

  // unused
  // NumberOfMembers?: number; // unused
  // TotalRevenue?: string; // string to number 0.0 // unused
  // TodayEarnings?: string; // string to number 0.0 // unused
  // YesterdayEarnings?: string; // string to number 0.0 // unused
  // IsAgent?: number; // unused
  // AgentLevel?: number; // unused
  // YesterdayPromoteReward?: string; // string to number 0 // unused
  // YesterdayPromoteReceived?: number; // unused
  // TotalActiveUsers?: number; // unused
  // ThisWeekActiveUsers?: number; // unused
  // LastWeekActiveUsers?: number; // unused
  // TodayPromoteReward?: string; // string to number 0 // unused
}

/**  邀請等級比例, 邀請QRcode資訊, 團隊統計部分資訊 */
export const PostPromoteHomeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PromoteHomeResult, void>({
    query: () => ({
      method: 'post',
      url: POST_PROMOTE_HOME_URL,
      data: {
        reqData: {},
      },
    }),
    transformResponse,
  });

export type TeamMemberSummaryResult = {
  totalCount: number;
  totalLevel1Count: number;
  totalLevel2Count: number;
  todayCount: number;
  yesterdayCount: number;
};

export type RewardSummaryResult = {
  totalReward: number;
  thisWeekReward: number;
  lastWeekReward: number;
};

export type RateInfoResult = {
  level1: number;
  level2: number;
  level3: number;
};

export type ReferralResult = {
  code: string;
  link: string;
};

export type PromoteHomeResult = {
  playerId: number;
  bonusAmount: number;
  rateInfo: RateInfoResult;
  teamMemberSummary: TeamMemberSummaryResult;
  salaryRewardSummary: RewardSummaryResult;
  rankingRewardSummary: RewardSummaryResult;
  // referralInfo: ReferralResult;
  isEnableRankingReward: boolean;
};

const transformResponse = (
  response: ResponseStructure<PromoteHomeResponse>
): PromoteHomeResult => {
  const resp = response.Body;
  return {
    playerId: resp?.PlayerId || 0,
    bonusAmount: Math.floor(Number(resp?.BonusAmount || 0.0)),
    rateInfo: {
      level1: Math.floor(Number(resp?.Lv1Rate || 0) * 10000) / 100,
      level2: Math.floor(Number(resp?.Lv2Rate || 0) * 10000) / 100,
      level3: Math.floor(Number(resp?.Lv3Rate || 0) * 10000) / 100,
    },
    teamMemberSummary: {
      totalCount: resp?.TotalPromoteNum || 0,
      totalLevel1Count: resp?.TotalLv1PromoNum || 0,
      totalLevel2Count: resp?.TotalLv2PromoNum || 0,
      todayCount: resp?.TodayPromoteNum || 0,
      yesterdayCount: resp?.YesterdayPromoteNum || 0,
    },
    salaryRewardSummary: {
      totalReward: resp?.TotalSalaryReward || 0,
      thisWeekReward: resp?.ThisWeekSalaryReward || 0,
      lastWeekReward: resp?.LastWeekSalaryReward || 0,
    },
    rankingRewardSummary: {
      totalReward: resp?.TotalRankingReward || 0,
      thisWeekReward: resp?.ThisWeekRankingReward || 0,
      lastWeekReward: resp?.LastWeekRankingReward || 0,
    },
    // referralInfo: {
    //   code: resp?.ReferralCode || '',
    //   link: resp?.ReferralLink || '',
    // },
    isEnableRankingReward: resp?.IsPlayerWeekRankingRewardEnable || false,
  };
};
