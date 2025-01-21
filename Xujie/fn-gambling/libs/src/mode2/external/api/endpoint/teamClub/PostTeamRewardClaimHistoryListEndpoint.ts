import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_REWARD_CLAIM_HISTORY_LIST_URL } from '@mode2API/urls';

//0:未领取 1:已领取2:取消發放
export enum TeamRewardClaimHistoryState {
  COMPLETED = 'COMPLETED', //（已完成）：
  PENDING = 'PENDING', //（待處理）：
  PROCESSING = 'PROCESSING', //（處理中）
  FAILED = 'FAILED', //（失敗）
  CANCELED = 'CANCELED', //（已取消）
  UNKNOWN = 'UNKNOWN', // 未定義，未知
}

export interface TeamRewardClaimHistoryListResponse {
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
const mapState: Record<number, TeamRewardClaimHistoryState> = {
  [0]: TeamRewardClaimHistoryState.PENDING,
  [1]: TeamRewardClaimHistoryState.COMPLETED,
  [2]: TeamRewardClaimHistoryState.CANCELED,
  // [3]: TeamRewardClaimHistoryState.FAILED,
  // [4]: TeamRewardClaimHistoryState.CANCELED,
};

export interface TeamRewardClaimHistoryItemResult {
  updateTime: number; // 更新時間
  commissionAmount: number; //佣金
  state: TeamRewardClaimHistoryState; // 狀態
}

/**
 * for 俱樂部 - 獎勵詳情-提領紀錄
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostTeamRewardClaimHistoryListEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<TeamRewardClaimHistoryItemResult[], void>({
    query: () => {
      return {
        method: 'post',
        url: POST_TEAM_REWARD_CLAIM_HISTORY_LIST_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<TeamRewardClaimHistoryListResponse[]>
): TeamRewardClaimHistoryItemResult[] => {
  const resp = response?.Body;
  return (
    resp?.map((item) => {
      const state =
        mapState[item.State || -1] || TeamRewardClaimHistoryState.PENDING;
      return {
        updateTime: item.ClaimTime || 0,
        commissionAmount: item.Commission || 0,
        state: state,
      };
    }) || []
  );
};

export default PostTeamRewardClaimHistoryListEndpoint;
