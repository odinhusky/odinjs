import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '../../handleGlobalClick';
import {
  handleTaskListModalNotShowTodayClick,
  handleTaskListModalBtnClickAction,
  handleTaskListModalCloseClickAction,
} from '@mode2/action/actionTypes';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';
import useTaskListModalStore from '@libs/mode2/zustand/modal/TaskListModal/useTaskListModalStore';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import { AnnouncementType } from '@libs/mode2/@types/announcementType';
import dayjs from '@commonUtils/localizedDayjs';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@libs/mode2/localforage/user';
import sdkUtils from '@libs/mode2/utils/sdk';
import { MissionType } from '@mode2API/endpoint/mission/PostMissionOngoingEndpoint';

export interface TaskListModalShowTimeData {
  // expTime: number; // 剩餘時間 // 不需要紀錄剩餘時間，有可能倒數是從後端來的
  closeTime: number; // 記錄上一次關閉彈窗時間
  disableDuration: number; // 紀錄 當天是否在顯示，禁用到多久
  // id: string;
}

type ActionClickPayloadMap = {
  [handleTaskListModalCloseClickAction]: { uniqueId: string };
  [handleTaskListModalNotShowTodayClick]: { value: boolean };
  [handleTaskListModalBtnClickAction]: {
    type: `${AnnouncementType}`;
    uniqueId: string;
  };
};

export interface HandleTaskListModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useTaskListModalActions = () => {
  const { navToTaskCenterPage } = useNavPageClick();
  const setShowTaskListModal = useTaskListModalStore(
    (state) => state.setShowTaskListModal
  );
  const setIsNotShowToday = useTaskListModalStore(
    (state) => state.setIsNotShowToday
  );

  const updateAppStartShownSeveralTimes = useTaskListModalStore(
    (state) => state.updateAppStartShownSeveralTimes
  );

  const taskListStore = userLocalForage.getInstance(
    UserLocalforageStoreKeys.TASK_LIST
  );

  // 紀錄當下的時間以及今天是否要再顯示
  const recordShowTimeData = async () => {
    const currentUniqueId = useTaskListModalStore.getState().currentUniqueId;
    const isNotShowToday = useTaskListModalStore.getState().isNotShowToday;
    const userId = useUserProfileStore.getState().id;

    const data: TaskListModalShowTimeData = {
      closeTime: dayjs().unix(), // 剩餘時間
      disableDuration: isNotShowToday ? dayjs().startOf('day').unix() : 0, // 1745205613
      // id: currentUniqueId,
    };

    taskListStore.setItem(
      userId.toString() + currentUniqueId,
      sdkUtils.encryption(JSON.stringify(data))
    );
  };

  const handleClose = ({
    isNext = true,
    uniqueId,
  }: {
    isNext?: boolean;
    uniqueId: string;
  }) => {
    updateAppStartShownSeveralTimes(uniqueId);
    setShowTaskListModal(false);

    // 紀錄是否今天內要再顯示
    recordShowTimeData();

    // 關閉modal 必須呼要下一個
    if (isNext) useModalLayoutStore.getState().verifyNextStep('TaskListAction');
  };

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleTaskListModalCloseClickAction]: ({ uniqueId }) => {
      handleGlobalClick({
        target: handleTaskListModalCloseClickAction,
        payload: { uniqueId },
        callback: () => {
          handleClose({ uniqueId });
        },
      });
    },
    [handleTaskListModalNotShowTodayClick]: ({ value }) => {
      handleGlobalClick({
        target: handleTaskListModalNotShowTodayClick,
        payload: { value },
        callback: () => {
          setIsNotShowToday(value);
        },
      });
    },
    [handleTaskListModalBtnClickAction]: ({ type, uniqueId }) => {
      handleGlobalClick({
        target: handleTaskListModalBtnClickAction,
        payload: { type, uniqueId },
        callback: () => {
          const missionType =
            type === AnnouncementType.DAILY_TASK
              ? MissionType.DAILY
              : MissionType.NEW_PLAYER;
          navToTaskCenterPage('', {
            state: { tab: missionType },
          });
          // 導頁去 task_center 的時候不需要在呼叫下一個 modal 顯示
          handleClose({ uniqueId, isNext: false });
        },
      });
    },
  };

  const handleTaskListModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleTaskListModalActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleTaskListModalClick,
  };
};
