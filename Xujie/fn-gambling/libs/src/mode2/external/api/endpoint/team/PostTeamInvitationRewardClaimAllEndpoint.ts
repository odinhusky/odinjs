import { ExternalEndpoint } from '@mode2API/types';
import { POST_TEAM_INVITATION_TASK_REWARD_CLAIM_ALL_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export interface InvitationRewardClaimResult {
  reward: number;
}

export const PostTeamInvitationRewardClaimAllEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<InvitationRewardClaimResult, void>({
    query: () => ({
      method: 'post',
      url: POST_TEAM_INVITATION_TASK_REWARD_CLAIM_ALL_URL,
      data: {},
    }),

    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<string>
): InvitationRewardClaimResult => {
  const resp = response?.Body;

  return { reward: 0 };
};
