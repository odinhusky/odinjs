import { Md5 } from 'ts-md5';
import { FORGET_PWD_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';

export interface UIForgetPasswordRequest {
  otpCode: string;
  otpId: string;
  password: string;
}

// NOTE: API 接收參數命名是opt,但One Time Password應該是OTP才對
export interface ApiForgetPasswordRequest {
  optCode: string;
  optId: string;
  password: string;
  repeatPassword: string;
}

/**
 * @example
 *
 * Success:
 * "{\"Code\":200,\"Msg\":\"\",\"Body\":null}"
 *
 * Failed:
 * "{\"Code\":400,\"Msg\":\"Reset password error, verification code error\",\"Body\":null}"
 */
export type ForgetPasswordResponse = null;

/** 透過OTP驗證碼來重設密碼 */
export const PostForgetPasswordEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<ForgetPasswordResult, UIForgetPasswordRequest>({
    query: (data: UIForgetPasswordRequest) => {
      const reqData: ApiForgetPasswordRequest = {
        optCode: data.otpCode,
        optId: data.otpId,
        password: Md5.hashStr(data.password),
        repeatPassword: Md5.hashStr(data.password),
      };
      return {
        method: 'post',
        url: FORGET_PWD_URL,
        data: {
          reqData,
        },
      };
    },

    transformResponse,
  });

type ForgetPasswordResult = {
  isResetSuccess: boolean;
};

const transformResponse = (
  response: ResponseStructure<ForgetPasswordResponse>
): ForgetPasswordResult => {
  return {
    isResetSuccess: response?.Code === 200 && response?.Msg === '',
  };
};
