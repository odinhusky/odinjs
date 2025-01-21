import { POST_PLAYER_SEND_OPT_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';

export interface SendOtpRequest {
  mobile: string;
}

export interface SendOtpResponse {
  otpId: string;
}

/** OTP驗證碼發送(目前只有忘記密碼modal使用) */
export const PostSendOtpEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<SendOtpResult, SendOtpRequest>({
    query: (data: SendOtpRequest) => {
      const reqData = {
        mobile: data.mobile,
      };
      return {
        method: 'post',
        url: POST_PLAYER_SEND_OPT_URL,
        data: {
          reqData,
        },
      };
    },

    transformResponse,
  });

type SendOtpResult = {
  otpId: string;
};

const defaultResult = {
  otpId: '',
};

const transformResponse = (
  response: ResponseStructure<SendOtpResponse>
): SendOtpResult => {
  const resp = response?.Body;
  if (response?.Code === 200 && resp) {
    return {
      otpId: resp?.otpId || '',
    };
  }
  return defaultResult;
};
