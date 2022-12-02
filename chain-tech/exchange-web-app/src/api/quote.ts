import request from './request';
import { baseURL } from '@/constants/api';

export const getFavoriteList = () => {
  return request({
    url: `${baseURL}/investor/favorite`
  }, false);
};

export const addFavorite = (symbol: string) => {
  return request({
    method: 'POST',
    url: `${baseURL}/investor/favorite`,
    data: {
      symbol
    }
  }, false);
};

export const removeFavorite = (symbol: string) => {
  return request({
    method: 'DELETE',
    url: `${baseURL}/investor/favorite`,
    data: {
      symbol
    }
  }, false);
};