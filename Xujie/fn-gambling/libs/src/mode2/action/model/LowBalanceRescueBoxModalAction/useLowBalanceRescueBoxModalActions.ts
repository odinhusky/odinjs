import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import {
  handleLowBalanceRescueBoxModalClaimBonusClick,
  handleLowBalanceRescueBoxModalCloseBtnClick,
  handleLowBalanceRescueBoxModalNavCoinBtnClick,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '../../handleGlobalClick';
import { useCallback, useEffect } from 'react';
import { useLocationStore } from '@libs/mode2/zustand/locationStore';
import useModalLayoutStore from '@libs/mode2/zustand/template/modalLayoutStore';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import useLowBalanceRescueBoxModalStore from '@libs/mode2/zustand/modal/LowBalanceRescueBoxModal';
import { usePostBrokenBoxClaimMutation } from '@mode2API/index';
import { useToastStore } from '@mode2/zustand/components/toastStore';

type ActionClickPayloadMap = {
  [handleLowBalanceRescueBoxModalCloseBtnClick]: void;
  [handleLowBalanceRescueBoxModalClaimBonusClick]: void;
  [handleLowBalanceRescueBoxModalNavCoinBtnClick]: void;
};

export interface HandleLowBalanceRescueBoxModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useLowBalanceRescueBoxModalActions = () => {
  const location = useLocationStore((state) => state.location);

  const { navToHallPage } = useNavPageClick();

  const setShowLowBalanceRescueBoxModal = useLowBalanceRescueBoxModalStore(
    (state) => state.setShowLowBalanceRescueBoxModal
  );

  const [postBrokenBoxClaim, { data, isSuccess }] =
    usePostBrokenBoxClaimMutation();

  useEffect(() => {
    if (data && isSuccess) {
      // 成功過就不再顯示按鈕
      useToastStore.getState().showToast('Bonus added. You’re good to go!');
      useLowBalanceRescueBoxModalStore
        .getState()
        .upLowBalanceRescueBoxLimitedOffersEndTime(0);
      handleClose();
    }
  }, [data, isSuccess]);

  const handleClose = useCallback(() => {
    setShowLowBalanceRescueBoxModal(false);
    if (location?.pathname && location.pathname === BasePagePathObj.HallPage) {
      useModalLayoutStore.getState().verifyNextStep('LowBalanceRescueBoxModal');
    }

    if (
      location?.pathname &&
      location.pathname === BasePagePathObj.LowBalanceRescueBoxPage
    ) {
      navToHallPage();
    }
  }, [location?.pathname]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleLowBalanceRescueBoxModalCloseBtnClick]: () => {
      handleGlobalClick({
        target: handleLowBalanceRescueBoxModalCloseBtnClick,
        callback: () => {
          console.log('!! handleLowBalanceRescueBoxModalCloseBtnClick');
          handleClose();
        },
        debounceTimer: 500,
      });
    },
    [handleLowBalanceRescueBoxModalClaimBonusClick]: () => {
      handleGlobalClick({
        target: handleLowBalanceRescueBoxModalClaimBonusClick,
        callback: () => {
          const lowBalanceRewardInfo =
            useLowBalanceRescueBoxModalStore.getState().lowBalanceRewardInfo;
          postBrokenBoxClaim({ offerId: lowBalanceRewardInfo.offerId });
        },
      });
    },
    [handleLowBalanceRescueBoxModalNavCoinBtnClick]: () => {
      handleGlobalClick({
        target: handleLowBalanceRescueBoxModalNavCoinBtnClick,
        callback: () => {
          setShowLowBalanceRescueBoxModal(true);
        },
      });
    },
  };

  const handleLowBalanceRescueBoxModalClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleLowBalanceRescueBoxModalActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleLowBalanceRescueBoxModalClick,
  };
};

export default useLowBalanceRescueBoxModalActions;
