import { create } from 'zustand';
import {
  MissionBoxResult,
  MissionResult,
  MissionType,
} from '@mode2API/endpoint/mission/PostMissionOngoingEndpoint';
import { MissionTipNumbersResult } from '@mode2API/endpoint/mission/PostMissionTipNumbersEndpoint';

interface TaskCenterDashboard {
  vigor: number;
  vigorExpireTime: number;
  vigorBoxItems: MissionBoxResult[];
}

interface ShowTaskCenterModal {
  show: boolean;
  detail: string;
}

export type TaskCenterPageStoreTypes = {
  currentMissionType: MissionType;
  setCurrentMissionType: (type: MissionType) => void;
  missionTipBadges: MissionTipNumbersResult;
  setMissionTipBadges: (badges: MissionTipNumbersResult) => void;
  isAllClaimable: boolean;
  setIsAllClaimable: (isAllClaimable: boolean) => void;
  allClaimableIds: number[];
  setAllClaimableIds: (ids: number[]) => void;
  refreshOngoinhCount: number;
  addRefreshOngoinhCount: () => void;
  dashboardInfo: TaskCenterDashboard;
  setDashboardInfo: (dashboard: TaskCenterDashboard) => void;
  misssionLoading: boolean;
  setMissionLoading: (loading: boolean) => void;
  missionList: MissionResult[];
  setMissionList: (list: MissionResult[]) => void;
  ruleInnerHtml: string;
  setRuleInnerHtml: (html: string) => void;

  dashPrevCount: number;
  addDashPrevCount: () => void;
  dashNextCount: number;
  addDashNextCount: () => void;

  showModal: ShowTaskCenterModal;
  setShowModal: (show: ShowTaskCenterModal) => void;
  refreshTaskCenterCount: number;
  refreshTaskCenter: () => void;
};

export const useTaskCenterPageStore = create<TaskCenterPageStoreTypes>()(
  (set, get) => ({
    currentMissionType: MissionType.NEW_PLAYER,
    setCurrentMissionType: (type) => set(() => ({ currentMissionType: type })),
    missionTipBadges: {
      newPlayerBadge: 0,
      dailyBadge: 0,
      totalBadge: 0,
      isNewPlayerActivityPeriod: false,
    },
    setMissionTipBadges: (badges) => set(() => ({ missionTipBadges: badges })),
    isAllClaimable: false,
    setIsAllClaimable: (value) => set(() => ({ isAllClaimable: value })),
    allClaimableIds: [],
    setAllClaimableIds: (ids) =>
      set(() => ({
        allClaimableIds: ids,
      })),
    refreshOngoinhCount: 0,
    addRefreshOngoinhCount: () =>
      set((state) => ({
        refreshOngoinhCount: state.refreshOngoinhCount + 1,
      })),
    dashboardInfo: {
      vigor: 0,
      vigorExpireTime: 0,
      vigorBoxItems: [],
    },
    setDashboardInfo: (dashboard) => set(() => ({ dashboardInfo: dashboard })),
    misssionLoading: true,
    setMissionLoading: (loading) => set(() => ({ misssionLoading: loading })),
    missionList: [],
    setMissionList: (list) => set(() => ({ missionList: list })),
    ruleInnerHtml: '',
    setRuleInnerHtml: (html) => set(() => ({ ruleInnerHtml: html })),

    dashPrevCount: 0,
    addDashPrevCount: () =>
      set((state) => ({
        dashPrevCount: state.dashPrevCount + 1,
      })),

    dashNextCount: 0,
    addDashNextCount: () =>
      set((state) => ({
        dashNextCount: state.dashNextCount + 1,
      })),

    showModal: {} as ShowTaskCenterModal,
    setShowModal: (show) => set(() => ({ showModal: show })),
    refreshTaskCenterCount: 0,
    refreshTaskCenter: () =>
      set(() => ({ refreshTaskCenterCount: get().refreshTaskCenterCount + 1 })),
  })
);
