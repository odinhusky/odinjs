import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_REWARD_CLAIM_LIST_URL } from '@mode2API/urls';

//0:未领取 1:已领取2:取消發放
export enum TeamRewardClaimState {
  COMPLETED = 'COMPLETED', //（已完成）：
  PENDING = 'PENDING', //（待處理）：
  PROCESSING = 'PROCESSING', //（處理中）
  FAILED = 'FAILED', //（失敗）
  CANCELED = 'CANCELED', //（已取消）
  UNKNOWN = 'UNKNOWN', // 未定義，未知
}

export type TeamRewardClaimListRequest = {
  time: number; // unix Time
};

export interface TeamRewardClaimItemResponse {
  ClaimTime?: number;
  Commission?: number;
  CreateTime?: number;
  Id?: number;
  PlayerId?: number;
  SettleDate?: number;
  State?: number;
  UpdateTime?: number;
}

//0:未领取 1:已领取2:取消發放
const mapState: Record<number, TeamRewardClaimState> = {
  [0]: TeamRewardClaimState.PENDING,
  [1]: TeamRewardClaimState.COMPLETED,
  [2]: TeamRewardClaimState.CANCELED,
  // [3]: TeamRewardClaimState.FAILED,
  // [4]: TeamRewardClaimState.CANCELED,
};

export interface TeamRewardClaimItemResult {
  createTime: number; // 創建時間
  commissionAmount: number; //佣金
  state: TeamRewardClaimState; // 狀態
}

export interface TeamRewardClaimListResult {
  totalCommissionAmount: number; // 總佣金
  items: TeamRewardClaimItemResult[];
}

/**
 * for 俱樂部 - 獎勵詳情-全部
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostTeamRewardClaimListEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<TeamRewardClaimListResult, TeamRewardClaimListRequest>({
    query: (request) => {
      return {
        method: 'post',
        url: POST_TEAM_REWARD_CLAIM_LIST_URL,
        data: {
          ...request,
        },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<TeamRewardClaimItemResponse[]>
): TeamRewardClaimListResult => {
  const resp = response?.Body;

  const totalCommissionAmount =
    resp?.reduce(
      (commission, item) => (commission || 0) + (item.Commission || 0),
      0
    ) || 0;

  const items =
    resp?.map((item) => {
      const state = mapState[item.State || -1] || TeamRewardClaimState.PENDING;
      return {
        createTime: item.CreateTime || 0,
        commissionAmount: item.Commission || 0,
        state: state,
      };
    }) || [];
  return {
    totalCommissionAmount: totalCommissionAmount,
    items: items,
  };
};

export default PostTeamRewardClaimListEndpoint;
