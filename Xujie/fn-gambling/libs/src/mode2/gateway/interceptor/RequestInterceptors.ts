import { AxiosInstance } from 'axios';
import { message } from 'antd';
import { mergeRequestData } from '@libs/mode2/external/api/requestInitData';

export const setupRequestInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config) => {
      let requestData = config.data;
      requestData = await mergeRequestData(requestData);
      // config.data = JSON.stringify(requestData);
      config.data = requestData;
      // config.params = config?.params;
      return config;
    },
    (error) => {
      message.error(`${error['message'] || 'server error'}`);
      return Promise.reject();
    }
  );
};
