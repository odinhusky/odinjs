import { AnnouncementType } from '@libs/mode2/@types/announcementType';
import { MissionResult } from '@libs/mode2/external/api/endpoint/mission/PostMissionOngoingEndpoint';
import { create } from 'zustand';

export interface TaskListModalStoreTypes {
  currentUniqueId: string;
  setCurrentUniqueId: (uniqueId: string) => void;

  isShowTaskListModal: boolean;
  setShowTaskListModal: (isShow: boolean) => void;

  appStartShownSeveralTimes: string[];
  updateAppStartShownSeveralTimes: (uniqueId: string) => void;

  isNotShowToday: boolean;
  setIsNotShowToday: (bool: boolean) => void;

  currentTaskListType: AnnouncementType;
  setCurrentTaskListType: (type: AnnouncementType) => void;

  taskList: MissionResult[];
  setTaskList: (taskList: MissionResult[]) => void;

  vigorExpireTime: number;
  setVigorExpireTime: (vigorExpireTime: number) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useTaskListModalStore = create<TaskListModalStoreTypes>(
  (set, get) => ({
    currentUniqueId: '-1',
    setCurrentUniqueId: (uniqueId) =>
      set(() => ({
        currentUniqueId: uniqueId,
      })),
    isShowTaskListModal: false,
    setShowTaskListModal: (isShow) =>
      set(() => ({
        isShowTaskListModal: isShow,
      })),

    appStartShownSeveralTimes: [],
    updateAppStartShownSeveralTimes: (orderId) =>
      set(() => ({
        appStartShownSeveralTimes: [
          orderId,
          ...get().appStartShownSeveralTimes,
        ],
      })),

    isNotShowToday: false,
    setIsNotShowToday: (isNotShowToday) =>
      set(() => ({
        isNotShowToday: isNotShowToday,
      })),

    currentTaskListType: AnnouncementType.NEW_PLAYER_TASK,
    setCurrentTaskListType: (currentTaskListType) =>
      set(() => ({
        currentTaskListType: currentTaskListType,
      })),

    taskList: [],
    setTaskList: (taskList) =>
      set(() => ({
        taskList: taskList,
      })),

    vigorExpireTime: 0,
    setVigorExpireTime: (vigorExpireTime) =>
      set(() => ({
        vigorExpireTime: vigorExpireTime,
      })),

    isLoading: true,
    setIsLoading: (isLoading) =>
      set(() => ({
        isLoading: isLoading,
      })),
  })
);

export default useTaskListModalStore;
