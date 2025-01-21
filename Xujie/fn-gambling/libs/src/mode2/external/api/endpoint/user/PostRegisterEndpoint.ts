import { Md5 } from 'ts-md5';
import sdkUtils from '@mode2/utils/sdk/index';
import { ExternalEndpoint } from '../../types';
import { REGISTER_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';

interface RegisterRequest {
  appId: string;
  captchaId: string;
  lazy: boolean;
  password: string;
  platform: string;
  playerName: string;
  pushToken: string;
  referralCode?: string;
  repeatPassword: string;
  username: string;
  verifyCode: string;
}

type RegisterResponse = {
  Token?: string;
  Popup?: boolean;
  RegisterReward?: number;
};

export interface RegisterPayload {
  phone: string;
  password: string;
  verifyCode: string;
  captchaId: string;
  referralCode?: string;
  pushToken?: string;
}

type RegisterResult = {
  token: string;
  isShowPopup: boolean; // 是否顯示註冊完成，提示充值彈窗
  registerBonus: number; // 註冊即贈送將金
};

/** 註冊新帳戶&獲取登入token */
export const PostRegisterEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RegisterResult, RegisterPayload>({
    query: (data: RegisterPayload) => {
      const {
        phone,
        password,
        verifyCode,
        captchaId,
        referralCode,
        pushToken,
      } = data;
      const reqData: RegisterRequest = {
        appId: sdkUtils.getAppId(),
        captchaId: captchaId,
        lazy: false,
        password: Md5.hashStr(password),
        platform: import.meta.env['VITE_PACKAGENAME'],
        playerName: phone,
        pushToken: pushToken || '',
        referralCode: referralCode,
        repeatPassword: Md5.hashStr(password),
        username: '',
        verifyCode: verifyCode,
      };

      return {
        method: 'post',
        url: REGISTER_URL,
        data: {
          reqData,
        },
      };
    },

    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<RegisterResponse>
): RegisterResult => {
  const resp = response?.Body;

  return {
    token: resp?.Token || '',
    isShowPopup: resp?.Popup || false,
    registerBonus: resp?.RegisterReward || 0,
  };
};
