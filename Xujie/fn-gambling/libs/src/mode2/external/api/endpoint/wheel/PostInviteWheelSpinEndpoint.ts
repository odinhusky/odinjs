import { ExternalEndpoint } from '@mode2API/types';
import { POST_INVITE_WHEEL_SPIN_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

interface PostInviteWheelSpinResponse {
  reward?: number;
}

export interface PostInviteWheelSpinResult {
  reward: number;
}

// Evan done
/**
 * 邀請輪盤，參與抽獎
 * @param builder
 * @constructor
 */
export const PostInviteWheelSpinEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PostInviteWheelSpinResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_INVITE_WHEEL_SPIN_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<PostInviteWheelSpinResponse>
): PostInviteWheelSpinResult => {
  const resp = response?.Body;
  return {
    reward: resp?.reward || 0,
  };
};

export default PostInviteWheelSpinEndpoint;
