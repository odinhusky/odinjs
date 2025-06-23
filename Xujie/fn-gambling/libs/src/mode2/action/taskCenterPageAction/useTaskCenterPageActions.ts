import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import {
  handleTaskCenterPageBoxClaimAllBtnClick,
  handleTaskCenterPageBoxClaimBtnClick,
  handleTaskCenterPageHistoryBtnClick,
  handleTaskCenterPageMissionTabClick,
  handleTaskCenterPageTaskListItemClaimBtnClick,
  handleTaskCenterPageTaskListItemGoToBtnClick,
  handleTaskCenterPageTaskListItemMoreBtnClick,
  handleTaskCenterPageDashBoardPrevIconBtnClick,
  handleTaskCenterPageDashBoardNextIconBtnClick,
  handleTaskCenterPageModalCloseBtnClick,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '../handleGlobalClick';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { useTaskCenterPageStore } from '@mode2/zustand/page/TaskCenterPage/taskCenterPageStore';
import {
  MissionResult,
  MissionType,
} from '@mode2API/endpoint/mission/PostMissionOngoingEndpoint';

import {
  ActivityRecordPageTypes,
  useActivityRecordPageStore,
} from '@mode2/zustand/page/activityRecordPageStore';
import {
  usePostMissionClaimBoxMutation,
  usePostMissionClaimMutation,
} from '@libs/mode2/external/api';
import { useUpdateEffect } from '@libs/commonUtils';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import { useTranslation } from 'react-i18next';
import { useHandleGoActionEventHandlers } from '@libs/mode2/usecase/page/taskCenterPage/eventHandlers';
import { MissionActionType } from '@libs/mode2/usecase/page/taskCenterPage/eventHandlers/types';

type ActionClickPayloadMap = {
  [handleTaskCenterPageHistoryBtnClick]: void;
  [handleTaskCenterPageMissionTabClick]: { type: MissionType };
  [handleTaskCenterPageBoxClaimAllBtnClick]: void;
  [handleTaskCenterPageBoxClaimBtnClick]: { boxId: number };
  [handleTaskCenterPageTaskListItemClaimBtnClick]: {
    id: number;
    claim: number;
  };
  [handleTaskCenterPageTaskListItemGoToBtnClick]: {
    actionType: MissionActionType;
  };
  [handleTaskCenterPageTaskListItemMoreBtnClick]: {
    id: number;
    detail: MissionResult;
  };
  [handleTaskCenterPageDashBoardPrevIconBtnClick]: void;
  [handleTaskCenterPageDashBoardNextIconBtnClick]: void;
  [handleTaskCenterPageModalCloseBtnClick]: void;
};

export interface HandleTaskCenterPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useTaskCenterPageActions = () => {
  const { t } = useTranslation();
  const { navToActivityRecordPage } = useNavPageClick();
  const { handleEvent } = useHandleGoActionEventHandlers();

  const setCurrentMissionType = useTaskCenterPageStore(
    (state) => state.setCurrentMissionType
  );

  const showModal = useTaskCenterPageStore((state) => state.showModal);
  const setShowModal = useTaskCenterPageStore((state) => state.setShowModal);
  const addRefreshOngoinhCount = useTaskCenterPageStore(
    (state) => state.addRefreshOngoinhCount
  );
  const [postMissionOngoing, { isSuccess: isMissionOngoingSuccess }] =
    usePostMissionClaimBoxMutation();

  // 領取任務獎勵
  const [postMissionClaim, { isSuccess: isMissionClaimSuccess }] =
    usePostMissionClaimMutation();

  const handleClaim = (ids: number[]) => {
    postMissionOngoing({ boxIds: ids });
  };

  const handleClaimAll = () => {
    const allClaimableIds = useTaskCenterPageStore.getState().allClaimableIds;
    handleClaim(allClaimableIds);
  };

  useUpdateEffect(() => {
    if (isMissionOngoingSuccess) {
      useMessageStore.getState().success(t('mission_toast'));
      addRefreshOngoinhCount();
    }
  }, [isMissionOngoingSuccess]);

  useUpdateEffect(() => {
    if (isMissionClaimSuccess) {
      useMessageStore.getState().success(t('mission_bonus_received'));
      addRefreshOngoinhCount();
      // 關閉modal
      setShowModal({
        show: false,
        detail: '',
      });
    }
  }, [isMissionClaimSuccess]);

  // type: MissionType
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleTaskCenterPageHistoryBtnClick]: () => {
      handleGlobalClick({
        target: handleTaskCenterPageHistoryBtnClick,
        callback: () => {
          useActivityRecordPageStore
            .getState()
            .setTabIndex(
              ActivityRecordPageTypes.MISSION_REWARDS_RECORD_CONTENT
            );
          navToActivityRecordPage(``, {
            state: {
              tab: ActivityRecordPageTypes.MISSION_REWARDS_RECORD_CONTENT,
            },
          });
        },
      });
    },
    [handleTaskCenterPageMissionTabClick]: ({ type }) => {
      handleGlobalClick({
        target: handleTaskCenterPageMissionTabClick,
        payload: { type },
        callback: () => {
          setCurrentMissionType(type);
        },
      });
    },
    [handleTaskCenterPageBoxClaimAllBtnClick]: () => {
      handleGlobalClick({
        target: handleTaskCenterPageBoxClaimAllBtnClick,
        callback: () => {
          handleClaimAll();
        },
      });
    },
    [handleTaskCenterPageBoxClaimBtnClick]: ({ boxId }) => {
      handleGlobalClick({
        target: handleTaskCenterPageBoxClaimBtnClick,
        payload: { boxId },
        callback: () => {
          handleClaim([boxId]);
        },
      });
    },
    [handleTaskCenterPageTaskListItemClaimBtnClick]: ({ id, claim }) => {
      handleGlobalClick({
        target: handleTaskCenterPageTaskListItemClaimBtnClick,
        payload: { id, claim },
        callback: () => {
          postMissionClaim({
            missionId: id,
            claimWay: claim,
          });
        },
      });
    },
    [handleTaskCenterPageTaskListItemGoToBtnClick]: ({ actionType }) => {
      handleGlobalClick({
        target: handleTaskCenterPageTaskListItemGoToBtnClick,
        payload: { actionType },
        callback: () => {
          handleEvent(actionType as MissionActionType);

          // 如果是modal的go按鈕，則需要關閉modal
          if (showModal.show) {
            setShowModal({
              show: false,
              detail: '',
            });
          }
        },
      });
    },
    [handleTaskCenterPageTaskListItemMoreBtnClick]: ({ detail }) => {
      handleGlobalClick({
        target: handleTaskCenterPageTaskListItemMoreBtnClick,
        payload: { detail },
        callback: () => {
          setShowModal({
            show: true,
            detail: encodeURIComponent(JSON.stringify(detail)),
          });
        },
      });
    },
    [handleTaskCenterPageDashBoardPrevIconBtnClick]: () => {
      handleGlobalClick({
        target: handleTaskCenterPageDashBoardPrevIconBtnClick,
        callback: () => {
          useTaskCenterPageStore.getState().addDashPrevCount();
        },
      });
    },
    [handleTaskCenterPageDashBoardNextIconBtnClick]: () => {
      handleGlobalClick({
        target: handleTaskCenterPageDashBoardNextIconBtnClick,
        callback: () => {
          useTaskCenterPageStore.getState().addDashNextCount();
        },
      });
    },
    [handleTaskCenterPageModalCloseBtnClick]: () => {
      handleGlobalClick({
        target: handleTaskCenterPageModalCloseBtnClick,
        callback: () => {
          setShowModal({
            show: false,
            detail: '',
          });
        },
      });
    },
  };

  const handleTaskCenterPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleTaskCenterPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleTaskCenterPageClick,
  };
};

export default useTaskCenterPageActions;
