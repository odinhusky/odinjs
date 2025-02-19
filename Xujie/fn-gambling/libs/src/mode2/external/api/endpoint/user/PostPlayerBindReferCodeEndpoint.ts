import { ExternalEndpoint } from '@mode2API/types';
import { POST_PLAYER_BIND_REFER_CODE_URL } from '@mode2API/urls';

export interface PlayerBindReferCodeRequest {
  referCode: string;
}
export const PostPlayerBindReferCodeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<string, PlayerBindReferCodeRequest>({
    query: (request) => {
      return {
        method: 'post',
        url: POST_PLAYER_BIND_REFER_CODE_URL,
        data: { ...request },
      };
    },
    // transformResponse,
  });

// const transformResponse = (
//   response: ResponseStructure<VisitorLoginCheckResponse> // api resp 結構
// ): VisitorLoginCheckRequest => {
//   const resp = response.Body;
//   const token = resp?.Token || '';
//   // device id 換 token， 有回應token 角色切換為 [PLAYER]
//   // 沒有回應 token，角色切換為 [GUEST]
//   return {
//     token: token,
//     userRole: isEmpty(token) ? UserRoleType.GUEST : UserRoleType.PLAYER,
//   };
// };
