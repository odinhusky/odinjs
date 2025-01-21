import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalScroll from '@mode2/action/handleGlobalScroll';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import {
  handleGuidanceDepositModalCloseClickAction,
  handleGuidanceDepositModalNavToWalletAction,
} from '@mode2/action/model/GuidanceDepositModal/actionType';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { useGuidanceDepositModalStore } from '@mode2/zustand/modal/GuidanceDepositModal/useGuidanceDepositModalStore';

type ActionClickPayloadMap = {
  [handleGuidanceDepositModalCloseClickAction]: void;
  [handleGuidanceDepositModalNavToWalletAction]: void;
};

export interface HandleGuidanceDepositModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useGuidanceDepositModalActions = () => {
  const { navToWalletPage } = useNavPageClick();
  const setShowGuidanceDepositModal = useGuidanceDepositModalStore(
    (state) => state.setShowGuidanceDepositModal
  );
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleGuidanceDepositModalCloseClickAction]: () => {
      handleGlobalScroll({
        target: handleGuidanceDepositModalCloseClickAction,
        callback: () => {
          setShowGuidanceDepositModal(false);
        },
      });
    },
    [handleGuidanceDepositModalNavToWalletAction]: () => {
      handleGlobalScroll({
        target: handleGuidanceDepositModalNavToWalletAction,
        callback: () => {
          navToWalletPage('', { state: { tab: WalletPageTabType.DEPOSIT } });
          setShowGuidanceDepositModal(false);
        },
      });
    },
  };

  const handleGuidanceDepositModalActions = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleGuidanceDepositModalActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleGuidanceDepositModalActions,
  };
};
