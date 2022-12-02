import request from './request';
import { baseURL } from '@/constants/api';

export const getFiatRate = () => {
  return request({
    url: `${baseURL}/info/fiat-currency`
  }, false);
};