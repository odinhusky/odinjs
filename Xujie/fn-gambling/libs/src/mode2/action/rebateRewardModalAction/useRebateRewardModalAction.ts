import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  handleCollectRewardBtnClick,
  handleCollectRewardCloseBtnClick,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '../handleGlobalClick';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { usePostPiggyBankWithdrawMutation } from '@mode2API/index';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import { useMessageStore } from '@mode2/zustand/components/messageStore';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';

type ActionClickPayloadMap = {
  [handleCollectRewardCloseBtnClick]: void;
  [handleCollectRewardBtnClick]: { currentCash: number };
};

export interface HandleRebateRewardModalClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useRebateRewardModalAction = () => {
  const { t } = useTranslation();
  const [postPiggyBankWithdraw, { data, isSuccess }] =
    usePostPiggyBankWithdrawMutation();

  const setIsShowRebateRewardModal = useRebateRewardModalStore(
    (state) => state.setIsShowRebateRewardModal
  );

  const updateAppStartShownSeveralTimes = useRebateRewardModalStore(
    (state) => state.updateAppStartShownSeveralTimes
  );

  const handleClose = () => {
    updateAppStartShownSeveralTimes();
    setIsShowRebateRewardModal(false);
    // 關閉modal 必須呼要下一個
    useModalLayoutStore.getState().verifyNextStep('RebateRewardModalAction');
  };

  useEffect(() => {
    if (data && isSuccess) {
      useMessageStore.getState().info(data.withdrawResultMsg);
      updateAppStartShownSeveralTimes();
      setIsShowRebateRewardModal(false);
    }
  }, [data, isSuccess]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleCollectRewardCloseBtnClick]: () => {
      handleGlobalClick({
        target: handleCollectRewardCloseBtnClick,
        callback: () => {
          handleClose();
        },
      });
    },
    [handleCollectRewardBtnClick]: ({ currentCash }) => {
      handleGlobalClick({
        target: handleCollectRewardBtnClick,
        payload: { currentCash },
        callback: () => {
          if (currentCash) {
            postPiggyBankWithdraw();
          } else {
            updateAppStartShownSeveralTimes();
            setIsShowRebateRewardModal(false);
            useMessageStore
              .getState()
              .info(t('piggy_bank_no_cashback_message'));
          }
        },
      });
    },
  };

  const handleRebateRewardModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleRebateRewardModalClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleRebateRewardModalClick,
  };
};

export default useRebateRewardModalAction;
