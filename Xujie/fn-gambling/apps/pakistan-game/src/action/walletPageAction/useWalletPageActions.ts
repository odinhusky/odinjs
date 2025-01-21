import {
  handleWalletPageRechargeAmountChange,
  handleWalletPageRechargeAmountClearClick,
  handleWalletPageRechargeContentDepositBtnClick,
  handleWalletPageWithdrawAmountInputValueChange,
  handleWalletPageWithdrawAmountInputValueClear,
  handleWalletPageWithdrawBankOptionsValueChange,
  handleWalletPageWithdrawBtnClick,
  handleWalletPageWithdrawPasswordInputValueChange,
  handleWalletPageWithdrawPasswordInputValueClear,
} from './acitonType';

import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import { KYC_BOTH_STATE, KYC_PERSONAL_STATE } from '@constant/KYC';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { useRecharge } from '@/usecase/useRecharge';
import { useWithdraw } from '@/usecase/useWithdraw';
import { useUserVerifyState } from '@/usecase/useUserVerifyState';
import { SavedBankListResult } from '@/external/api/endpoint/PostSavedBankListEndpoint';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';

type ActionClickPayloadMap = {
  // [handleWalletPageSwitchTabClick]: { id: WalletPageTabType };

  [handleWalletPageRechargeAmountChange]: { value: string };
  [handleWalletPageRechargeAmountClearClick]: void;

  // [handleWalletPageRechargeCardClick]: { card: RechargeCard };
  // [handleWalletPageSetPayChannelClick]: { item: PayChannelInfoResult };
  // [handleWalletPagePayPayChannelOtpClick]: { item: PayOptionsResult };
  [handleWalletPageWithdrawAmountInputValueChange]: { value: string };
  [handleWalletPageWithdrawAmountInputValueClear]: void;
  [handleWalletPageWithdrawPasswordInputValueChange]: { password: string };
  [handleWalletPageWithdrawPasswordInputValueClear]: void;
  // [handleWalletPageWithdrawModifierClick]: void;
  [handleWalletPageWithdrawBtnClick]: void;
  [handleWalletPageRechargeContentDepositBtnClick]: {
    isRechargeFromGame: boolean;
  };
  // [handleWalletPageRechargeTabCheckOrderClick]: void;
  // [handleWalletPageWithdrawTabCheckOrderClick]: void;
  [handleWalletPageWithdrawBankOptionsValueChange]: {
    value: SavedBankListResult;
  };
};

export interface HandleWalletPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useWalletPageActions = () => {
  const { navToBindKYCPage } = useNavPageClick();

  const { onRecharge } = useRecharge();
  const { onWithdraw } = useWithdraw();
  const { requiredVerifyBeforeRecharging, checkIsBankFirstBind } =
    useUserVerifyState();

  // const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
  //   (state) => state.setCurSwitchContentTabId
  // );

  // const setCurrentRechargeCard = useWalletPageRechargeCardStore(
  //   (state) => state.setCurrentRechargeCard
  // );

  const setRechargeAmount = useRechargeStore(
    (state) => state.setRechargeAmount
  );

  // set 當前支付通道
  // const setCurrentPayChannel = useWalletPageRechargeContentStore(
  //   (state) => state.setCurrentPayChannel
  // );

  // 當前支付通道-支付選項
  // const setCurrentPayOption = useWalletPageRechargeContentStore(
  //   (state) => state.setCurrentPayOption
  // );

  const setWithdrawAmountInputValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawAmountInputValue
  );

  const setWithdrawPasswordInputValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawPasswordInputValue
  );

  const setWithdrawBankValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawBankValue
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleWalletPageRechargeAmountChange]: ({ value }) => {
      handleGlobalClick({
        target: handleWalletPageRechargeAmountChange,
        callback: () => {
          setRechargeAmount(value);
        },
      });
    },
    [handleWalletPageRechargeAmountClearClick]: () => {
      handleGlobalClick({
        target: handleWalletPageRechargeAmountChange,
        callback: () => {
          setRechargeAmount('');
        },
      });
    },
    [handleWalletPageWithdrawAmountInputValueChange]: ({ value }) => {
      handleGlobalClick({
        target: handleWalletPageWithdrawAmountInputValueChange,
        callback: () => {
          setWithdrawAmountInputValue(value);
        },
      });
    },
    [handleWalletPageWithdrawAmountInputValueClear]: () => {
      handleGlobalClick({
        target: handleWalletPageWithdrawAmountInputValueClear,
        callback: () => {
          setWithdrawAmountInputValue('');
        },
      });
    },
    [handleWalletPageWithdrawPasswordInputValueChange]: ({ password }) => {
      handleGlobalClick({
        target: handleWalletPageWithdrawPasswordInputValueChange,
        callback: () => {
          setWithdrawPasswordInputValue(password);
        },
      });
    },
    [handleWalletPageWithdrawPasswordInputValueClear]: () => {
      handleGlobalClick({
        target: handleWalletPageWithdrawPasswordInputValueClear,
        callback: () => {
          setWithdrawPasswordInputValue('');
        },
      });
    },
    // [handleWalletPageWithdrawModifierClick]: () => {
    //   handleGlobalClick({
    //     target: handleWalletPageWithdrawModifierClick,
    //     callback: () => {
    //       navigate(BasePagePathObj.BindKYCPage, {
    //         state: { tab: KYC_BOTH_STATE },
    //       });
    //     },
    //   });
    // },
    [handleWalletPageWithdrawBtnClick]: () => {
      handleGlobalClick({
        target: handleWalletPageWithdrawBtnClick,
        callback: () => {
          /**
           * 驗證 KYC
           *
           * 驗證條件:
           * - 如果個人資訊和銀行資訊都已經綁定，則表示 KYC 已經完成。
           * - 如果任一未綁定，則需要打開modal要求輸入 KYC 資訊。
           *
           * @returns {boolean}
           *  - `true`: 已經完成 KYC
           *  - `false`: 未完成 KYC
           */
          if (checkIsBankFirstBind()) {
            navToBindKYCPage('', {
              state: { tab: KYC_BOTH_STATE },
            });
          } else {
            onWithdraw();
          }
        },
      });
    },
    [handleWalletPageRechargeContentDepositBtnClick]: ({
      isRechargeFromGame,
    }) => {
      handleGlobalClick({
        target: handleWalletPageRechargeContentDepositBtnClick,
        callback: () => {
          if (!requiredVerifyBeforeRecharging()) {
            onRecharge();
          } else {
            navToBindKYCPage('', {
              state: { tab: KYC_PERSONAL_STATE },
            });
          }
        },
      });
    },
    [handleWalletPageWithdrawBankOptionsValueChange]: ({ value }) => {
      handleGlobalClick({
        target: handleWalletPageWithdrawBankOptionsValueChange,
        callback: () => {
          setWithdrawBankValue(value);
        },
      });
    },
  };

  const handleWalletPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleWalletPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleWalletPageClick,
  };
};

export default useWalletPageActions;
