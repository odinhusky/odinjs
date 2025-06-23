import { ExternalEndpoint } from '@mode2API/types';
import { POST_PLAYER_OTP_LOGIN_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import { getPlaceAdvertisementInfo } from '@mode2API/base/placeAdvertisementInfo';

export interface OtpLoginRequest {
  otpCode: string;
  otpId: string;
  referralCode?: string;
  pushToken: string;
}

interface OtpLoginResponse {
  Token?: string;
}

export interface OtpLoginResult {
  token: string;
  userRole: UserRoleType;
}

export const PostOtpLoginEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<OtpLoginResult, OtpLoginRequest>({
    query: (request) => {
      return {
        method: 'post',
        url: POST_PLAYER_OTP_LOGIN_URL,
        data: {
          ...request,
          ...getPlaceAdvertisementInfo(),
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<OtpLoginResponse>
): OtpLoginResult => {
  const resp = response?.Body;

  return {
    token: resp?.Token || '',
    userRole: UserRoleType.USER,
  };
};
