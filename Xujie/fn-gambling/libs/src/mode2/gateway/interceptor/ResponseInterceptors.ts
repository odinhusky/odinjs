import { AxiosInstance } from 'axios';
import sdkUtils from '../../utils/sdk/index';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { message } from 'antd';
import { logout } from '@mode2/usecase/useLogout';
import {
  apiErrorLoggerEvent,
  apiExceptionLoggerEvent,
} from '@mode2/usecase/useLoggerClient';
import {
  POST_CAMPAIGN_LAUNCH_URL,
  POST_CAMPAIGN_LIST_URL,
} from '@mode2API/urls';

const SkipErrorMessageWhitelist = [
  POST_CAMPAIGN_LAUNCH_URL,
  POST_CAMPAIGN_LIST_URL,
];

// 略過error message 封裝
const showErrorMessage = (url: string, errorMessage: string) => {
  if (!SkipErrorMessageWhitelist.includes(url)) {
    message.error(`${errorMessage}`);
  }
};

export const setupResponseInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    async (response) => {
      // FRONTEND-1691 防呆處理
      try {
        response.data =
          typeof response.data === 'string'
            ? JSON.parse(response.data)
            : JSON.parse(JSON.stringify(response.data));
      } catch {
        response.data = JSON.parse(sdkUtils.decrypt(response.data));
      }

      try {
        const request = JSON.parse(response.config.data || '{}') || {};
        console.log(
          `%c===> gateway[${response.config.url}]:`,
          'color:blue',
          '\nrequest:',
          request.reqData,
          '\nresponse:',
          response.data.Body || response.data,
          '\nconfig:',
          response.config
        );
      } catch (e) {
        console.error(e);
      }

      const HttpStatusCode = response.data?.Code || response.status;

      if (HttpStatusCode === 5005 || HttpStatusCode === 50005) {
        sdkUtils.removeStorage(AppLocalStorageKey.TOKEN);
        logout();
        return Promise.reject();
      }
      if (HttpStatusCode !== 200) {
        showErrorMessage(response.config?.url || '', response.data?.Msg);
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
      showErrorMessage(
        '',
        `${error['response']?.['status']}--${
          error['message'] || 'server error'
        }`
      );
      apiExceptionLoggerEvent(error);
      return Promise.reject();
    }
  );
};
