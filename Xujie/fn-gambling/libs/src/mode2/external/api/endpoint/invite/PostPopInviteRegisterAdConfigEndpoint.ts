import { ExternalEndpoint } from '@mode2API/types';
import { POST_PROMOTE_START_PAGE_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface PopInviteRegisterAdConfigResponse {
  DailyInviteReward?: number;
  EarnDailyMax?: number;
  InviteWheelReward?: number;
}

export interface PopInviteRegisterAdConfigResult {
  dailyInviteReward: number;
  earnDailyMax: number;
  inviteWheelReward: number;
}

export const PostPopInviteRegisterAdConfigEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<PopInviteRegisterAdConfigResult, void>({
    query: () => ({
      method: 'post',
      url: POST_PROMOTE_START_PAGE_URL,
      data: {
        reqData: {},
      },
    }),
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PopInviteRegisterAdConfigResponse>
): PopInviteRegisterAdConfigResult => {
  const resp = response?.Body;

  return {
    dailyInviteReward: resp?.DailyInviteReward || 0,
    earnDailyMax: resp?.EarnDailyMax || 0,
    inviteWheelReward: resp?.InviteWheelReward || 0,
  };
};
