import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import {
  handleFirstChargeModalClose,
  handleFirstChargeModalNotShowTodayClick,
  handleFirstChargeModalToWalletClick,
} from './acitonType';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import useFirstChargeModalBase from '@libs/mode2/usecase/useFirstChargeModalBase';
import { useMode2FirstChargeModalStore } from '@libs/mode2/zustand/components/firstChargeStore';

type ActionClickPayloadMap = {
  [handleFirstChargeModalClose]: void;
  [handleFirstChargeModalNotShowTodayClick]: { value: boolean };
  [handleFirstChargeModalToWalletClick]: void;
};

export interface HandleFirstChargeModalOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> { }

const useFirstChargeModalAction = () => {
  const { handleClose, hanldeClick } = useFirstChargeModalBase();

  const setIsNotShowToday = useMode2FirstChargeModalStore(state => state.setIsNotShowToday);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleFirstChargeModalClose]: () => {
      handleGlobalClick({
        target: handleFirstChargeModalClose,
        callback: () => {
          handleClose();
        },
      });
    },
    [handleFirstChargeModalNotShowTodayClick]: ({ value }) => {
      handleGlobalClick({
        target: handleFirstChargeModalNotShowTodayClick,
        callback: () => {
          setIsNotShowToday(value)
        },
      });
    },
    [handleFirstChargeModalToWalletClick]: () => {
      handleGlobalClick({
        target: handleFirstChargeModalToWalletClick,
        callback: () => {
          hanldeClick();
        },
      });
    },
  };

  const handleFirstChargeModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleFirstChargeModalOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleFirstChargeModalClick,
  };
};

export default useFirstChargeModalAction;
