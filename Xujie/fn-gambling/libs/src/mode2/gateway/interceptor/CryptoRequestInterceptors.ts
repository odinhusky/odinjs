import { AxiosInstance } from 'axios';
import sdkUtils from '../../utils/sdk/index';
import { mergeRequestData } from '@libs/mode2/external/api/requestInitData';
import { message } from 'antd';

export const setupCryptoRequestInterceptors = (instance: AxiosInstance) => {
  const isEnableCrypto = import.meta.env['VITE_ENABLE_ENCODE_DECODE'] === '1';
  instance.interceptors.request.use(
    async (config) => {
      let requestData = config.data;

      /**
       * 處理request初始資料合併邏輯
       * transform response拉去endpoint後可透過needInitial控制
       */
      requestData = await mergeRequestData(requestData.reqData);

      // 處理 正式環境 加密功能 & 略過加密
      if (isEnableCrypto) {
        config.data = sdkUtils.encryption(JSON.stringify(requestData));
      } else {
        config.data = JSON.stringify(requestData);
      }
      return config;
    },
    (error) => {
      message.error(`${error['message'] || 'server error'}`);
      return Promise.reject();
    }
  );
};
