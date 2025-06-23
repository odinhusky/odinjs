import { AxiosInstance } from 'axios';
import sdkUtils from '../../utils/sdk/index';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import { logout } from '@mode2/usecase/useLogout';
import {
  apiErrorLoggerEvent,
  apiExceptionLoggerEvent,
} from '@mode2/usecase/useLoggerClient';
import {
  POST_CAMPAIGN_LAUNCH_URL,
  POST_CAMPAIGN_LIST_URL,
  POST_DEVICE_EVENT_URL,
  POST_EVENT_ADJUST_PATCH_URL,
  POST_PIXEL_EVENT_URL,
  PUT_MMP_UPDATE_URL,
} from '@mode2API/urls';
import { useMessageStore } from '@mode2/zustand/components/messageStore';

const SkipErrorMessageWhitelist = [
  POST_CAMPAIGN_LAUNCH_URL,
  POST_CAMPAIGN_LIST_URL,
  POST_PIXEL_EVENT_URL,
  POST_EVENT_ADJUST_PATCH_URL,
  POST_DEVICE_EVENT_URL,
  PUT_MMP_UPDATE_URL,
];

// 略過error message 封裝
const showErrorMessage = (url: string, errorMessage: string) => {
  if (!SkipErrorMessageWhitelist.includes(url)) {
    useMessageStore.getState().error(errorMessage);
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
          'color:pink',
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
        return Promise.reject(response.data);
      }
      if (HttpStatusCode !== 200) {
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
