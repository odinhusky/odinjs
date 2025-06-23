import {
  usePostMissionOngoingMutation,
  usePostMissionTipNumbersMutation,
} from '@mode2API/index';
import { useEffect } from 'react';
import { useTaskCenterPageStore } from '@mode2/zustand/page/TaskCenterPage/taskCenterPageStore';
import useTaskCenterPageInit from './useTaskCenterPageInit';
import { MissionType } from '@libs/mode2/external/api/endpoint/mission/PostMissionOngoingEndpoint';
import { useTemplateLayoutStore } from '@libs/mode2/zustand/template/templateLayoutStore';

export const useTaskCenterPageBase = () => {
  useTaskCenterPageInit();

  const currentMissionType = useTaskCenterPageStore(
    (state) => state.currentMissionType
  );

  const refreshOngoinhCount = useTaskCenterPageStore(
    (state) => state.refreshOngoinhCount
  );

  const setMissionTipBadges = useTaskCenterPageStore(
    (state) => state.setMissionTipBadges
  );

  const setIsAllClaimable = useTaskCenterPageStore(
    (state) => state.setIsAllClaimable
  );
  const setAllClaimableIds = useTaskCenterPageStore(
    (state) => state.setAllClaimableIds
  );
  const setDashboardInfo = useTaskCenterPageStore(
    (state) => state.setDashboardInfo
  );
  const setMissionLoading = useTaskCenterPageStore(
    (state) => state.setMissionLoading
  );
  const setMissionList = useTaskCenterPageStore(
    (state) => state.setMissionList
  );
  const setRuleInnerHtml = useTaskCenterPageStore(
    (state) => state.setRuleInnerHtml
  );

  const refreshTaskCenterCount = useTaskCenterPageStore(
    (state) => state.refreshTaskCenterCount
  );

  const [
    postMissionOngoing,
    {
      data: missionOngoingData,
      isSuccess: isMissionOngoingSuccess,
      isLoading: isMissionOngoingLoading,
    },
  ] = usePostMissionOngoingMutation();

  const [
    postMissionTipNumbers,
    { data: missionTipNumbersData, isSuccess: isMissionTipNumbersSuccess },
  ] = usePostMissionTipNumbersMutation();

  useEffect(() => {
    setIsAllClaimable(false);
    postMissionTipNumbers();

    // 重置數據
    setMissionList([]);
    setMissionLoading(true);
  }, [currentMissionType, refreshOngoinhCount]);

  useEffect(() => {
    if (missionOngoingData && isMissionOngoingSuccess) {
      setIsAllClaimable(missionOngoingData.isAllClaimable);
      setAllClaimableIds(missionOngoingData.allClaimableIds);

      setDashboardInfo({
        vigor: missionOngoingData.vigor,
        vigorExpireTime: missionOngoingData.vigorExpireTime,
        vigorBoxItems: missionOngoingData.boxItems,
      });
      setMissionList(missionOngoingData.missionList);
      setRuleInnerHtml(missionOngoingData.ruleInnerHtml);
    }
  }, [missionOngoingData, isMissionOngoingSuccess]);

  useEffect(() => {
    if (missionTipNumbersData && isMissionTipNumbersSuccess) {
      setMissionLoading(true);
      setMissionTipBadges(missionTipNumbersData);

      if (missionTipNumbersData.isNewPlayerActivityPeriod) {
        // 新人福利活動期
        postMissionOngoing({ type: currentMissionType });
      } else {
        // 非新人福利活動期
        postMissionOngoing({ type: MissionType.DAILY });
      }
    }
  }, [
    missionTipNumbersData,
    isMissionTipNumbersSuccess,
    refreshTaskCenterCount,
  ]);

  useEffect(() => {
    setMissionLoading(isMissionOngoingLoading);
  }, [isMissionOngoingLoading]);

  useEffect(() => {
    return () => {
      useTemplateLayoutStore.getState().refreshMissionTip();
    };
  }, []);
};
