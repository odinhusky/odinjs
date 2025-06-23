import { create } from 'zustand';
import {
  ElementMetrics,
  defElementMetrics,
} from '@commonUtils/hooks/useObserverElementMetrics';
import {
  RankingRateInfoResult,
  RankingRulesResult,
} from '@mode2API/endpoint/ranking/PostRankingRulesEndpoint';
import { RankingMyRewardInfoResult } from '@mode2API/endpoint/ranking/PostRankingMyRewardsEndpoint';
import {
  MyRankingResult,
  RankingInfoResult,
  defaultRankingInfo,
} from '@libs/mode2/external/api/endpoint/ranking/PostRankingOngoingEndpoint';
import cloneDeep from 'lodash/cloneDeep';

export enum RankingPageTabs {
  MAIN = 'MAIN',
  RULE = 'RULE',
  RECORDS = 'RECORDS',
}

export const rankingPeriodsTabs = ['daily', 'weekly', 'monthly'];

export enum RankingPeriodsTabs {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface RankingPageTabConfig {
  id: RankingPageTabs;
  titleKey: string;
  isActive: boolean;
  isShowRedDot: boolean;
  isShow: boolean;
  className?: string;
}

export interface RankingDataType {
  rankingTop1: RankingInfoResult;
  rankingTop2: RankingInfoResult;
  rankingTop3: RankingInfoResult;
  // 其他排名
  otherRankings: RankingInfoResult[];
}

interface MainContentDataType {
  dailyJackpotFromAmount: number;
  dailyJackpotToAmount: number;
  mainContentJackpotAmount: number;
  mainContentJackpotAmountFrom: number;
  mainContentJackpotRate: number;
  mainContentRankingData: RankingDataType;
  mainContentMyRanking: MyRankingResult;
}

const initMainContentData: MainContentDataType = {
  dailyJackpotFromAmount: 0,
  dailyJackpotToAmount: 0,
  mainContentJackpotAmount: 0,
  mainContentJackpotAmountFrom: 0,
  mainContentJackpotRate: 0,
  mainContentRankingData: {
    rankingTop1: { ...defaultRankingInfo },
    rankingTop2: { ...defaultRankingInfo },
    rankingTop3: { ...defaultRankingInfo },
    otherRankings: [],
  },
  mainContentMyRanking: {
    currentRanking: 0,
    lastRanking: 0,
    betAmount: 0,
    rewardRate: 0,
    ranksLeft: 0,
  },
};

export type RankingPageStoreTypes = {
  rankingPageTab: RankingPageTabs;
  setRankingPageTab: (tab: RankingPageTabs) => void;

  isRankingSummaryLoading: boolean;
  setIsRankingSummaryLoading: (bool: boolean) => void;

  rankingSummaryPeriodsActiveTab: RankingPeriodsTabs;
  setRankingSummaryPeriodsActiveTab: (tab: RankingPeriodsTabs) => void;

  currentDisplayPeriodsActiveTab: RankingPeriodsTabs;
  setCurrentDisplayPeriodsActiveTab: (tab: RankingPeriodsTabs) => void;

  summaryElMetrics: ElementMetrics;
  setSummaryElMetrics: (elMetrics: ElementMetrics) => void;

  jockPotElMetrics: ElementMetrics;
  setJockPotElMetrics: (elMetrics: ElementMetrics) => void;

  isRankingOngoingSuccess: boolean;
  setIsRankingOngoingSuccess: (bool: boolean) => void;

  prevDailyJockPotNum: number;
  setPrevDailyJockPotNum: (num: number) => void;

  prevWeeklyJockPotNum: number;
  setPrevWeeklyJockPotNum: (num: number) => void;

  prevMonthlyJockPotNum: number;
  setPrevMonthlyJockPotNum: (num: number) => void;

  dailyJackpotFromAmount: number;
  setDailyJackpotFromAmount: (dailyJackpotFromAmount: number) => void;

  dailyJackpotToAmount: number;
  setDailyJackpotToAmount: (dailyJackpotToAmount: number) => void;

  mainContentJackpotAmount: number;
  setMainContentJackpotAmount: (mainContentJackpotAmount: number) => void;

  mainContentJackpotAmountFrom: number;
  setMainContentJackpotAmountFrom: (
    mainContentJackpotAmountFrom: number
  ) => void;

  mainContentJackpotRate: number;
  setMainContentJackpotRate: (mainContentJackpotRate: number) => void;

  mainContentRankingData: RankingDataType;
  setMainContentRankingData: (data: RankingDataType) => void;

  mainContentMyRanking: MyRankingResult;
  setMainContentMyRanking: (mainContentMyRanking: MyRankingResult) => void;

  resetMainContentData: () => void;

  // rankingPageTabs: RankingPageTabConfig[];
  // setRankingPageTabs: (tabs: RankingPageTabConfig[]) => void;

  isShowRankingShareModal: boolean;
  setIsShowRankingShareModal: (bool: boolean) => void;

  rankingRulesResult: RankingRulesResult;
  setRankingRulesResult: (result: RankingRulesResult) => void;

  rankingMyRewardResults: RankingMyRewardInfoResult[];
  setRankingMyRewardResults: (results: RankingMyRewardInfoResult[]) => void;

  setRankingData: (data: Partial<RankingPageStoreTypes>) => void;
};

export const useRankingPageStore = create<RankingPageStoreTypes>()(
  (set, get) => ({
    rankingPageTab: RankingPageTabs.MAIN,
    setRankingPageTab: (tab) => set(() => ({ rankingPageTab: tab })),

    isRankingSummaryLoading: true,
    setIsRankingSummaryLoading: (bool) =>
      set(() => ({ isRankingSummaryLoading: bool })),

    rankingSummaryPeriodsActiveTab: RankingPeriodsTabs.DAILY,
    setRankingSummaryPeriodsActiveTab: (tab) =>
      set(() => ({ rankingSummaryPeriodsActiveTab: tab })),

    currentDisplayPeriodsActiveTab: RankingPeriodsTabs.DAILY,
    setCurrentDisplayPeriodsActiveTab: (tab) =>
      set(() => ({ currentDisplayPeriodsActiveTab: tab })),

    summaryElMetrics: defElementMetrics,
    setSummaryElMetrics: (elMetrics) =>
      set(() => ({ summaryElMetrics: elMetrics })),

    jockPotElMetrics: defElementMetrics,
    setJockPotElMetrics: (elMetrics) =>
      set(() => ({ jockPotElMetrics: elMetrics })),

    ...initMainContentData,

    isRankingOngoingSuccess: false,
    setIsRankingOngoingSuccess: (bool) =>
      set(() => ({
        isRankingOngoingSuccess: bool,
      })),

    prevDailyJockPotNum: 0,
    setPrevDailyJockPotNum: (num) =>
      set(() => ({
        prevDailyJockPotNum: num,
      })),

    prevWeeklyJockPotNum: 0,
    setPrevWeeklyJockPotNum: (num) =>
      set(() => ({
        prevWeeklyJockPotNum: num,
      })),

    prevMonthlyJockPotNum: 0,
    setPrevMonthlyJockPotNum: (num) =>
      set(() => ({
        prevMonthlyJockPotNum: num,
      })),

    setDailyJackpotFromAmount: (dailyJackpotFromAmount) =>
      set(() => ({
        dailyJackpotFromAmount,
      })),

    setDailyJackpotToAmount: (dailyJackpotToAmount) =>
      set(() => ({
        dailyJackpotToAmount,
      })),

    setMainContentJackpotAmount: (mainContentJackpotAmount: number) =>
      set(() => ({
        mainContentJackpotAmount,
      })),

    setMainContentJackpotAmountFrom: (mainContentJackpotAmountFrom: number) =>
      set(() => ({
        mainContentJackpotAmountFrom,
      })),

    setMainContentJackpotRate: (mainContentJackpotRate: number) =>
      set(() => ({
        mainContentJackpotRate,
      })),

    setMainContentRankingData: (data) =>
      set(() => ({
        mainContentRankingData: data,
      })),

    setMainContentMyRanking: (mainContentMyRanking) =>
      set(() => ({ mainContentMyRanking })),

    resetMainContentData: () =>
      set(() => ({
        ...cloneDeep(initMainContentData),
      })),
    // rankingPageTabs: [] as RankingPageTabConfig[],
    // setRankingPageTabs: (tabs) => set(() => ({ rankingPageTabs: tabs })),

    isShowRankingShareModal: false,
    setIsShowRankingShareModal: (bool) =>
      set(() => ({ isShowRankingShareModal: bool })),

    rankingRulesResult: {
      dailyTotalRebate: 0,
      weeklyTotalRebate: 0,
      monthlyTotalRebate: 0,
      rankingRates: [],
    },
    setRankingRulesResult: (result) =>
      set(() => ({ rankingRulesResult: result })),

    rankingMyRewardResults: [],
    setRankingMyRewardResults: (results) =>
      set(() => ({ rankingMyRewardResults: results })),

    setRankingData: (data) => set((state) => ({ ...state, ...data })),
  })
);
