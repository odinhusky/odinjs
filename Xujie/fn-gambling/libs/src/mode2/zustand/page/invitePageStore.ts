import { create } from 'zustand';
import { ClipboardInfo, ClipboardState } from '@commonUtils/hooks/useClipboard';
import {
  PromoteHomeResult,
  RateInfoResult,
} from '@mode2API/endpoint/team/PostPromoteHomeEndpoint';
import { VoidAction } from '@libs/mode2/@types/commonTypes';
import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';
import { I18NContent } from '@libs/mode2/@types/i18nType';

// - Tab List ==================================

export interface InvitePageTab {
  id: InvitePageTabType;
  title: string;
  isActive: boolean;
  isShowRedDot: boolean;
  isShow: boolean;
}

export interface Mode2InvitePageTabStoreTypes {
  isShowRedDot: boolean;
  setIsShowRedDot: (bool: boolean) => void;
  inviteCurTab: InvitePageTabType;
  setInviteCurTab: (tab: InvitePageTabType) => void;
  tabList: InvitePageTab[];
  setTabList: (list: InvitePageTab[]) => void;
}

export const useMode2InviteTabStore = create<Mode2InvitePageTabStoreTypes>()(
  (set) => ({
    isShowRedDot: false,
    setIsShowRedDot: (bool) => set(() => ({ isShowRedDot: bool })),
    inviteCurTab: InvitePageTabType.STATISTICS,
    setInviteCurTab: (tab) => set(() => ({ inviteCurTab: tab })),
    tabList: [] as InvitePageTab[],
    setTabList: (list) => set(() => ({ tabList: list })),
  })
);

interface InvitePageActionsStoreTypes {
  inviteTabActionList: VoidAction[];
  setInviteTabActionList: (list: VoidAction[]) => void;
}

// Actions 的行為就不做資料固化
export const useMode2InvitePageActionsStore =
  create<InvitePageActionsStoreTypes>((set) => ({
    inviteTabActionList: [] as VoidAction[],
    setInviteTabActionList: (list) =>
      set(() => ({ inviteTabActionList: list })),
  }));

// - Earn Store ==================================

export interface IconUrlUnit {
  name: string;
  url: string;
}

export interface EarnUnit {
  id: string | number;
  title: I18NContent;
  url: string;
  desc: I18NContent;
}

export interface Mode2InvitePageEarnStoreTypes {
  fetchNumber: number;
  refreshPromoteHomeData: () => void;
  lastFetchTime: number;
  setLastFetchTime: (time: number) => void;
  earnHeaderList: EarnUnit[];
  setEarnHeaderList: (list: EarnUnit[]) => void;
  clipboardLinkResult: ClipboardInfo;
  setClipboardLinkResult: (result: ClipboardInfo) => void;
  promoteHomeData?: PromoteHomeResult;
  setPromoteHomeData: (data: PromoteHomeResult) => void;
}

export const useMode2InviteEarnStore = create<Mode2InvitePageEarnStoreTypes>()(
  (set, get) => ({
    fetchNumber: -1,
    refreshPromoteHomeData: () =>
      set(() => ({ fetchNumber: get().fetchNumber + 1 })),
    lastFetchTime: 0,
    setLastFetchTime: (time) => set(() => ({ lastFetchTime: time })),
    setPromoteHomeData: (data) => set(() => ({ promoteHomeData: data })),
    earnHeaderList: [] as EarnUnit[],
    setEarnHeaderList: (list) => set(() => ({ earnHeaderList: list })),
    clipboardLinkResult: {
      state: ClipboardState.INCOMPLETE,
      message: '',
    },
    setClipboardLinkResult: (result) =>
      set(() => ({ clipboardLinkResult: result })),
  })
);

// - Statics Store ==================================

export interface StaticsHeaderUnit {
  title: string;
  desc: I18NContent;
  url: string;
}

interface StatisticsExampleData {
  name: string;
  betting: number;
  percentage: number;
}

interface StatisticsLevelExampleData {
  level1: StatisticsExampleData;
  level2: StatisticsExampleData;
  level3: StatisticsExampleData;
  exampleDataSource: StatisticsExampleData[];
  rateResult: number;
}

const defaultStatisticsLevelExampleData: StatisticsLevelExampleData = {
  level1: { name: '', betting: 0, percentage: 0 },
  level2: { name: '', betting: 0, percentage: 0 },
  level3: { name: '', betting: 0, percentage: 0 },
  exampleDataSource: [],
  rateResult: 0,
};

export interface DivContent {
  className?: string;
  content: I18NContent | JSX.Element;
}

export interface RewardUnit {
  level: number;
  betAmount: number;
  activeMember: number;
  bonus: number;
}

export interface WeeklyDataUnit {
  currentLevel: number;
  bonus: number;
  lastWeek: number;
}

export interface QAUnit {
  question: I18NContent;
  answer: (I18NContent | DivContent)[];
  action: () => void;
}

export interface useMode2InvitePageStaticsStoreTypes {
  statisticsHeaderList: StaticsHeaderUnit[];
  setStatisticsHeaderList: (list: StaticsHeaderUnit[]) => void;
  statisticsLevelExampleData: StatisticsLevelExampleData;
  setStatisticsLevelExampleData: (
    exampleData: StatisticsLevelExampleData
  ) => void;
  rewardDataList: RewardUnit[];
  setRewardDataList: (list: RewardUnit[]) => void;
  weeklyData: WeeklyDataUnit[];
  setWeeklyData: (list: WeeklyDataUnit[]) => void;
  expandedIndex: number;
  setExpandedIndex: (index: number) => void;
  qaList: QAUnit[];
  setQaList: (list: QAUnit[]) => void;
}

export const useMode2InvitePageStaticsStore =
  create<useMode2InvitePageStaticsStoreTypes>()((set) => ({
    statisticsHeaderList: [] as StaticsHeaderUnit[],
    setStatisticsHeaderList: (list) =>
      set(() => ({ statisticsHeaderList: list })),
    statisticsLevelExampleData: defaultStatisticsLevelExampleData,
    setStatisticsLevelExampleData: (exampleData) =>
      set(() => ({ statisticsLevelExampleData: exampleData })),
    rewardDataList: [] as RewardUnit[],
    setRewardDataList: (list) => set(() => ({ rewardDataList: list })),
    weeklyData: [] as WeeklyDataUnit[],
    setWeeklyData: (list) => set(() => ({ weeklyData: list })),
    expandedIndex: 0,
    setExpandedIndex: (index) => set(() => ({ expandedIndex: index })),
    qaList: [] as QAUnit[],
    setQaList: (list) => set(() => ({ qaList: list })),
  }));

// - Team Store ==================================

export interface TableDataBodyUnit {
  id?: number | string;
  bodyTitle: I18NContent;
  bodyValue: number;
}

export interface TableDataUnit {
  bodyData: TableDataBodyUnit[];
}

export interface useMode2InvitePageTeamStoreTypes {
  totalNumberOfInvitees: TableDataUnit;
  setTotalNumberOfInvitees: (data: TableDataUnit) => void;
  newNumberOfInvitees: TableDataUnit;
  setNewNumberOfInvitees: (data: TableDataUnit) => void;
  betValue: TableDataUnit;
  setBetValue: (data: TableDataUnit) => void;
  numberOfDeposits: TableDataUnit;
  setNumberOfDeposits: (data: TableDataUnit) => void;
  activeMemberLevel: TableDataUnit;
  setActiveMemberLevel: (data: TableDataUnit) => void;
  weeklySalaryReward: TableDataUnit;
  setWeeklySalaryReward: (data: TableDataUnit) => void;
  rankingRewards: TableDataUnit;
  setRankingRewards: (data: TableDataUnit) => void;
  totalCommission: TableDataUnit;
  setTotalCommission: (data: TableDataUnit) => void;
  rateInfo: RateInfoResult;
  setRateInfo: (rateInfo: RateInfoResult) => void;
}

export const useMode2InvitePageTeamStore =
  create<useMode2InvitePageTeamStoreTypes>()((set) => ({
    totalNumberOfInvitees: {
      bodyData: [] as TableDataBodyUnit[],
    },
    setTotalNumberOfInvitees: (data) =>
      set(() => ({ totalNumberOfInvitees: data })),

    newNumberOfInvitees: {
      bodyData: [] as TableDataBodyUnit[],
    },
    setNewNumberOfInvitees: (data) =>
      set(() => ({ newNumberOfInvitees: data })),

    betValue: {
      bodyData: [] as TableDataBodyUnit[],
    },
    setBetValue: (data) => set(() => ({ betValue: data })),

    numberOfDeposits: {
      bodyData: [] as TableDataBodyUnit[],
    },
    setNumberOfDeposits: (data) => set(() => ({ numberOfDeposits: data })),

    activeMemberLevel: {
      bodyData: [] as TableDataBodyUnit[],
    },
    setActiveMemberLevel: (data) => set(() => ({ activeMemberLevel: data })),

    weeklySalaryReward: {
      bodyData: [] as TableDataBodyUnit[],
    },
    setWeeklySalaryReward: (data) => set(() => ({ weeklySalaryReward: data })),

    rankingRewards: {
      bodyData: [] as TableDataBodyUnit[],
    },
    setRankingRewards: (data) => set(() => ({ rankingRewards: data })),

    totalCommission: {
      bodyData: [] as TableDataBodyUnit[],
    },
    setTotalCommission: (data) => set(() => ({ totalCommission: data })),
    rateInfo: { level1: 0, level2: 0, level3: 0 } as RateInfoResult,
    setRateInfo: (rateInfo) => set(() => ({ rateInfo: rateInfo })),
  }));

// - Ranking List Store ==================================

export interface RankingUnit {
  ranking: number;
  id: string;
  betAmount: number;
  bonus: number;
}

export interface useMode2InvitePageRankingListStoreTypes {
  showLastData: boolean;
  setShowLastData: (bool: boolean) => void;
  rankingBonus: number;
  setRankingBonus: (value: number) => void;
  rankingData: RankingUnit[];
  setRankingData: (list: RankingUnit[]) => void;
  countdownSec: number;
  setCountdownTIme: (time: number) => void;
}

export const useMode2InvitePageRankingListStore =
  create<useMode2InvitePageRankingListStoreTypes>()((set) => ({
    showLastData: false,
    setShowLastData: (bool) => set(() => ({ showLastData: bool })),
    rankingBonus: 0,
    setRankingBonus: (value) => set(() => ({ rankingBonus: value })),
    rankingData: [] as RankingUnit[],
    setRankingData: (list) => set(() => ({ rankingData: list })),
    countdownSec: 0,
    setCountdownTIme: (value) => set(() => ({ countdownSec: value })),
  }));
