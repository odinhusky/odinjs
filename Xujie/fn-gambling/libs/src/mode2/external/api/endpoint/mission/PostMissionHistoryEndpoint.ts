import { ExternalEndpoint } from '@mode2API/types';
import { POST_MISSION_HISTORY_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export enum MissionHistoryPeriod {
  TODAY = 0,
  // YESTERDAY = 2,
  THIS_WEEK = 7,
  // LAST_WEEK = 4,
  THIS_MONTH = 30,
  // LAST_MONTH = 6,
}

export interface MissionHistoryPayload {
  // period: number; // 1: 今天 2: 昨天 3: 本週 4: 上週 5: 本月 6: 上月
  period: MissionHistoryPeriod;
}

interface MissionHistoryInfoResponse {
  // activityValue?: number;
  claimTime?: number;
  claimWay?: string;
  name?: string;
  reward?: number;
  source?: string;
}

export interface MissionHistoryResponse {
  totalReward?: number;
  rewardList?: MissionHistoryInfoResponse[];
}

export interface MissionHistoryInfoResult {
  indexKey: string;
  // vigor: number; //活跃度
  claimTime: number; //领取时间
  claimWay: string; //领取方式
  title: string;
  rewardAmount: number;
  source: string;
}

export interface MissionHistoryResult {
  period: MissionHistoryPeriod;
  totalRewardAmount: number;
  rewardList: MissionHistoryInfoResult[];
}

export const PostMissionHistoryEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<MissionHistoryResult, MissionHistoryPayload>({
    query: (payload) => {
      const interval = payload.period;
      return {
        method: 'post',
        url: POST_MISSION_HISTORY_URL,
        data: { interval: interval },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<MissionHistoryResponse>,
  meta: unknown,
  arg: MissionHistoryPayload
): MissionHistoryResult => {
  const resp = response.Body;

  const rewardList: MissionHistoryInfoResult[] =
    resp?.rewardList?.map((item, index) => {
      return {
        indexKey: `${index}_${item.claimTime}`,
        // vigor: item?.activityValue || 0,
        claimTime: item?.claimTime || 0,
        claimWay: item?.claimWay || '',
        title: item?.name || '',
        rewardAmount: item?.reward || 0,
        source: item?.source || '',
      };
    }) || [];
  return {
    period: arg.period,
    totalRewardAmount: resp?.totalReward || 0,
    rewardList: rewardList,
  };
};
