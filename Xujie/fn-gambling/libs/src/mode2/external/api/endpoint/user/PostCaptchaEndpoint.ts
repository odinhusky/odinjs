import { POST_GET_CAPTCHA_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';
import { isEmpty } from 'lodash';

// api resp.Body
// 使用 ResponseStructure包裝結構
interface CaptchaResponse {
  captchaEnable?: boolean;
  captchaId?: string;
  img?: string;
}

// transform Response
export type CaptchaResult = {
  isEnabled: boolean;
  captchaId: string;
  base64CaptchaImg: string;
};

export const PostCaptchaEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<CaptchaResult, void>({
    query: () => {
      const reqData = {
        reqData: {},
      };
      return {
        method: 'post',
        url: POST_GET_CAPTCHA_URL,
        data: reqData,
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<CaptchaResponse> // api resp 結構
): CaptchaResult => {
  // RTK mutation<Response =>> CaptchaResult, void>()
  const resp = response.Body;
  const captchaId = resp?.captchaId || '';
  // 簡單防呆一下，組裝前端適用資料結構， 命名方式 [xxxxResult]
  const isEnabled = (resp?.captchaEnable || false) && !isEmpty(captchaId);
  return {
    isEnabled: isEnabled,
    captchaId: resp?.captchaId || '',
    base64CaptchaImg: resp?.img || '',
  };
};
