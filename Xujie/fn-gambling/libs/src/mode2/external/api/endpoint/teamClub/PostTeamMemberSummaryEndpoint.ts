import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_MEMBER_SUMMARY_URL } from '@mode2API/urls';

interface TeamDetailsResponse {
  [key: string]: TeamDetailResponse;
}

interface TeamDetailResponse {
  hasNew?: boolean;
  tier?: number;
  num?: number;
}

export interface TeamMemberSummaryResponse {
  totalNumberOfMembers?: number;
  level?: number;

  tier1?: number;
  tier2?: number;
  tier3?: number;

  today?: number;
  yesterday?: number;
  latestMonth?: number;

  teamDetails?: TeamDetailsResponse;
}

export interface SubordinateSummaryResult {
  todayJoinCount: number; // 今日加入數量
  yesterdayJoinCount: number; // 昨日加入數量
  thisMonthJoinCount: number; // 本月加入數量
}

export interface SubordinateLevelInfoResult {
  tier: number; // 下線層級
  members: number; //成員數量
  hasNewMembers: boolean; // 是否有新成員加入
}

export interface TeamMemberSummaryResult {
  totalMembers: number; // 全部成員數量
  subordinateSummary: SubordinateSummaryResult; // 成員概要
  subordinateLevelItems: SubordinateLevelInfoResult[]; // 依照下線層級顯示成員數量 & 是否有新成員加入
  level: number; // 當前等級
  hasNewMembers: boolean; // 是否有新成員加入, 預設為 false, TeamClubPage的detail紅點會用到
}

/**
 * for 俱樂部 - 俱樂部主頁資訊
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostTeamMemberSummaryEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<TeamMemberSummaryResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_TEAM_MEMBER_SUMMARY_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<TeamMemberSummaryResponse>
): TeamMemberSummaryResult => {
  const resp = response?.Body;

  const tier1 = resp?.tier1 || 0;
  const tier2 = resp?.tier2 || 0;
  const tier3 = resp?.tier3 || 0;

  const tiers = [tier1, tier2, tier3];

  const subordinateLevelItems = tiers.map((item, index) => {
    const hasNewMembers = resp?.teamDetails?.[`${index + 1}`]?.hasNew || false;
    return {
      tier: index + 1,
      members: item,
      hasNewMembers: hasNewMembers,
    };
  });

  // resp.teamDetails 的hasNew是否有为true的，给俱乐部显示红点使用
  const hasNewMembers = subordinateLevelItems.some(
    (item) => item.hasNewMembers
  );

  return {
    totalMembers: resp?.totalNumberOfMembers || 0,
    level: resp?.level || 0,
    subordinateSummary: {
      todayJoinCount: resp?.today || 0,
      yesterdayJoinCount: resp?.yesterday || 0,
      thisMonthJoinCount: resp?.latestMonth || 0,
    },
    subordinateLevelItems: subordinateLevelItems,
    hasNewMembers
  };
};

export default PostTeamMemberSummaryEndpoint;
