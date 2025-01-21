import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AppLocalStorageKey, AppLocalStorage } from '@/persistant/localStorage';
type AxiosBaseQueryError = AxiosError<{
  detail: string;
  status: number;
  instance: string;
  timestamp: string;
  title: string;
  type: string;
}>;
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
      const token = AppLocalStorage.getStorage(AppLocalStorageKey.TOKEN) || '';
      const lang =
        AppLocalStorage.getStorage(AppLocalStorageKey.LANG) || 'en-US';
      const result = await axiosInstance({
        ...query,
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: 'application/json',
          'Accept-Language': lang,
        },
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosBaseQueryError;
      return {
        error: err?.response?.data?.detail || err?.message || 'error',
      };
    }
  };
