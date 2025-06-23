import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import {
  handleInviteWheelModalCloseClickAction,
  handleInviteWheelModalBtnClickAction,
  handleInviteWheelModalCheckBoxClickAction,
} from '@mode2/action/actionTypes';
import useInviteWheelModalStore from '@libs/mode2/zustand/modal/InviteWheelModal';
import handleGlobalClick from '../../handleGlobalClick';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@libs/mode2/localforage/user';
import { today } from '@libs/constant/date';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';

type ActionClickPayloadMap = {
  [handleInviteWheelModalCloseClickAction]: void;
  [handleInviteWheelModalBtnClickAction]: void;
  [handleInviteWheelModalCheckBoxClickAction]: void;
};

export interface HandleInviteWheelModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useInviteWheelModalActions = () => {
  const { navToInviteWheelPage } = useNavPageClick();

  const setShowInviteWheelModal = useInviteWheelModalStore(
    (state) => state.setShowInviteWheelModal
  );

  const isNotShowToday = useInviteWheelModalStore(
    (state) => state.isNotShowToday
  );

  const setIsNotShowToday = useInviteWheelModalStore(
    (state) => state.setIsNotShowToday
  );

  const updateAppStartShownSeveralTimes = useInviteWheelModalStore(
    (state) => state.updateAppStartShownSeveralTimes
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleInviteWheelModalCloseClickAction]: () => {
      handleGlobalClick({
        target: handleInviteWheelModalCloseClickAction,
        callback: () => {
          if (isNotShowToday) {
            userLocalForage.setItem(
              UserLocalforageStoreKeys.INVITE_WHEEL_MODAL,
              today
            );
          }
          updateAppStartShownSeveralTimes();
          setShowInviteWheelModal(false);
          useModalLayoutStore.getState().verifyNextStep('InviteWheelAction');
        },
      });
    },
    [handleInviteWheelModalBtnClickAction]: () => {
      handleGlobalClick({
        target: handleInviteWheelModalBtnClickAction,
        callback: () => {
          if (isNotShowToday) {
            userLocalForage.setItem(
              UserLocalforageStoreKeys.INVITE_WHEEL_MODAL,
              today
            );
          }
          updateAppStartShownSeveralTimes();
          setShowInviteWheelModal(false);
          navToInviteWheelPage();
        },
      });
    },
    [handleInviteWheelModalCheckBoxClickAction]: () => {
      handleGlobalClick({
        target: handleInviteWheelModalCheckBoxClickAction,
        callback: () => {
          setIsNotShowToday(!isNotShowToday);
        },
      });
    },
  };

  const handleInviteWheelModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleInviteWheelModalActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleInviteWheelModalClick,
  };
};
