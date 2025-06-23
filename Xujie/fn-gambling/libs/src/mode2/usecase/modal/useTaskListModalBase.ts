import { AnnouncementType } from '@libs/mode2/@types/announcementType';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocationStore } from '@libs/mode2/zustand/locationStore';
import useTaskListModalStore from '@libs/mode2/zustand/modal/TaskListModal/useTaskListModalStore';
import useModalLayoutStore, {
  HallAdModelCommandTypes,
} from '@libs/mode2/zustand/template/modalLayoutStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { useCallback, useEffect } from 'react';
import { SourceFrom } from '../announcement/command/HallAdModelCommand';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@libs/mode2/localforage/user';
import { TaskListModalShowTimeData } from '@libs/mode2/action/model/TaskListModalAction/useTaskListModalActions';
import sdkUtils from '@libs/mode2/utils/sdk';
import hallAdModelInvoker from '../announcement/command/HallAdModelInvoker';
import {
  usePostPromoteDailyMissionMutation,
  usePostPromoteNewPlayerBonusMutation,
} from '@libs/mode2/external/api';
import { useDeepEffect } from '@libs/commonUtils';
import { MissionType } from '@libs/mode2/external/api/endpoint/mission/PostMissionOngoingEndpoint';
import { today } from '@libs/constant/date';

export const useTaskListModalBase = () => {
  /**
   * 來源 首頁 announcements ， app start 只顯示一次
   * 來源 socket，只要收到就排隊等待顯示，不限制app start
   */
  const hallAdModelCommandTypes = useModalLayoutStore(
    (state) => state.hallAdModelCommandTypes
  );

  const setShowTaskListModal = useTaskListModalStore(
    (state) => state.setShowTaskListModal
  );

  const appStartShownSeveralTimes = useTaskListModalStore(
    (state) => state.appStartShownSeveralTimes
  );

  const setCurrentTaskListType = useTaskListModalStore(
    (state) => state.setCurrentTaskListType
  );

  const setTaskList = useTaskListModalStore((state) => state.setTaskList);

  const setVigorExpireTime = useTaskListModalStore(
    (state) => state.setVigorExpireTime
  );

  const setIsLoading = useTaskListModalStore((state) => state.setIsLoading);

  const taskListStore = userLocalForage.getInstance(
    UserLocalforageStoreKeys.TASK_LIST
  );

  const setIsNotShowToday = useTaskListModalStore(
    (state) => state.setIsNotShowToday
  );

  const currentUniqueId = useTaskListModalStore(
    (state) => state.currentUniqueId
  );

  const setCurrentUniqueId = useTaskListModalStore(
    (state) => state.setCurrentUniqueId
  );

  // 每日任務
  const [postPromoteDailyMission, { data, isSuccess, isLoading }] =
    usePostPromoteDailyMissionMutation();

  // 新手福利
  const [
    postPromoteNewPlayerBonus,
    {
      data: newPlayerData,
      isSuccess: newPlayerIsSuccess,
      isLoading: newPlayerIsLoading,
    },
  ] = usePostPromoteNewPlayerBonusMutation();

  useDeepEffect(() => {
    if (isSuccess && data) {
      setTaskList(data.missionList);
      setVigorExpireTime(data.resetCountDown);
    }
  }, [isSuccess, data]);

  useDeepEffect(() => {
    if (newPlayerIsSuccess && newPlayerData) {
      setTaskList(newPlayerData.missionList);
    }
  }, [newPlayerIsSuccess, newPlayerData]);

  useDeepEffect(() => {
    setIsLoading(isLoading || newPlayerIsLoading);
  }, [isLoading, newPlayerIsLoading]);

  const getData = ({ type }: { type: MissionType }) => {
    if (type === MissionType.NEW_PLAYER) {
      postPromoteNewPlayerBonus();
    } else if (type === MissionType.DAILY) {
      postPromoteDailyMission();
    } else {
      console.log('no type');
    }
  };

  // 顯示任務Modal邏輯
  const onTaskListModalShowAction = useCallback(
    async (command: HallAdModelCommandTypes) => {
      const id = useUserProfileStore.getState().id;
      const value = await taskListStore.getItem<string>(
        id.toString() + command.uniqueId
      );
      const localDataMap: TaskListModalShowTimeData = JSON.parse(
        sdkUtils.decrypt(value!) || '{}'
      );

      setCurrentUniqueId(command.uniqueId);

      const type =
        command.type === AnnouncementType.DAILY_TASK
          ? MissionType.DAILY
          : MissionType.NEW_PLAYER;

      setCurrentTaskListType(command.type as AnnouncementType);

      // 如果是socket
      if (command.from === SourceFrom.WEB_SOCKET) {
        setShowTaskListModal(true);
        // 顯示即獲取  parameter
        getData({ type: type });
        hallAdModelInvoker.removeCache(command.uniqueId);
        return;
      }

      /**
       * 如果是announcements
       * 1 今日是否顯示過 = localMap.disableDuration棄用，改為command.uniqueId區分
       * 2 今天不再顯示，勾選過"今天不顯示" = localMap.disableDuration > currentTime
       * 3 因為兩個modalContent公用，所以需要傳入的唯一uniqueId作以區分，也可以用以判斷 今日是否顯示過
       */

      const isDisabledToday = (localDataMap?.disableDuration || 0) >= +today;
      const isShown = appStartShownSeveralTimes.includes(command.uniqueId);

      if (!isDisabledToday && !isShown) {
        setShowTaskListModal(true);
        getData({ type: type });
        hallAdModelInvoker.removeCache(command.uniqueId);
      } else {
        useModalLayoutStore.getState().verifyNextStep('TaskList');
      }
    },

    [appStartShownSeveralTimes, currentUniqueId]
  );

  useEffect(() => {
    const location = useLocationStore.getState().location;
    const isHallPage = location?.pathname === BasePagePathObj.HallPage;

    const isTaskRelatedAnnouncement = [
      AnnouncementType.DAILY_TASK,
      AnnouncementType.NEW_PLAYER_TASK,
    ].includes(hallAdModelCommandTypes.type as AnnouncementType);

    if (isTaskRelatedAnnouncement && isHallPage) {
      onTaskListModalShowAction(hallAdModelCommandTypes);
    }
  }, [hallAdModelCommandTypes]);
};

export default useTaskListModalBase;
