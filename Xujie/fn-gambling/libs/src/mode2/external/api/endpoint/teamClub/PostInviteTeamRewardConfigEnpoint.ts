import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_INVITE_TEAM_REWARD_CONFIG_URL } from '@mode2API/urls';

interface InviteTeamRewardConfigItemResponse {
  required_num?: number;
  commission?: number;
  seq?: number;
}

export interface InviteTeamRewardConfigResponse {
  validInviteAmount?: number;
  configs?: InviteTeamRewardConfigItemResponse[];
}

export interface InviteTeamRewardRuleItemResult {
  indexKey: string;
  invitationCount: number; // 邀請達標數量
  commission: number; // 達標獎勵
}

export interface InviteTeamRewardConfigResult {
  validDepositRebates: number; // 有效充值獎勵
  inviteRules: InviteTeamRewardRuleItemResult[]; // 邀請規則
}

/**
 * for 邀請獎勵－如何參加
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostInviteTeamRewardConfigEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<InviteTeamRewardConfigResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_INVITE_TEAM_REWARD_CONFIG_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<InviteTeamRewardConfigResponse>
): InviteTeamRewardConfigResult => {
  const resp = response?.Body;

  return {
    validDepositRebates: resp?.validInviteAmount || 0,
    inviteRules:
      resp?.configs?.map((item, index) => {
        return {
          indexKey: `${index}`,
          invitationCount: item.required_num || 0,
          commission: item.commission || 0,
        };
      }) || [],
  };
};

export default PostInviteTeamRewardConfigEndpoint;
