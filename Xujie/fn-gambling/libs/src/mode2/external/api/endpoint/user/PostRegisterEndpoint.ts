import { Md5 } from 'ts-md5';
import sdkUtils from '@mode2/utils/sdk/index';
import { ExternalEndpoint } from '../../types';
import { REGISTER_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import { getPlaceAdvertisementInfo } from '@mode2API/base/placeAdvertisementInfo';

interface RegisterRequest {
  appId: string;
  captchaId: string; // 圖形驗證; 回應captchaId;
  lazy: boolean;
  password: string;
  platform: string;
  playerName: string;
  pushToken: string;
  referralCode?: string; //邀請碼
  repeatPassword: string;
  username: string;
  verifyCode: string; //圖形驗證 Code 4碼
  isVisitor: boolean; //訪客註冊使用
  optCode?: string; //otp code,使用者收到的 SMS [6碼]
  optId?: string; // send OTP 回應 otpId\':\'984567945567:1738918615
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
  isVisitor: boolean; // 訪客註冊使用
  optCode?: string;
  optId?: string;
}

type RegisterResult = {
  token: string;
  isShowPopup: boolean; // 是否顯示註冊完成，提示充值彈窗
  registerBonus: number; // 註冊即贈送將金
  userRole: UserRoleType;
  isVisitor: boolean;
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
        isVisitor,
        optCode,
        optId,
      } = data;

      // password is empty 不要 MD5 hash
      const hashPassword = password ? Md5.hashStr(password) : '';

      const reqData: RegisterRequest = {
        appId: sdkUtils.getAppId(),
        captchaId: captchaId,
        lazy: false,
        password: hashPassword,
        platform: import.meta.env['VITE_PACKAGENAME'],
        playerName: phone,
        pushToken: pushToken || '',
        referralCode: referralCode,
        repeatPassword: hashPassword,
        username: '',
        verifyCode: verifyCode,
        isVisitor: isVisitor,
        optCode: optCode,
        optId: optId,
        ...getPlaceAdvertisementInfo()
      };

      return {
        method: 'post',
        url: REGISTER_URL,
        data: {
          reqData
        },
      };
    },

    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<RegisterResponse>,
  meta: unknown,
  arg: RegisterPayload
): RegisterResult => {
  const resp = response?.Body;

  return {
    token: resp?.Token || '',
    isShowPopup: resp?.Popup || false,
    registerBonus: resp?.RegisterReward || 0,
    userRole: arg.isVisitor ? UserRoleType.PLAYER : UserRoleType.USER,
    isVisitor: arg.isVisitor,
  };
};
