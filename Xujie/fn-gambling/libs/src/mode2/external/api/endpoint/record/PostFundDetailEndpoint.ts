import { POST_FUND_DETAIL_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';

export interface FundDetailRequest {
  limit: number;
  page: number;
}

interface FundDetailItemResponse {
  ChangeTime?: number; // 1726207818
  Name?: string; //'Recharge Reward'
  ChangeAmount?: string; // '500.00'
  BeforeBalance?: string; // '100821.00'
  AfterBalance?: string; // '101321.00'
}

type FundDetailResponse = FundDetailItemResponse[];

/** 資金轉移紀錄 */
export const PostFundDetailEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<FundDetailResult, FundDetailRequest>({
    query: (reqData) => ({
      method: 'post',
      url: POST_FUND_DETAIL_URL,
      data: {
        reqData,
      },
    }),

    transformResponse,
  });

export type FundDetailItemResult = {
  timestamp: number; // 秒
  operate: string;
  beforeBalance: number;
  afterBalance: number;
  isAssetIncreasing: boolean;
};

type FundDetailResult = FundDetailItemResult[];

const defaultResult = [] as FundDetailResult;


const transformResponse = (
  response: ResponseStructure<FundDetailResponse>
): FundDetailResult => {
  const resp = response?.Body; 
  if (resp) {
    return resp.map((item) => ({
      timestamp: item?.ChangeTime || 0,
      operate: item?.Name || '',
      beforeBalance: extractApiMoneyString(item?.BeforeBalance || '0'),
      afterBalance: extractApiMoneyString(item?.AfterBalance || '0'),
      isAssetIncreasing: Number(item?.ChangeAmount || '0') > 0,
    }));
  }
  return defaultResult;
};
