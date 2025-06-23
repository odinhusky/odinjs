import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_FINANCE_TIER_SUMMARY_LIST_URL } from '@mode2API/urls';

export interface TeamFinanceTierSummaryListRequest {
  joinTime: number;
  tier: number;
}

export interface TeamFinanceTierSummaryResponse {
  avatar?: string;
  avatarFrame?: string;
  commission?: number;
  deposit?: number;
  joinTime?: number;
  parentId?: number;
  // playerId?: number;
  playerName?: string;
  tier?: number;
  isNew?: boolean;
}

export interface TeamFinanceTierSummaryItemResult {
  avatarId: string; // 頭像ID
  avatarFrameId: string; // 頭像匡ID
  displayName: string; // 顯示名稱， 前端filter
  tier: number; // 所屬下線層級
  depositAmount: number; // 充值金額
  commissionAmount: number; // 佣金，前端排序
  joinTime: number; // 加入時間，前端排序
  isNewMember: boolean; // 新加入成員
}

/**
 * for 俱樂部 - 下線查詢
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostTeamFinanceTierSummaryListEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<
    TeamFinanceTierSummaryItemResult[],
    TeamFinanceTierSummaryListRequest
  >({
    query: (request) => {
      return {
        method: 'post',
        url: POST_TEAM_FINANCE_TIER_SUMMARY_LIST_URL,
        data: { ...request },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<TeamFinanceTierSummaryResponse[]>
): TeamFinanceTierSummaryItemResult[] => {
  const resp = response?.Body;

  return (
    resp?.map((item) => {
      return {
        avatarId: item.avatar || '',
        avatarFrameId: item.avatarFrame || '',
        displayName: item.playerName || '',
        tier: item.tier || 0,
        depositAmount: item.deposit || 0,
        commissionAmount: item.commission || 0,
        joinTime: item.joinTime || 0,
        isNewMember: item.isNew === true || false,
      };
    }) || []
  );
};

export default PostTeamFinanceTierSummaryListEndpoint;
