import { ExternalEndpoint } from '@mode2API/types';
import { POST_INVITE_WHEEL_WITHDRAW_URL } from '@mode2API/urls';

export interface PostInviteWheelWithdrawResponse {}

// Evan done

/**
 * 邀請輪盤，提領獎勵
 * @param builder
 * @constructor
 */
export const PostInviteWheelWithdrawEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PostInviteWheelWithdrawResponse, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_INVITE_WHEEL_WITHDRAW_URL,
        data: {},
      };
    },
    // transformResponse,
  });

// const transformResponse = (
//   response: ResponseStructure<PostInviteWheelSpinResponse>
// ): PostInviteWheelSpinResult => {
//   const resp = response?.Body;
//   return {
//     reward: resp?.reward || 0,
//   };
// };

export default PostInviteWheelWithdrawEndpoint;
