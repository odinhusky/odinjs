import { ExternalEndpoint } from '@mode2API/types';
import { POST_PLAYER_VISITOR_LOGIN_CHECK_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import isEmpty from 'lodash/isEmpty';
import { getPlaceAdvertisementInfo } from '@mode2API/base/placeAdvertisementInfo';

interface VisitorLoginCheckResponse {
  Token?: string;
}

export interface VisitorLoginCheckRequest {
  token: string;
  userRole: UserRoleType;
}

/**
 * deviceID 換 Player token
 * @param builder
 * @constructor
 */
export const PostVisitorLoginCheckEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<VisitorLoginCheckRequest, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_PLAYER_VISITOR_LOGIN_CHECK_URL,
        data: { ...getPlaceAdvertisementInfo() },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<VisitorLoginCheckResponse> // api resp 結構
): VisitorLoginCheckRequest => {
  const resp = response.Body;
  const token = resp?.Token || '';
  // device id 換 token， 有回應token 角色切換為 [PLAYER]
  // 沒有回應 token，角色切換為 [GUEST]
  return {
    token: token,
    userRole: isEmpty(token) ? UserRoleType.GUEST : UserRoleType.PLAYER,
  };
};
