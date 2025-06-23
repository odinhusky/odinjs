import handleAction from '../common/handleAction';
import handleGlobalClick from '../handleGlobalClick';
import {
  handleReminderModalCloseBtnClick,
  handleReminderModalDepositNowBtnClick,
} from '@mode2/action/actionTypes';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import { useReminderModalStore } from '@libs/mode2/zustand/components/reminderModalStore';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

type ActionClickPayloadMap = {
  // 其他 ActionClickType 對應的參數類型
  [handleReminderModalDepositNowBtnClick]: void;
  [handleReminderModalCloseBtnClick]: void;
};

export interface HandleReminderModalOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useReminderModalAction = () => {
  const navigate = useNavigateClick();

  const setShowReminderModal = useReminderModalStore(
    (state) => state.setShowReminderModal
  );

  const setRegisterBonus = useReminderModalStore(
    (state) => state.setRegisterBonus
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleReminderModalDepositNowBtnClick]: () => {
      handleGlobalClick({
        target: handleReminderModalDepositNowBtnClick,
        callback: () => {
          navigate(BasePagePathObj.WalletPage);
          setShowReminderModal(false);
          setRegisterBonus(0);
        },
      });
    },
    [handleReminderModalCloseBtnClick]: () => {
      handleGlobalClick({
        target: handleReminderModalCloseBtnClick,
        callback: () => {
          setShowReminderModal(false);
          setRegisterBonus(0);
        },
      });
    },
  };

  const handleReminderModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleReminderModalOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleReminderModalClick,
  };
};

export default useReminderModalAction;
