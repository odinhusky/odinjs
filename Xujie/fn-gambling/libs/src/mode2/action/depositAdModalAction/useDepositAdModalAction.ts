import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import {
  handleDepositAdModalClose,
  handleDepositAdModalToWalletClick,
} from './acitonType';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';

import { useDepositAdvertisementStore } from '@libs/mode2/zustand/components/depositAdvertisementStore';

type ActionClickPayloadMap = {
  [handleDepositAdModalClose]: void;
  [handleDepositAdModalToWalletClick]: void;
};

export interface HandleDepositAdModalOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

const useDepositAdModalAction = () => {
  const { navToWalletPage } = useNavPageClick();
  const setShowDepositAdvertisementModal = useDepositAdvertisementStore(
    (state) => state.setShowDepositAdvertisementModal
  );
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleDepositAdModalClose]: () => {
      handleGlobalClick({
        target: handleDepositAdModalClose,
        callback: () => {
          setShowDepositAdvertisementModal(false);
        },
      });
    },
    [handleDepositAdModalToWalletClick]: () => {
      handleGlobalClick({
        target: handleDepositAdModalToWalletClick,
        callback: () => {
          setShowDepositAdvertisementModal(false);
          navToWalletPage();
        },
      });
    },
  };

  const handleDepositAdModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleDepositAdModalOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleDepositAdModalClick,
  };
};

export default useDepositAdModalAction;
