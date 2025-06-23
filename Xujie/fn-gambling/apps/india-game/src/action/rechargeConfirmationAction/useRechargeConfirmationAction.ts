import {
  handleFinishRechargeInToGameClick,
  handleLastRechargeInToGameClick,
  handleRechargeInToGameClick,
} from '@mode2/action/actionTypes';
import { useRecharge } from '@/usecase/useRecharge';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import { useRechargeConfirmationModalStore } from '@mode2/zustand/components/rechargeConfirmationStore';
import sdkUtils from '@mode2/utils/sdk';

type ActionClickPayloadMap = {
  [handleRechargeInToGameClick]: void;
  [handleFinishRechargeInToGameClick]: void;
  [handleLastRechargeInToGameClick]: void;
};

export interface HandleRechargeConfirmationProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useRechargeConfirmationAction = () => {
  const { doRechargeInToGameCallback } = useRecharge();
  const finishRecharge = useRechargeStore((state) => state.finishRecharge);
  const { setIsShowRechargeConfirmationModal } =
    useRechargeConfirmationModalStore();
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleRechargeInToGameClick]: () => {
      handleGlobalClick({
        target: handleRechargeInToGameClick,
        callback: () => {
          doRechargeInToGameCallback();
        },
      });
    },
    [handleFinishRechargeInToGameClick]: () => {
      handleGlobalClick({
        target: handleFinishRechargeInToGameClick,
        callback: () => {
          setIsShowRechargeConfirmationModal(false);
          finishRecharge();
        },
      });
    },
    [handleLastRechargeInToGameClick]: () => {
      handleGlobalClick({
        target: handleLastRechargeInToGameClick,
        callback: () => {
          // TODO Evan 自定義收銀台
          const rechargeUrl =
            useRechargeStore.getState().rechargeResult.rechargeUrl;
          sdkUtils.openBrowser(rechargeUrl);
        },
      });
    },
  };

  const handleRechargeConfirmationClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleRechargeConfirmationProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleRechargeConfirmationClick,
  };
};
