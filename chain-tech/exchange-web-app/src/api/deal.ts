import request from './request';
import { baseURL } from '@/constants/api';

interface getKLineArgs {
  symbol: string;
  intv: string;
  start?: number | null | undefined;
  end?: number | null | undefined;
  limit?: number | null | undefined;
}

export const getKline = (
  {
    symbol,
    intv,
    start = 0,
    end = 0,
    limit = 0
  }: getKLineArgs
) => {
  const mainUrl = `${baseURL}/market/kline`;
  const optionParam = `?intv=${intv}&symbol=${symbol}${start ? `&start=${start}`: ''}${end ? `&end=${end}`: ''}${limit ? `&limit=${limit}`: ''}`;
  const url = `${mainUrl}${optionParam}`;

  return request({
    url
  }, false);
};