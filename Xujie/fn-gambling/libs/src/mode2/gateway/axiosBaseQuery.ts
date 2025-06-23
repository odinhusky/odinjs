import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { setupRequestInterceptors } from './interceptor/RequestInterceptors';
import { setupResponseInterceptors } from './interceptor/ResponseInterceptors';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import sdkUtils from './../utils/sdk/index';
import { setupAxiosInstanceLoggerInterceptors } from '@mode2/gateway/interceptor/AxiosInstanceLoggerInterceptors';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { setupAxiosInstanceLoadingBarInterceptors } from '@mode2/gateway/interceptor/LoadingBarInterceptors';

type BaseQuery = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
};

export const axiosBaseQuery =
  (
    {
      baseUrl,
    }: {
      baseUrl: string;
    } = { baseUrl: '' }
  ): BaseQueryFn =>
  async (query: BaseQuery) => {
    try {
      const axiosInstance: AxiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 15000,
      });
      // 設置攔截器
      setupAxiosInstanceLoadingBarInterceptors(axiosInstance);
      setupRequestInterceptors(axiosInstance);
      setupResponseInterceptors(axiosInstance);
      setupAxiosInstanceLoggerInterceptors(axiosInstance);
      const token = sdkUtils.getStorage(AppLocalStorageKey.TOKEN) || '';
      const lang = sdkUtils.getStorage(AppLocalStorageKey.LANG) || 'en-US';

      const result = await axiosInstance({
        ...query,
        headers: {
          ContentType: 'application/json',
          'Accept-Language': lang,
          Token: token,
          CacheControl: 'max-age=3',
          ...query.headers,
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      const respStructure = axiosError as ResponseStructure<unknown>;
      return {
        error: err?.message || respStructure.Msg || 'error',
      };
    }
  };
