import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { handleCollectRewardBtnClick } from './actionType';
import handleGlobalClick from '../handleGlobalClick';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { usePostPiggyBankWithdrawMutation } from '@mode2API/index';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import { useMessageStore } from '@mode2/zustand/components/messageStore';

type ActionClickPayloadMap = {
  [handleCollectRewardBtnClick]: { currentCash: number };
};

export interface HandleRebateRewardModalClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useRebateRewardModalAction = () => {
  const { t } = useTranslation();
  const [triggerCollect, { data: collectRewardData }] =
    usePostPiggyBankWithdrawMutation();

  const { setIsShowRebateRewardModal } = useRebateRewardModalStore();

  useEffect(() => {
    if (collectRewardData?.withdrawResultMsg) {
      useMessageStore.getState().info(collectRewardData.withdrawResultMsg);
    }
  }, [collectRewardData]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleCollectRewardBtnClick]: ({ currentCash }) => {
      handleGlobalClick({
        target: handleCollectRewardBtnClick,
        callback: () => {
          if (currentCash) {
            triggerCollect();
            setIsShowRebateRewardModal(false);
          } else {
            useMessageStore.getState().info(t('toast_received_today'));
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
