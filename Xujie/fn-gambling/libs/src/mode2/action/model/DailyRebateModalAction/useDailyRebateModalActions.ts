import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import { handleDailyRebateModalBtnClickAction } from '@mode2/action/actionTypes';
import useDailyRebateModalStore from '@libs/mode2/zustand/modal/DailyRebateModal';
import handleGlobalClick from '../../handleGlobalClick';
import { usePostVipClaimRewardMutation } from '@libs/mode2/external/api';
import { useEffect } from 'react';
import fullAnimationStore, {
  AnimationType,
} from '@libs/mode2/zustand/components/fullAnimationStore';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';

type ActionClickPayloadMap = {
  [handleDailyRebateModalBtnClickAction]: void;
};

export interface HandleDailyRebateModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useDailyRebateModalActions = () => {
  const setShowDailyRebateModal = useDailyRebateModalStore(
    (state) => state.setShowDailyRebateModal
  );

  const updateAppStartShownSeveralTimes = useDailyRebateModalStore(
    (state) => state.updateAppStartShownSeveralTimes
  );

  const openFullAnimation = fullAnimationStore(
    (state) => state.openFullAnimation
  );

  const [postVipClaimReward, { isSuccess }] = usePostVipClaimRewardMutation();

  useEffect(() => {
    if (isSuccess) {
      setShowDailyRebateModal(false);
      updateAppStartShownSeveralTimes();
      // Evan 領取成功動畫
      openFullAnimation({
        type: AnimationType.DAILY_BET_REBATE_CLAIM,
        duration: 1350,
      });
      // 關閉modal 必須呼要下一個
      // 延遲整屏動畫後再呼叫
      setTimeout(() => {
        useModalLayoutStore.getState().verifyNextStep('DailyRebateAction');
      }, 2000);
    }
  }, [isSuccess]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleDailyRebateModalBtnClickAction]: () => {
      handleGlobalClick({
        target: handleDailyRebateModalBtnClickAction,
        callback: () => {
          postVipClaimReward();
        },
        debounceTimer: 500,
      });
    },
  };

  const handleDailyRebateModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleDailyRebateModalActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleDailyRebateModalClick,
  };
};
