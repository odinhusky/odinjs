import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import useSurpriseRewardModalStore from '@libs/mode2/zustand/modal/SurpriseRewardModal';
import handleGlobalClick from '../../handleGlobalClick';
import { usePostActiveClaimSurpriseRewardMutation } from '@libs/mode2/external/api';
import {
  handleSurpriseRewardModalBtnClickAction,
  handleSurpriseRewardModalCloseClickAction,
} from '@mode2/action/actionTypes';
import { useEffect } from 'react';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';
import { useMode2SubordinateDataPageStore } from '@mode2/zustand/page/SubordinateDataStore';

type ActionClickPayloadMap = {
  [handleSurpriseRewardModalCloseClickAction]: void;
  [handleSurpriseRewardModalBtnClickAction]: void;
};

export interface HandleSurpriseRewardModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useSurpriseRewardModalActions = () => {
  const setShowSurpriseRewardModal = useSurpriseRewardModalStore(
    (state) => state.setShowSurpriseRewardModal
  );

  const updateAppStartShownSeveralTimes = useSurpriseRewardModalStore(
    (state) => state.updateAppStartShownSeveralTimes
  );

  const handleClose = () => {
    updateAppStartShownSeveralTimes();
    setShowSurpriseRewardModal(false);
    // 關閉modal 必須呼要下一個
    useModalLayoutStore.getState().verifyNextStep('SurpriseRewardAction');
  };

  const [postActiveClaimSurpriseReward, { isSuccess }] =
    usePostActiveClaimSurpriseRewardMutation();

  const refreshUserData = useMode2SubordinateDataPageStore(
    (state) => state.refreshUserData
  );

  useEffect(() => {
    if (isSuccess) {
      refreshUserData();
      handleClose();
    }
  }, [isSuccess]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleSurpriseRewardModalCloseClickAction]: () => {
      handleGlobalClick({
        target: handleSurpriseRewardModalCloseClickAction,
        callback: () => {
          handleClose();
        },
      });
    },
    [handleSurpriseRewardModalBtnClickAction]: () => {
      handleGlobalClick({
        target: handleSurpriseRewardModalBtnClickAction,
        callback: () => {
          postActiveClaimSurpriseReward();
        },
        debounceTimer: 500,
      });
    },
  };

  const handleSurpriseRewardModalClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleSurpriseRewardModalActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleSurpriseRewardModalClick,
  };
};
