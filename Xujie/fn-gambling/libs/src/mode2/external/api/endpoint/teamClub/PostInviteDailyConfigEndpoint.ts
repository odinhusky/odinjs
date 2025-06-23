import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_INVITE_DAILY_CONFIG_URL } from '@mode2API/urls';

export interface InviteDailyConfigResponse {
  num?: number;
  commission?: number;
  validInviteAmount?: number;
  inviteeReward?: number;
}

export interface InviteDailyConfigResult {
  dailyValidInvitees: number; // 每日邀請數量 ,"num": 10,
  commission: number; // 佣金, "commission": 40,
  validInviteRebates: number; // 有效邀請獎勵, "validInviteAmount": 100
  rewardForInvitee: number; // 受邀者可得到的獎勵
}

/**
 * for 邀請獎勵－邀請新客戶
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostInviteDailyConfigEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<InviteDailyConfigResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_INVITE_DAILY_CONFIG_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<InviteDailyConfigResponse>
): InviteDailyConfigResult => {
  const resp = response?.Body;
  return {
    dailyValidInvitees: resp?.num || 0,
    commission: resp?.commission || 0,
    validInviteRebates: resp?.validInviteAmount || 0,
    rewardForInvitee: resp?.inviteeReward || 0,
  };
};

export default PostInviteDailyConfigEndpoint;
