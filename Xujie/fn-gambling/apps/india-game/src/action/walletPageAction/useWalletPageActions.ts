import {
  handleRechargeRepeatTopUpBonusModalAddBtnClick,
  handleRechargeRepeatTopUpBonusModalNoThanksBtnClick,
  handleWalletPageAddAccountBtnClick,
  handleWalletPageRechargeAmountChange,
  handleWalletPageRechargeAmountClearClick,
  handleWalletPageRechargeContentDepositBtnClick,
  handleWalletPageRechargeContentWeakTipsModalBindPlayerPhoneBtnClick,
  handleWalletPageRechargeContentWeakTipsModalCloseBtnClick,
  handleWalletPageRechargeContentWeakTipsModalPrimaryBtnClick,
  handleWalletPageRechargeDepositExtraBtnClick,
  handleWalletPageWithdrawAmountInputValueChange,
  handleWalletPageWithdrawAmountInputValueClear,
  handleWalletPageWithdrawAmountSelected,
  handleWalletPageWithdrawBtnClick,
  handleWalletPageWithdrawPasswordInputValueChange,
  handleWalletPageWithdrawPasswordInputValueClear,
} from '@mode2/action/actionTypes';

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
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import sdkUtils from '@mode2/utils/sdk';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@libs/mode2/@types/userRoleTypes';
import {
  useWithdrawStore,
  WithdrawOptItem,
} from '@/zustand/wallet/useWithdrawStore';
import {
  usePostPayAddOnPostponeMutation,
  usePostRechargeRecordsMutation,
} from '@mode2API/index';
import useBindPlayerPhoneModalStore from '@mode2/zustand/modal/BindPlayerPhoneModal';
import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';
import dayjs from '@commonUtils/localizedDayjs';
import { useEffect } from 'react';
import { useLoadingStore } from '@mode2/zustand/components/loadingStore';
import { PayAddOnOption } from '@mode2/zustand/modal/RechargeRepeatTopUpBonusModal';

export type ActionClickPayloadMap = {
  [handleWalletPageRechargeAmountChange]: { value: string };
  [handleWalletPageRechargeAmountClearClick]: void;
  [handleWalletPageWithdrawAmountInputValueChange]: { value: string };
  [handleWalletPageWithdrawAmountInputValueClear]: void;
  [handleWalletPageWithdrawPasswordInputValueChange]: { password: string };
  [handleWalletPageWithdrawPasswordInputValueClear]: void;
  [handleWalletPageWithdrawBtnClick]: { isPasswordless: boolean };
  [handleWalletPageRechargeContentDepositBtnClick]: {
    isRechargeFromGame?: boolean;
  };
  [handleWalletPageRechargeContentWeakTipsModalPrimaryBtnClick]: void;
  [handleWalletPageRechargeContentWeakTipsModalBindPlayerPhoneBtnClick]: void;
  [handleWalletPageRechargeContentWeakTipsModalCloseBtnClick]: void;

  [handleWalletPageWithdrawAmountSelected]: { item: WithdrawOptItem };
  [handleWalletPageAddAccountBtnClick]: void;

  [handleWalletPageRechargeDepositExtraBtnClick]: {
    isRechargeFromGame?: boolean;
  };
  [handleRechargeRepeatTopUpBonusModalNoThanksBtnClick]: void;
  [handleRechargeRepeatTopUpBonusModalAddBtnClick]: {
    payAddOnOption: PayAddOnOption | null;
  };
};

export interface HandleWalletPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useWalletPageActions = () => {
  const { navToLoginPage, navToBindKYCPage } = useNavPageClick();

  const { onRechargeBefore, doRecharge, doAddOnRecharge } = useRecharge();
  const { onWithdraw, onPasswordlessWithdraw } = useWithdraw();
  const { requiredVerifyBeforeRecharging, checkIsBankFirstBind } =
    useUserVerifyState();

  const setRechargeAmount = useRechargeStore(
    (state) => state.setRechargeAmount
  );

  const setIsDepositWeakTipsModalShow = useRechargeStore(
    (state) => state.setIsDepositWeakTipsModalShow
  );
  const setInProgressTipsModalShow = useRechargeStore(
    (state) => state.setInProgressTipsModalShow
  );
  const setShowBindPlayerPhoneModal = useBindPlayerPhoneModalStore(
    (state) => state.setShowBindPlayerPhoneModal
  );

  const setWithdrawAmountInputValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawAmountInputValue
  );

  const setWithdrawAmountSelected = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawAmountSelected
  );

  const setWithdrawPasswordInputValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawPasswordInputValue
  );

  // 抽出執行充值的邏輯
  const handleDeposit = () => {
    if (!sdkUtils.isCurrentLogin()) {
      navToLoginPage(66);
    } else if (!requiredVerifyBeforeRecharging()) {
      onRechargeBefore();
    } else {
      navToBindKYCPage('', {
        state: { tab: KYC_PERSONAL_STATE },
      });
    }
  };

  /**
   * player 綁定手機號碼弱提醒只顯示一次
   */
  const seveUserBindPhoneWeakTipsFlag = () => {
    userLocalForage.setItem(
      UserLocalforageStoreKeys.BIND_PLAYER_PHONE_WEAK_TIPS,
      JSON.stringify({ flagTime: dayjs().unix() })
    );
  };

  // 抽出點擊後判斷的邏輯，怕寫在 actionClickObj 中 userRole 不會變動，造成判斷失誤
  const handleJudgeDepositClick = async () => {
    const userRole = useUserProfileStore.getState().userRole;
    const flag = await userLocalForage.getItem(
      UserLocalforageStoreKeys.BIND_PLAYER_PHONE_WEAK_TIPS
    );
    if (userRole === UserRoleType.PLAYER && flag === null) {
      // 讓 WeakTipsModal 出現
      setIsDepositWeakTipsModalShow(true);
    } else {
      // 如果是 Guest 或是 User 則由這個 function 判斷
      handleDeposit();
    }
  };
  const [postRechargeRecords] = usePostRechargeRecordsMutation();

  /**
   * 即時判斷是否兩小時內連續五筆代處理訂單
   */
  const handleJudgeDepositExtraClick = async () => {
    postRechargeRecords({ page: 1, limit: 5 })
      .unwrap()
      .then((resp) => {
        useRechargeStore
          .getState()
          .setInProgressRecharge2h(resp.inProgressRecharge2h);
        if (resp.inProgressRecharge2h >= 5) {
          setInProgressTipsModalShow(true);
        } else {
          handleJudgeDepositClick();
        }
      })
      .catch((e) => {
        handleJudgeDepositClick();
      });
  };

  const [postPayAddOnPostpone, { isLoading }] =
    usePostPayAddOnPostponeMutation();

  // 延遲加碼優惠
  useEffect(() => {
    useLoadingStore.getState().setShowLoading(isLoading);
  }, [isLoading]);

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
        payload: { value },
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
        payload: { value },
        callback: () => {
          setWithdrawAmountInputValue(value);
        },
      });
    },
    [handleWalletPageWithdrawAmountSelected]: ({ item }) => {
      handleGlobalClick({
        target: handleWalletPageWithdrawAmountSelected,
        payload: { item },
        callback: () => {
          useWithdrawStore.setState((state) => {
            const withdrawOptions = state.withdrawOptions.map((opt) =>
              opt.amount === item.amount && opt.index === item.index
                ? { ...opt, isActive: true }
                : { ...opt, isActive: false }
            );
            return {
              withdrawOptions: withdrawOptions,
            };
          });
          setWithdrawAmountSelected(item);
          setWithdrawAmountInputValue(`${item.amount}`);
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
    [handleWalletPageWithdrawBtnClick]: ({ isPasswordless }) => {
      handleGlobalClick({
        target: handleWalletPageWithdrawBtnClick,
        payload: { isPasswordless },
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
            navToBindKYCPage('', { state: { tab: KYC_BOTH_STATE } });
          } else {
            if (isPasswordless) {
              onPasswordlessWithdraw();
            } else {
              onWithdraw();
            }
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
          handleJudgeDepositClick();
        },
      });
    },
    [handleWalletPageRechargeContentWeakTipsModalPrimaryBtnClick]: () => {
      handleGlobalClick({
        target: handleWalletPageRechargeContentWeakTipsModalPrimaryBtnClick,
        callback: () => {
          handleDeposit();
          setIsDepositWeakTipsModalShow(false);
          setInProgressTipsModalShow(false);
          seveUserBindPhoneWeakTipsFlag();
        },
      });
    },
    [handleWalletPageRechargeContentWeakTipsModalBindPlayerPhoneBtnClick]:
      () => {
        handleGlobalClick({
          target:
            handleWalletPageRechargeContentWeakTipsModalBindPlayerPhoneBtnClick,
          callback: () => {
            setShowBindPlayerPhoneModal(true);
            setIsDepositWeakTipsModalShow(false);
            seveUserBindPhoneWeakTipsFlag();
          },
        });
      },
    [handleWalletPageRechargeContentWeakTipsModalCloseBtnClick]: () => {
      handleGlobalClick({
        target: handleWalletPageRechargeContentWeakTipsModalCloseBtnClick,
        callback: () => {
          setIsDepositWeakTipsModalShow(false);
          setInProgressTipsModalShow(false);
          seveUserBindPhoneWeakTipsFlag();
        },
      });
    },
    [handleWalletPageAddAccountBtnClick]: () => {
      handleGlobalClick({
        target: handleWalletPageAddAccountBtnClick,
        callback: () => {
          navToBindKYCPage('', { state: { tab: KYC_BOTH_STATE } });
        },
      });
    },
    // 額外充值前，判斷是否過多處理中訂單未完成
    [handleWalletPageRechargeDepositExtraBtnClick]: ({
      isRechargeFromGame,
    }) => {
      handleGlobalClick({
        target: handleWalletPageRechargeDepositExtraBtnClick,
        callback: () => {
          handleJudgeDepositExtraClick();
        },
      });
    },
    [handleRechargeRepeatTopUpBonusModalAddBtnClick]: ({ payAddOnOption }) => {
      handleGlobalClick({
        target: handleRechargeRepeatTopUpBonusModalAddBtnClick,
        payload: { payAddOnOption },
        callback: () => {
          doAddOnRecharge(payAddOnOption);
        },
      });
    },
    [handleRechargeRepeatTopUpBonusModalNoThanksBtnClick]: () => {
      handleGlobalClick({
        target: handleRechargeRepeatTopUpBonusModalNoThanksBtnClick,
        callback: () => {
          doRecharge();
          postPayAddOnPostpone();
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
