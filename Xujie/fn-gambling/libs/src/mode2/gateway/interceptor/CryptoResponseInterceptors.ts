import { AxiosInstance } from 'axios';
import sdkUtils from '../../utils/sdk/index';
import { logout } from '@mode2/usecase/useLogout';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import {
  apiErrorLoggerEvent,
  apiExceptionLoggerEvent,
} from '@mode2/usecase/useLoggerClient';
import { useMessageStore } from '@mode2/zustand/components/messageStore';
import { POST_GIFT_RANDOM_URL } from '@mode2API/urls';

// 略過error message 封裝
const env = import.meta.env['VITE_V_VERSION'];
const SkipErrorMessageWhitelistMapping: Record<string, string[]> = {
  ['v6']: [POST_GIFT_RANDOM_URL],
};
const showErrorMessage = (url: string, errorMessage: string) => {
  const skipWhitelist = SkipErrorMessageWhitelistMapping[env] || [];
  if (!skipWhitelist.includes(url)) {
    useMessageStore.getState().error(errorMessage);
  }
};
export const setupCryptoResponseInterceptors = (instance: AxiosInstance) => {
  const isEnableCrypto = import.meta.env['VITE_ENABLE_ENCODE_DECODE'] === '1';
  instance.interceptors.response.use(
    async (response) => {
      // 處理 正式環境 加密功能 & 略過加密
      if (isEnableCrypto) {
        response.data = JSON.parse(sdkUtils.decrypt(response.data));
      } else {
        response.data = JSON.parse(response.data);
      }

      try {
        const request = isEnableCrypto
          ? JSON.parse(sdkUtils.decrypt(response.config.data))
          : JSON.parse(response.config.data || '{}') || {};
        console.log(
          `%c===> gateway[${response.config.url}]:`,
          'color:orange',
          '\nrequest:',
          request.reqData,
          '\nresponse:',
          response.data.Body || response.data
        );
      } catch (e) {
        console.error(e);
      }

      if (response.data?.Code === 5005 || response.data?.Code === 50005) {
        sdkUtils.removeStorage(AppLocalStorageKey.TOKEN);
        logout();
        return Promise.reject(response.data);
      }
      if (response.data?.Code !== 200) {
        // 有錯誤就 Toast，才能確保 [請求API時機, 請求參數，回應結構] 正確性
        showErrorMessage(response.config?.url || '', response.data?.Msg);
        const traceId =
          response.headers['trace-id'] || response.headers['x-trace-id'];
        apiErrorLoggerEvent(
          `${response.config.url}`,
          response.status,
          response.data,
          traceId
        );
        return Promise.reject(response.data);
      }
      return response;
    },
    (error) => {
      showErrorMessage(
        '',
        `${error['response']?.['status']}--${
          error['message'] || 'server error'
        }`
      );
      apiExceptionLoggerEvent(error);

      return Promise.reject(error);
    }
  );
};
