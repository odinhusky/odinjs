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
}

export interface TeamFinanceTierSummaryItemResult {
  avatarId: string; // 頭像ID
  avatarFrameId: string; // 頭像匡ID
  displayName: string; // 顯示名稱， 前端filter
  tier: number; // 所屬下線層級
  depositAmount: number; // 充值金額
  commissionAmount: number; // 佣金，前端排序
  joinTime: number; // 加入時間，前端排序
}

// TODO Ronan mock delete
const mockData: TeamFinanceTierSummaryItemResult[] = [
  {
    avatarId: '1',
    avatarFrameId: '1',
    displayName: 'Player One',
    tier: 1,
    depositAmount: 1000,
    commissionAmount: 100,
    joinTime: 1625097600,
  },
  {
    avatarId: '2',
    avatarFrameId: '2',
    displayName: 'Player Two',
    tier: 2,
    depositAmount: 2000,
    commissionAmount: 200,
    joinTime: 1625184000,
  },
];

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

  if (!resp?.length) return mockData;

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
      };
    }) || []
  );
};

export default PostTeamFinanceTierSummaryListEndpoint;
