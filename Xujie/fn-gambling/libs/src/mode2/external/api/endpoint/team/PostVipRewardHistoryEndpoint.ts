import { ExternalEndpoint } from '@mode2API/types';
import { POST_VIP_REWARD_HISTORY_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export interface VipRewardPayload {
  page: number;
  pageSize: number;
  range?: {
    // 沒給就是 all
    year: number;
    month: number;
  };
}

interface VipRewardHistoryRequest {
  year?: number;
  month?: number;
  page: number;
  pageSize: number; // 固定 30
}

interface VipRewardHistoryInfoResponse {
  level?: number;
  reward?: number;
  time?: number;
  type?: number;
}

interface VipRewardHistoryResponse {
  data?: VipRewardHistoryInfoResponse[];
  total?: number;
  totalRewards?: number;
}

//"奖励类型 6升级奖励 18月返利"`
export enum VipRewardType {
  UPGRADE = 'UPGRADE',
  MONTHLY_REBATE = 'MONTHLY_REBATE',
}

export interface VipRewardInfoResult {
  level: number; // vip 等級
  rewardAmount: number; // 獎勵金額
  dateTime: number; // 領取時間 [YYYY-MM-DD HH:mm:ss]
  rewardType: VipRewardType;
}

export interface VipRewardHistoryResult {
  currentPage: number; // 當前請求頁面， +1 為下一個頁面
  hasNexPage: boolean; // 是否有下一頁資訊
  totalRewards: number; // 總獎勵金額
  items: VipRewardInfoResult[];
}

const VIP_REWARD_HISTORY_PAGE_SIZE = 30;
export const PostVipRewardHistoryEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<VipRewardHistoryResult, VipRewardPayload>({
    query: (payload) => {
      const request: VipRewardHistoryRequest = {
        page: payload.page,
        pageSize: payload.pageSize,
        ...payload.range,
      };
      return {
        method: 'post',
        url: POST_VIP_REWARD_HISTORY_URL,
        data: request,
      };
    },

    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<VipRewardHistoryResponse>,
  meta: unknown,
  arg: VipRewardHistoryRequest
): VipRewardHistoryResult => {
  const resp = response?.Body;

  // formatDate(record.updateTime, 'DD.MM.YYYY')
  const items =
    resp?.data?.map((item) => {
      return {
        level: item?.level || 0,
        rewardAmount: item?.reward || 0,
        dateTime: item?.time || 0,
        rewardType:
          item?.type === 18
            ? VipRewardType.MONTHLY_REBATE
            : VipRewardType.UPGRADE,
      };
    }) || [];
  return {
    currentPage: arg.page,
    hasNexPage: items.length <= VIP_REWARD_HISTORY_PAGE_SIZE,
    items: items,
    totalRewards: resp?.totalRewards || 0,
  };
};
