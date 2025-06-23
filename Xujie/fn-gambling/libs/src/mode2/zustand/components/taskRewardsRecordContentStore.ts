import { create } from 'zustand';
import {
  MissionHistoryInfoResult,
  MissionHistoryPeriod,
} from '@mode2API/endpoint/mission/PostMissionHistoryEndpoint';

export interface PeriodTab {
  i18nKey: string;
  period: MissionHistoryPeriod;
  daysAgo: number;
}

interface TaskRewardsRecordContentStoreTypes {
  periodTabs: PeriodTab[];
  setPeriodTabs: (tabs: PeriodTab[]) => void;
  currentTab: PeriodTab;
  setCurrentTab: (tab: PeriodTab) => void;
  totalAmount: number;
  setTotalAmount: (amount: number) => void;
  rewardList: MissionHistoryInfoResult[];
  setRewardList: (list: MissionHistoryInfoResult[]) => void;
  reset: () => void;
}

export const useTaskRewardsRecordContentStore =
  create<TaskRewardsRecordContentStoreTypes>((set) => ({
    periodTabs: [],
    setPeriodTabs: (tabs) => set({ periodTabs: tabs }),
    currentTab: {
      i18nKey: '',
      period: MissionHistoryPeriod.TODAY,
      daysAgo: 0,
    },
    setCurrentTab: (tab) => set({ currentTab: tab }),
    totalAmount: 0,
    setTotalAmount: (amount) => set({ totalAmount: amount }),
    rewardList: [],
    setRewardList: (list) => set({ rewardList: list }),
    reset: () =>
      set({
        currentTab: {
          i18nKey: '',
          period: MissionHistoryPeriod.TODAY,
          daysAgo: 0,
        },
      }),
  }));
