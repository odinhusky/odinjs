import { ExternalEndpoint } from '@mode2API/types';
import { POST_TEAM_INVITATION_TASK_REWARD_CLAIM_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export interface InvitationRewardClaimPayload {
  settleId: number;
}

export interface InvitationRewardClaimResult {
  reward: number;
}

export const PostTeamInvitationRewardClaimEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<InvitationRewardClaimResult, InvitationRewardClaimPayload>({
    query: (payload) => ({
      method: 'post',
      url: POST_TEAM_INVITATION_TASK_REWARD_CLAIM_URL,
      data: { ...payload },
    }),

    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<string>
): InvitationRewardClaimResult => {
  const resp = response?.Body;

  return { reward: 0 };
};
