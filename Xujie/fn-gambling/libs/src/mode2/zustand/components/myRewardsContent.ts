import { create } from 'zustand';

export interface TeamLevelUnit {
  id: string;
  level: number;
  clubLevel: number;
  isHighest: boolean;
  isAchieve: boolean;
  currentMembers: number;
  currentBets: number;
  requiredMembers: number;
  requiredBets: number;
  betRebateRate: number;
  firstDepositRebates: number;
  maxRewards: number;
  clubTitle: string;
}

export interface TeamClubLevelSummaryStoreTypes {
  teamLevelConfigList: TeamLevelUnit[];
  setTeamLevelConfigList: (list: TeamLevelUnit[]) => void;
  currentTeamLevel: number;
  setCurrentTeamLevel: (level: number) => void;
}

export const useTeamClubLevelSummaryStore =
  create<TeamClubLevelSummaryStoreTypes>((set) => ({
    teamLevelConfigList: [] as TeamLevelUnit[],
    setTeamLevelConfigList: (list) =>
      set(() => ({ teamLevelConfigList: list })),
    currentTeamLevel: 0,
    setCurrentTeamLevel: (level) =>
      set(() => ({
        currentTeamLevel: level,
      })),
  }));

export interface TeamClubWithDrawStoreTypes {
  isShowReceivedModal: boolean;
  setIsShowReceivedModal: (bool: boolean) => void;
  isClaimable: boolean;
  setIsClaimable: (bool: boolean) => void;
  rewards: number;
  setRewards: (rewards: number) => void;
  todayReward: number;
  setTodayReward: (todayReward: number) => void;
  totalReward: number;
  setTotalReward: (totalReward: number) => void;
  currentTeamTotalBets: number;
  setCurrentTeamTotalBets: (currentTeamTotalBets: number) => void;
  refreshTeamInformationCount: number;
  setRefreshTeamInformationCount: () => void;
}

export const useTeamClubWithDrawStore = create<TeamClubWithDrawStoreTypes>(
  (set, get) => ({
    isShowReceivedModal: false,
    setIsShowReceivedModal: (bool) =>
      set(() => ({ isShowReceivedModal: bool })),
    isClaimable: false,
    setIsClaimable: (bool) => set(() => ({ isClaimable: bool })),
    rewards: 0,
    setRewards: (rewards) => set(() => ({ rewards })),
    todayReward: 0,
    setTodayReward: (todayReward) => set(() => ({ todayReward })),
    totalReward: 0,
    setTotalReward: (totalReward) => set(() => ({ totalReward })),
    currentTeamTotalBets: 0,
    setCurrentTeamTotalBets: (currentTeamTotalBets) =>
      set(() => ({ currentTeamTotalBets })),
    refreshTeamInformationCount: 0,
    setRefreshTeamInformationCount: () =>
      set(() => ({
        refreshTeamInformationCount: get().refreshTeamInformationCount + 1,
      })),
  })
);
