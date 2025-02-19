import { ExternalEndpoint } from '@mode2API/types';
import { POST_PLAYER_BIND_ACCOUNT_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import { Md5 } from 'ts-md5';

export interface PlayerBindAccountRequest {
  otpCode: string;
  otpId: string; // 請求SMS發送 回應 id
  playerName: string; // phone no
  repeatPassword?: string;
  password?: string;
  referralCode?: string;
}

export interface PlayerBindAccountResult {
  userRole: UserRoleType;
}

export interface PlayerBindAccountPayload {
  otpCode: string;
  otpId: string; // 請求SMS發送 回應 id
  phone: string; // phone no

  password?: string;
  referralCode?: string;
}

/**
 * player 完善個人資訊
 * @param builder
 * @constructor
 */
export const PostPlayerBindAccountEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PlayerBindAccountResult, PlayerBindAccountPayload>({
    query: (request) => {
      const requestData: PlayerBindAccountRequest = {
        otpCode: request.otpCode,
        otpId: request.otpId,
        playerName: request.phone,

        password: request?.password && Md5.hashStr(request?.password),
        repeatPassword: request?.password && Md5.hashStr(request?.password),
        referralCode: request.referralCode,
      };

      return {
        method: 'post',
        url: POST_PLAYER_BIND_ACCOUNT_URL,
        data: { ...requestData },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<string> // api resp 結構
): PlayerBindAccountResult => {
  const resp = response.Body;
  // 完善個人資訊成功，角色切換為 [USER]
  return {
    userRole: UserRoleType.USER,
  };
};
