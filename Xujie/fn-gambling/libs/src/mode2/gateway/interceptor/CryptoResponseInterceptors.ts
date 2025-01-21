import { AxiosInstance } from 'axios';
import sdkUtils from '../../utils/sdk/index';
import { message } from 'antd';
import { logout } from '@mode2/usecase/useLogout';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import {
  apiErrorLoggerEvent,
  apiExceptionLoggerEvent,
} from '@mode2/usecase/useLoggerClient';

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
        return Promise.reject();
      }
      if (response.data?.Code !== 200) {
        // 有錯誤就 Toast，才能確保 [請求API時機, 請求參數，回應結構] 正確性
        message.error(`${response.data?.Msg}`);
        apiErrorLoggerEvent(
          `${response.config.url}`,
          response.status,
          response.data
        );
        return Promise.reject();
      }
      return response;
    },
    (error) => {
      message.error(
        `${error['response']['status']}--${error['message'] || 'server error'}`
      );
      apiExceptionLoggerEvent(error);
      return Promise.reject();
    }
  );
};
