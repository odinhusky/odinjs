import { ExternalEndpoint } from '@mode2API/types';
import { POST_RANKING_MY_REWARDS_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface RankingMyRewardInfoResponse {
  claimTime?: number;
  period?: string;
  ranking?: number;
  rewardAmount?: number;
}

interface RankingMyRewardsResponse {
  rewards?: RankingMyRewardInfoResponse[];
}

export interface RankingMyRewardInfoResult {
  indexKey: string;
  period: string;
  claimTime: number;
  rewardAmount: number;
}

export interface RankingMyRewardsResult {
  rewards: RankingMyRewardInfoResult[];
}

/**
 * 排行榜，個人紀錄
 * @param builder
 * @constructor
 */
export const PostRankingMyRewardsEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RankingMyRewardsResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_RANKING_MY_REWARDS_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<RankingMyRewardsResponse>
): RankingMyRewardsResult => {
  const resp = response.Body;
  const rewards =
    resp?.rewards?.map((item, index) => {
      return {
        indexKey: `${index}_${item?.claimTime}`,
        period: item?.period || '',
        claimTime: item?.claimTime || 0,
        rewardAmount: item?.rewardAmount || 0,
      };
    }) || [];
  return {
    rewards: rewards,
  };
};

export default PostRankingMyRewardsEndpoint;
