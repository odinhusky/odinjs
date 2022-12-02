// import request from './request';
import axios from 'axios';
import { bianceBaseURL } from '@/constants/api';

export const getBianceLimitedDepth = (
  symbol: string,
  limit: string | number
) => {
  return axios.get(`${bianceBaseURL}/api/v3/depth?symbol=${symbol}&limit=${limit}`);
};
