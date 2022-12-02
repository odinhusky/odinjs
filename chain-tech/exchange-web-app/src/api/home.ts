import request from './request';
import { baseURL } from '@/constants/api';

export const getAllDealList = () => {
  return request({
    url: `${baseURL}/info/future/symbol`
  }, false);
};

export const getHotList = () => {
  return request({
    url: `${baseURL}/info/future/symbol?isHot=true`,
  },  false);
};

export const getMarquee = (lang: string) => {
  return request({
    url: `${baseURL}/info/marquee?lang=${lang}`,
  }, false);
};
