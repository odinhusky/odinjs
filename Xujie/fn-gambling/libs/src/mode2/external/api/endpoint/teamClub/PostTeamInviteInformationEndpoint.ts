import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_INVITE_INFORMATION_URL } from '@mode2API/urls';

export interface TeamInviteInformationResponse {
  DailyLimit?: number;
  effectiveNum?: number;
  inviteNum?: number;
  rewardPerPlayer?: number;
  totalInviteReward?: number;
  dailyEffectiveNum?: number;
  inviteRewards?: [
    {
      buildNum?: number;
      requiredNum?: number;
      reward?: number;
    }
  ];
  maxReward?: {
    buildNum?: number;
    requiredNum?: number;
    reward?: number;
  };
}

interface InviteesLevelMilestoneRuleResult {
  isCurrentProgress: boolean; // 當前進度
  isAchieve: boolean; // 是否已經達標
  requiredPeople: number; // 需要數量
  achieveCount: number; // 達標數量
  reward: number; // 達標獎勵
}

export interface TeamInviteInformationResult {
  totalInvitationRewards: number; //總邀請獎勵
  totalInvitees: number; //總邀請人數
  validInvitees: number; //有效邀請人數
  rewardPerInvite: number; //每邀請一人獎勵多少
  dailyValidInvitees: number; // 當日有效邀請人數
  dailyInviteLimit: number; // 每日最大邀請有效數量
  maxInviteCount: number; // 最大邀請數量
  maxInviteRewards: number; // 最大邀請獎勵
  inviteesLevelMilestoneRules: InviteesLevelMilestoneRuleResult[]; // 邀請獎勵里程
}

/**
 * for 俱樂部 - 邀請獎勵資訊
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostTeamInviteInformationEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<TeamInviteInformationResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_TEAM_INVITE_INFORMATION_URL,
        data: {
          reqData: {},
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<TeamInviteInformationResponse>
): TeamInviteInformationResult => {
  const resp = response?.Body;

  const isCurrentProgress =
    resp?.inviteRewards?.findIndex(
      (item) => (item?.buildNum || 0) < (item?.requiredNum || 0)
    ) || 0;
  // 如果所有项目都达标，则返回最后一个索引；否则返回找到的索引
  const currentProgress =
    isCurrentProgress === -1
      ? (resp?.inviteRewards?.length || 1) - 1
      : isCurrentProgress;

  // 格式 [inviteesLevelMilestoneRules]
  const inviteesLevelMilestoneRules: InviteesLevelMilestoneRuleResult[] =
    resp?.inviteRewards?.map((item, index) => {
      const requiredPeople = item?.requiredNum || 0;
      const achieveCount = item?.buildNum || 0;
      const isAchieve = achieveCount >= requiredPeople;
      return {
        isCurrentProgress: currentProgress === index,
        isAchieve: isAchieve,
        achieveCount: achieveCount,
        requiredPeople: requiredPeople,
        reward: item?.reward || 0,
      };
    }) || [];

  return {
    totalInvitationRewards: resp?.totalInviteReward || 0,
    totalInvitees: resp?.inviteNum || 0,
    validInvitees: resp?.effectiveNum || 0,
    rewardPerInvite: resp?.rewardPerPlayer || 0,
    dailyValidInvitees: Math.min(
      resp?.dailyEffectiveNum || 0,
      resp?.DailyLimit || 0
    ),
    dailyInviteLimit: resp?.DailyLimit || 0,
    maxInviteCount: resp?.maxReward?.requiredNum || 0,
    maxInviteRewards: resp?.maxReward?.reward || 0,
    inviteesLevelMilestoneRules: inviteesLevelMilestoneRules,
  };
};

export default PostTeamInviteInformationEndpoint;
