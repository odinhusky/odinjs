import { POST_AGENT_WEEK_REWARD_CONFIG_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';

interface AgentWeekRewardConfigsItemsResponse {
  Level?: number;
  ActivePlayer?: string; //"2,639"
  BetAmount?: string; // "₹1,120,000,000"
  RewardAmount?: string; // "₹560,000"
}
export interface AgentWeekRewardConfigResponse {
  AgentWeekRewardConfigs?: AgentWeekRewardConfigsItemsResponse[];
  PlayerId?: number;
  Level?: number;
  WeekRewardAmount?: string; //"₹0"
  LastWeekRewardAmount?: string; //"₹0"
}

/** 邀請周獎勵資料 */
export const PostAgentWeekRewardConfigEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<AgentWeekRewardConfigResult, void>({
    query: () => ({
      method: 'post',
      url: POST_AGENT_WEEK_REWARD_CONFIG_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

type LevelRewardInfoResult = {
  level: number;
  betAmount: number;
  activeMember: number;
  bonus: number;
};

type WeeklyRewardInfoResult = {
  currentLevel: number;
  bonus: number;
  lastWeek: number;
};

export type AgentWeekRewardConfigResult = {
  levelRewardInfoList: LevelRewardInfoResult[];
  weeklyRewardInfo: WeeklyRewardInfoResult;
};

const defaultResult = {
  levelRewardInfoList: [],
  weeklyRewardInfo: {
    currentLevel: 0,
    bonus: 0,
    lastWeek: 0,
  },
};

const transformResponse = (
  response: ResponseStructure<AgentWeekRewardConfigResponse>
): AgentWeekRewardConfigResult => {
  const resp = response?.Body;
  if (resp) {
    return {
      levelRewardInfoList:
        resp?.AgentWeekRewardConfigs?.map((item) => ({
          level: item?.Level || 0,
          betAmount: extractApiMoneyString(item?.BetAmount || '0'),
          activeMember: extractApiMoneyString(item?.ActivePlayer || '0'),
          bonus: extractApiMoneyString(item?.RewardAmount || '0'),
        })) || defaultResult.levelRewardInfoList,
      weeklyRewardInfo: {
        currentLevel:
          resp?.Level || defaultResult.weeklyRewardInfo.currentLevel,
        bonus: extractApiMoneyString(resp?.WeekRewardAmount || ''),
        lastWeek: extractApiMoneyString(resp?.LastWeekRewardAmount || ''),
      },
    };
  }
  return defaultResult;
};
