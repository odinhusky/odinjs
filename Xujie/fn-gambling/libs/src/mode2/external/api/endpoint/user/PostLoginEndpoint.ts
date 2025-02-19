import { Md5 } from 'ts-md5';
import { LOGIN_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import sdkUtils from '@mode2/utils/sdk/index';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

interface LoginRequest {
  password: string;
  username: string;
  appId?: string;
  captchaId?: string;
  platform?: string;
  verifyCode?: string;
  referralCode?: string;
}

interface LoginResponse {
  Token?: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
  verifyCode?: string;
  referralCode?: string;
}

type LoginResult = {
  token: string;
  userRole: UserRoleType;
};

/** 獲取登入token */
export const PostLoginEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<LoginResult | undefined, LoginPayload>({
    query: (data: LoginPayload) => {
      const { phone, password, referralCode} = data;
      const reqData: LoginRequest = {
        appId: sdkUtils.getAppId(),
        captchaId: '', // TODO 登录暂时用不到
        password: Md5.hashStr(password), // "b59c67bf196a4758191e42f76670ceba",
        platform: import.meta.env['VITE_PACKAGENAME'],
        username: phone,
        verifyCode: '', // TODO 登录暂时用不到
        referralCode: referralCode,
      };
      return {
        method: 'post',
        url: LOGIN_URL,
        data: {
          reqData,
        },
      };
    },

    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<LoginResponse>
): LoginResult => {
  const resp = response?.Body;

  return {
    token: resp?.Token || '',
    userRole: UserRoleType.USER,
  };
};
