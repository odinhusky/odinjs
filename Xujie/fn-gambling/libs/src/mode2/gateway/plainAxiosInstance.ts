import axios from 'axios';
import sdkUtils from '../utils/sdk';
import { AppLocalStorageKey } from '../utils/sdk/persistant/storageKey';

import type { AxiosRequestConfig } from 'axios';

type BaseQuery = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
};

export const plainAxios = async <T = any>(query: BaseQuery): Promise<T> => {
  const lang = sdkUtils.getStorage(AppLocalStorageKey.LANG) || 'en-US';

  const config: AxiosRequestConfig = {
    baseURL: '', // optional, or pass it through query.headers if needed
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': lang,
      CacheControl: 'max-age=3',
      ...query.headers,
    },
    method: query.method || 'GET',
    url: query.url,
    data: query.data,
    params: query.params,
  };

  const response = await axios.request<T>(config);
  return response.data;
};

export default plainAxios;
