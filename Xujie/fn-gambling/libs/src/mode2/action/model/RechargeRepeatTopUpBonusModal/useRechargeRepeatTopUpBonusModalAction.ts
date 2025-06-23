import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import {
  handleRechargeRepeatTopUpBonusModalCloseClick,
  handleRechargeRepeatTopUpBonusModalOptionItemClick,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '../../handleGlobalClick';
import useRechargeRepeatTopUpBonusModalStore, {
  PayAddOnOption,
} from '@libs/mode2/zustand/modal/RechargeRepeatTopUpBonusModal';
import { usePostPayAddOnPostponeMutation } from '@mode2API/index';
import { useEffect } from 'react';
import { useLoadingStore } from '@mode2/zustand/components/loadingStore';

type ActionClickPayloadMap = {
  [handleRechargeRepeatTopUpBonusModalCloseClick]: void;
  [handleRechargeRepeatTopUpBonusModalOptionItemClick]: {
    payAddOnOption: PayAddOnOption;
  };
};

export interface HandleRechargeRepeatTopUpBonusModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useRechargeRepeatTopUpBonusModalAction = () => {
  const setIsShowRechargeRepeatTopUpBonusModal =
    useRechargeRepeatTopUpBonusModalStore(
      (state) => state.setIsShowRechargeRepeatTopUpBonusModal
    );

  const [postPayAddOnPostpone, { isLoading }] =
    usePostPayAddOnPostponeMutation();

  // 延遲加碼優惠
  useEffect(() => {
    useLoadingStore.getState().setShowLoading(isLoading);
  }, [isLoading]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleRechargeRepeatTopUpBonusModalCloseClick]: () => {
      handleGlobalClick({
        target: handleRechargeRepeatTopUpBonusModalCloseClick,
        callback: () => {
          useRechargeRepeatTopUpBonusModalStore
            .getState()
            .updateCloseClickCount();
          const closeClickCount =
            useRechargeRepeatTopUpBonusModalStore.getState().closeClickCount;
          if (closeClickCount >= 2) {
            postPayAddOnPostpone();
          }
          setIsShowRechargeRepeatTopUpBonusModal(false);
        },
      });
    },
    [handleRechargeRepeatTopUpBonusModalOptionItemClick]: ({
      payAddOnOption,
    }) => {
      handleGlobalClick({
        target: handleRechargeRepeatTopUpBonusModalOptionItemClick,
        payload: { payAddOnOption },
        callback: () => {
          useRechargeRepeatTopUpBonusModalStore
            .getState()
            .setCurrentPayAddOnOption({ ...payAddOnOption });
        },
      });
    },
  };

  const handleRechargeRepeatTopUpBonusModalClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleRechargeRepeatTopUpBonusModalActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleRechargeRepeatTopUpBonusModalClick,
  };
};

export default useRechargeRepeatTopUpBonusModalAction;
