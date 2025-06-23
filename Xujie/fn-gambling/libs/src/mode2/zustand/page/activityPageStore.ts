import { create } from 'zustand';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import { VipRewardInfoResult } from '@libs/mode2/external/api/endpoint/team/PostVipRewardHistoryEndpoint';
import { AnnouncementResult } from '@mode2API/endpoint/user/PostHomeEndpoint';

// - Switch Page List ===================================

export interface SwitchPageUnit {
  id: number | string;
  isActive: boolean;
  i18n: I18NContent;
  action: () => void;
}

export interface useMode2ActivitySwitchPageStoreTypes {
  pageIdx: ActivityPageTabType;
  setPageIdx: (idx: ActivityPageTabType) => void;
  switchList: SwitchPageUnit[];
  setSwitchList: (list: SwitchPageUnit[]) => void;
}

export const useMode2ActivitySwitchPageStore =
  create<useMode2ActivitySwitchPageStoreTypes>((set) => ({
    pageIdx: ActivityPageTabType.ACTIVITY,
    setPageIdx: (idx) => set(() => ({ pageIdx: idx })),
    switchList: [] as SwitchPageUnit[],
    setSwitchList: (list) => set(() => ({ switchList: list })),
  }));
//  View 所需要的 Store 不會因為固化條件限制 onAction() 需再抽一層 Store

// export const useMode2ActivitySwitchPageStore =
//   create<useMode2ActivitySwitchPageStoreTypes>()(
//     devtoolsAndPersistWrapper(
//       '[page store] useMode2ActivitySwitchPageStore',
//       (set) => ({
//         pageIdx: ActivityPageTab.ACTIVITY,
//         setPageIdx: (idx) => set(() => ({ pageIdx: idx })),
//         switchList: [] as SwitchPageUnit[],
//         setSwitchList: (list) => set(() => ({ switchList: list })),
//       })
//     )
//   );

// - Activity List ===================================

export interface ActivityUnit extends AnnouncementResult {}

export interface useMode2ActivityListStoreTypes {
  originalActivityList: ActivityUnit[];
  setOriginalActivityList: (list: ActivityUnit[]) => void;

  activityList: ActivityUnit[];
  setActivityList: (list: ActivityUnit[]) => void;
}

export const useMode2ActivityListStore =
  create<useMode2ActivityListStoreTypes>()((set) => ({
    originalActivityList: [] as ActivityUnit[],
    setOriginalActivityList: (list) =>
      set(() => ({ originalActivityList: list })),
    activityList: [] as ActivityUnit[],
    setActivityList: (list) => set(() => ({ activityList: list })),
  }));

// interface ActivityActionsStoreTypes {
//   activityActionList: VoidAction[];
//   setActivityActionList: (list: VoidAction[]) => void;
// }
//
// // Actions 的行為就不做資料固化
// export const useMode2ActivityActionsStore = create<ActivityActionsStoreTypes>(
//   (set) => ({
//     activityActionList: [] as VoidAction[],
//     setActivityActionList: (list) => set(() => ({ activityActionList: list })),
//   })
// );

// - MyBonus List ===================================

export enum EMyBonusTabList {
  MONTH = 'Month',
  ALL = 'All',
}

export const myBonusTabList = [
  {
    label: EMyBonusTabList.MONTH,
  },
  { label: EMyBonusTabList.ALL },
];

export interface useMode2MyBonusListStoreTypes {
  myBonusTabIndex: EMyBonusTabList;
  setMyBonusTabIndex: (value: EMyBonusTabList) => void;

  myBonusList: VipRewardInfoResult[];
  setMyBonusList: (list: VipRewardInfoResult[]) => void;

  totalRewards: number;
  setTotalRewards: (totalRewards: number) => void;
}

export const useMode2MyBonusListStore = create<useMode2MyBonusListStoreTypes>()(
  (set) => ({
    myBonusTabIndex: EMyBonusTabList.MONTH,
    setMyBonusTabIndex: (value) => set(() => ({ myBonusTabIndex: value })),

    myBonusList: [] as VipRewardInfoResult[],
    setMyBonusList: (list) => set(() => ({ myBonusList: list })),

    totalRewards: 0,
    setTotalRewards: (totalRewards) => set(() => ({ totalRewards })),
  })
);
// - MyBonus List ===================================
