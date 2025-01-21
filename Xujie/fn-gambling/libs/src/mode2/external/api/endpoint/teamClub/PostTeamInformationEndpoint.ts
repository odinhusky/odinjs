import { ExternalEndpoint } from '@mode2API/types';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { POST_TEAM_INFORMATION_URL } from '@mode2API/urls';

export interface TeamInformationResponse {
  teamLevel?: number;

  requiredBets?: number;
  requiredMemberNum?: number;
  teamMemberNum?: number;
  teamTotalBets?: number;

  // items
  levelRewards?: [
    {
      firstDepositRebate?: number;
      inviteRebate?: number;
      level?: number;
      rebate?: number;
      requiredBet?: number;
      requiredNum?: number;
    }
  ];

  // info
  claimableReward?: number;
  todayReward?: number;
  totalReward?: number;
}

export interface TeamClubLevelInfo {
  isAchieve: boolean; // 是否當前等級達標
  level: number; // 等級

  currentMembers: number; // 當前成員數量
  requiredMembers: number; // 所需成員數量
  currentBets: number; // 當前投注數量
  requiredBets: number; // 所需投注數量

  betRebateRate: number; // 反水率
  firstDepositRebates: number; // 首次充值回饋
  maxRewards: number; // 最大回饋
}

export interface TeamClubWithdrawInfo {
  isClaimable: boolean; // 可領取狀態
  rewards: number; // 當前可領獎勵
  todayReward: number; // 今天講理
  totalReward: number; // 全部獎勵
}

export interface TeamInformationResult {
  currentTeamLevel: number; // 當前團隊等級
  currentTotalTeamMembers: number; // 當前成員數量
  currentTeamTotalBets: number; // 當前投注數量
  teamClubLevelItems: TeamClubLevelInfo[]; // 團隊等級資訊
  teamClubWithdrawInfo: TeamClubWithdrawInfo; // 團隊獎勵可領資訊
}

const defaultTeamClubLevelItems = [0, 1, 2, 3].map((item) => {
  return {
    isAchieve: false,
    level: item,
    currentMembers: 0,
    requiredMembers: 0,
    currentBets: 0,
    requiredBets: 0,
    betRebateRate: 0,
    firstDepositRebates: 0,
    maxRewards: 0,
  };
});

/**
 * for 俱樂部 - 俱樂部主頁資訊
 * @param builder
 * @constructor
 * @author Odin
 */
export const PostTeamInformationEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<TeamInformationResult, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_TEAM_INFORMATION_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<TeamInformationResponse>
): TeamInformationResult => {
  const resp = response?.Body;

  const currentTeamTotalBets = parseFloat(
    (resp?.teamTotalBets || 0).toFixed(2)
  );
  const currentTeamMembers = resp?.teamMemberNum || 0;
  const currentTeamLevel = resp?.teamLevel || 0;

  //  團隊等級資訊 給預設 4 筆
  const teamClubLevelItems: TeamClubLevelInfo[] =
    resp?.levelRewards?.map((item) => {
      const isAchieve = currentTeamLevel >= (item.level || 0);
      const betRebateRate = parseFloat(((item.rebate || 0) * 100).toFixed(2));
      const firstDepositRebates = parseFloat(
        ((item.firstDepositRebate || 0) * 100).toFixed(2)
      );
      const requiredMembers = item?.requiredNum || 0;
      const requiredBets = item?.requiredBet || 0;

      return {
        isAchieve: isAchieve,
        level: item?.level || 0,
        currentMembers: Math.min(requiredMembers, currentTeamMembers),
        requiredMembers: item?.requiredNum || 0,
        currentBets: Math.min(requiredBets, currentTeamTotalBets),
        requiredBets: item?.requiredBet || 0,
        betRebateRate: betRebateRate,
        firstDepositRebates: firstDepositRebates,
        maxRewards: parseFloat((item.inviteRebate || 0).toFixed(2)),
      };
    }) || defaultTeamClubLevelItems;

  return {
    currentTeamLevel: resp?.teamLevel || 0,
    teamClubLevelItems: teamClubLevelItems,
    currentTotalTeamMembers: resp?.teamMemberNum || 0,
    currentTeamTotalBets: currentTeamTotalBets || 0,
    teamClubWithdrawInfo: {
      isClaimable: (resp?.claimableReward || 0) > 0,
      rewards: resp?.claimableReward || 0,
      todayReward: resp?.todayReward || 0,
      totalReward: resp?.totalReward || 0,
    },
  };
};

export default PostTeamInformationEndpoint;
