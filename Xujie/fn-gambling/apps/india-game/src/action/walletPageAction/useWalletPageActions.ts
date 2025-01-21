import {
  handleWalletPageRechargeAmountChange,
  handleWalletPageRechargeAmountClearClick,
  handleWalletPageRechargeContentDepositBtnClick,
  handleWalletPageWithdrawAmountInputValueChange,
  handleWalletPageWithdrawAmountInputValueClear,
  handleWalletPageWithdrawBtnClick,
  handleWalletPageWithdrawPasswordInputValueChange,
  handleWalletPageWithdrawPasswordInputValueClear,
} from './acitonType';

import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { KYC_BOTH_STATE, KYC_PERSONAL_STATE } from '@constant/KYC';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { useRecharge } from '@/usecase/useRecharge';
import { useWithdraw } from '@/usecase/useWithdraw';
import { useUserVerifyState } from '@/usecase/useUserVerifyState';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import sdkUtils from '@mode2/utils/sdk';

type ActionClickPayloadMap = {
  [handleWalletPageRechargeAmountChange]: { value: string };
  [handleWalletPageRechargeAmountClearClick]: void;
  [handleWalletPageWithdrawAmountInputValueChange]: { value: string };
  [handleWalletPageWithdrawAmountInputValueClear]: void;
  [handleWalletPageWithdrawPasswordInputValueChange]: { password: string };
  [handleWalletPageWithdrawPasswordInputValueClear]: void;
  [handleWalletPageWithdrawBtnClick]: void;
  [handleWalletPageRechargeContentDepositBtnClick]: {
    isRechargeFromGame: boolean;
  };
};

export interface HandleWalletPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useWalletPageActions = () => {
  const { mapRoutesNavTo, navToLoginPage } = useNavPageClick();

  const { onRecharge } = useRecharge();
  const { onWithdraw } = useWithdraw();
  const { requiredVerifyBeforeRecharging, checkIsBankFirstBind } =
    useUserVerifyState();

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

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    // [handleWalletPageSwitchTabClick]: ({ id }) => {
    //   handleGlobalClick({
    //     target: handleWalletPageSwitchTabClick,
    //     callback: () => {
    //       setCurSwitchContentTabId(id);
    //     },
    //   });
    // },
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
    // [handleWalletPageRechargeCardClick]: ({ card }) => {
    //   handleGlobalClick({
    //     target: handleWalletPageRechargeCardClick,
    //     callback: () => {
    //       setCurrentRechargeCard(card);
    //     },
    //   });
    // },
    // [handleWalletPageSetPayChannelClick]: ({ item }) => {
    //   handleGlobalClick({
    //     target: handleWalletPageSetPayChannelClick,
    //     callback: () => {
    //       setCurrentPayChannel(item);
    //     },
    //   });
    // },
    // [handleWalletPagePayPayChannelOtpClick]: ({ item }) => {
    //   handleGlobalClick({
    //     target: handleWalletPagePayPayChannelOtpClick,
    //     callback: () => {
    //       setCurrentPayOption(item);
    //     },
    //   });
    // },
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
            mapRoutesNavTo(BasePagePathObj.BindKYCPage, '', {
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
          if (!sdkUtils.isCurrentLogin()) {
            navToLoginPage();
          } else if (!requiredVerifyBeforeRecharging()) {
            onRecharge();
          } else {
            mapRoutesNavTo(BasePagePathObj.BindKYCPage, '', {
              state: { tab: KYC_PERSONAL_STATE },
            });
          }
        },
      });
    },
    // [handleWalletPageRechargeTabCheckOrderClick]: () => {
    //   handleGlobalClick({
    //     target: handleWalletPageRechargeTabCheckOrderClick,
    //     callback: () => {
    //       navigate(BasePagePathObj.RecordPage, {
    //         state: {
    //           tab: RecordPageTabs.RECORD,
    //           subTab: RecordPageBalanceRecordTabs.ADD_CASH_RECORD,
    //         },
    //       });
    //     },
    //   });
    // },
    // [handleWalletPageWithdrawTabCheckOrderClick]: () => {
    //   handleGlobalClick({
    //     target: handleWalletPageWithdrawTabCheckOrderClick,
    //     callback: () => {
    //       navigate(BasePagePathObj.RecordPage, {
    //         state: {
    //           tab: RecordPageTabs.RECORD,
    //           subTab: RecordPageBalanceRecordTabs.WITHDRAWALS_RECORD,
    //         },
    //       });
    //     },
    //   });
    // },
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
