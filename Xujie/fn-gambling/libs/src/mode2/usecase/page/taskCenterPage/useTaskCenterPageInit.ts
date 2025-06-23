import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { useEffect } from 'react';
import { useTaskCenterPageStore } from '@mode2/zustand/page/TaskCenterPage/taskCenterPageStore';
import { MissionType } from '@mode2API/endpoint/mission/PostMissionOngoingEndpoint';

export const useTaskCenterPageInit = () => {
  const thisPath = BasePagePathObj.TaskCenterPage;
  const location = useLocationStore((state) => state.location);

  const setCurrentMissionType = useTaskCenterPageStore(
    (state) => state.setCurrentMissionType
  );

  useEffect(() => {
    if (location?.pathname !== thisPath) {
      return;
    }

    const type = location.state?.tab
      ? location.state?.tab
      : MissionType.NEW_PLAYER;

    setCurrentMissionType(type);
  }, [location]);
};

export default useTaskCenterPageInit;
