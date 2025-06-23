import { ExternalEndpoint } from '@mode2API/types';
import { POST_PROMOTE_INVITE_WHEEL_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface PromoteInviteWheelResponse {
  withdrawRequire?: number;
}

export interface PromoteInviteWheelResult {
  withdrawRequire: number;
}

export const PostPromoteInviteWheelEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PromoteInviteWheelResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_PROMOTE_INVITE_WHEEL_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PromoteInviteWheelResponse>
): PromoteInviteWheelResult => {
  const resp = response.Body;
  return {
    withdrawRequire: resp?.withdrawRequire || 0,
  };
};
