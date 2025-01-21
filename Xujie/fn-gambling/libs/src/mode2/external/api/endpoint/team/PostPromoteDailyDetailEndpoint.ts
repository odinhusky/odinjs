import { POST_PROMOTE_DAILY_DETAIL_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { extractApiMoneyString } from '@libs/commonUtils/extractApiMoneyString';

interface PromoteDailyDetailListItemResponse {
  ChangeTime?: number; // 1725399300
  ChangeType?: number; // 5
  ChangeAmount?: string; // "₹40.00"
}

type PromoteDailyDetailResponse = PromoteDailyDetailListItemResponse[] | null;

export const PostPromoteDailyDetailEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PromoteDailyDetailResult, void>({
    query: () => ({
      method: 'post',
      url: POST_PROMOTE_DAILY_DETAIL_URL,
      data: {},
    }),

    transformResponse,
  });

  export type PromoteDailyDetailListItemResult = {
  timestamp: number; // 1725399300 秒
  level: number; // Level {number}
  totalCommission: number; // 40.00
};

export type PromoteDailyDetailResult = PromoteDailyDetailListItemResult[];

const defaultResult = [] as PromoteDailyDetailListItemResult[];

const transformResponse = (
  response: ResponseStructure<PromoteDailyDetailResponse>
): PromoteDailyDetailResult => {
  const resp = response?.Body;
  if (resp) {
    return resp.map((item) => ({
      timestamp: item?.ChangeTime || 0,
      level: item?.ChangeType === 5 ? 1 : 2,
      totalCommission: extractApiMoneyString(item.ChangeAmount || ''),
    }));
  }
  return defaultResult;
};
