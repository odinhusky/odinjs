import { ExternalEndpoint } from '@mode2API/types';
import { POST_INVITE_WHEEL_PARTICIPATE_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface InviteWheelParticipateResponse {
  reward?: number;
}

export interface InviteWheelParticipateResult {
  reward: number;
}

// Evan done

/**
 * //參加拼多多輪盤活動
 * @param builder
 * @constructor
 */
export const PostInviteWheelParticipateEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<InviteWheelParticipateResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_INVITE_WHEEL_PARTICIPATE_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<InviteWheelParticipateResponse>
): InviteWheelParticipateResult => {
  const resp = response?.Body;
  return {
    reward: resp?.reward || 0,
  };
};

export default PostInviteWheelParticipateEndpoint;
