import { create } from 'zustand';
import {
  RankingHistoryInfoResult,
  RankingHistoryType,
} from '@mode2API/endpoint/ranking/PostRankingHistoryEndpoint';

export type RankingRewardsHistoryModalStoreTypes = {
  isShowRankingRewardsHistoryModal: boolean;
  setShowRankingRewardsHistoryModal: (isShow: boolean) => void;
  rewardsHistoryTab: RankingHistoryType;
  setRewardsHistoryTab: (tab: RankingHistoryType) => void;

  jackpotAmount: number;
  setJackpotAmount: (value: number) => void;

  rankingRewards: RankingHistoryInfoResult[];
  setRankingRewards: (values: RankingHistoryInfoResult[]) => void;

  resetData: () => void;
};

export const useRankingRewardsHistoryModalStore =
  create<RankingRewardsHistoryModalStoreTypes>()((set) => ({
    isShowRankingRewardsHistoryModal: false,
    setShowRankingRewardsHistoryModal: (isShow) =>
      set(() => ({ isShowRankingRewardsHistoryModal: isShow })),

    rewardsHistoryTab: RankingHistoryType.D,
    setRewardsHistoryTab: (tab) => set(() => ({ rewardsHistoryTab: tab })),

    jackpotAmount: 0,
    setJackpotAmount: (value) => set(() => ({ jackpotAmount: value })),

    rankingRewards: [],
    setRankingRewards: (values) => set(() => ({ rankingRewards: values })),

    resetData: () => set(() => ({ jackpotAmount: 0 })),
  }));
