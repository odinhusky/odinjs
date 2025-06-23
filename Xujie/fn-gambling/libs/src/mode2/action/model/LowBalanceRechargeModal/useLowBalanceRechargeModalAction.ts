import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import {
  handleLowBalanceRechargeModalAmountOptionsRechargeClickAction,
  handleLowBalanceRechargeModalCloseModalClickAction,
  handleLowBalanceRechargeModalRechargeChannelChangeAction,
  handleLowBalanceRechargeModalRechargeClickAction,
  handleLowBalanceRechargeModalRechargeOptionChangeAction,
  handleLowBalanceRechargeModalShowModalClickAction,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '../../handleGlobalClick';
import useLowBalanceRechargeModalStore from '@libs/mode2/zustand/modal/LowBalanceRechargeModal';
import {
  PayBrokenInfoResult,
  PayBrokenOptionsResult,
} from '@libs/mode2/external/api/endpoint/wallet/PostPayBrokenConfigEndpoint';
import { usePostPayBrokenRechargeMutation } from '@libs/mode2/external/api';
import { useEffect, useRef } from 'react';
import { RechargeCard } from '@libs/mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import { AdjustEventKey } from '@libs/mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import sdkUtils from '@libs/mode2/utils/sdk';
import useModalLayoutStore from '@mode2/zustand/template/modalLayoutStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import { useTranslation } from 'react-i18next';

type ActionClickPayloadMap = {
  [handleLowBalanceRechargeModalCloseModalClickAction]: void;
  [handleLowBalanceRechargeModalShowModalClickAction]: void;
  [handleLowBalanceRechargeModalRechargeOptionChangeAction]: {
    item: PayBrokenOptionsResult;
  };
  [handleLowBalanceRechargeModalAmountOptionsRechargeClickAction]: {
    item: PayBrokenOptionsResult;
    timeLeft: number;
  };
  [handleLowBalanceRechargeModalRechargeChannelChangeAction]: {
    item: PayBrokenInfoResult;
  };
  [handleLowBalanceRechargeModalRechargeClickAction]: { timeLeft: number };
};

export interface HandleLowBalanceRechargeModalActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useLowBalanceRechargeModalActions = () => {
  const { t } = useTranslation();
  const [postPayBrokenRecharge, { data, isSuccess }] =
    usePostPayBrokenRechargeMutation();

  const currentRechargeCard = useLowBalanceRechargeModalStore(
    (state) => state.currentRechargeCard
  );

  const currentPayChannel = useLowBalanceRechargeModalStore(
    (state) => state.currentPayChannel
  );

  const currentRecharge = useLowBalanceRechargeModalStore(
    (state) => state.currentRecharge
  );

  const setShowLowBalanceRechargeModal = useLowBalanceRechargeModalStore(
    (state) => state.setShowLowBalanceRechargeModal
  );

  const setRechargeOptions = useLowBalanceRechargeModalStore(
    (state) => state.setRechargeOptions
  );

  const setCurrentRecharge = useLowBalanceRechargeModalStore(
    (state) => state.setCurrentRecharge
  );

  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);
  const currentRefreshId = useRef<number>(0);

  useEffect(() => {
    if (data && isSuccess) {
      sdkUtils.openBrowser(data.rechargeUrl);
      setShowLowBalanceRechargeModal(false);

      currentRefreshId.current += 1;
    }
  }, [data, isSuccess]);

  useEffect(() => {
    const refreshId = currentRefreshId.current;
    if (refreshId === 0) return;

    const delays = [30000, 30000, 60000];
    const currentId = currentRefreshId.current;
    let totalDelay = 0;
    const timers: number[] = [];

    delays.forEach((delay, index) => {
      totalDelay += delay;
      const timer = window.setTimeout(() => {
        if (currentRefreshId.current !== currentId) return;
        refreshUserData();

        console.log('刷新第', index + 1, '次');

        if (index === delays.length - 1) {
          console.log('刷新完成');
          currentRefreshId.current = 0;
        }
      }, totalDelay);

      timers.push(timer);
    });

    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, [currentRefreshId.current]);

  const onRecharge = ({
    amount,
    timeLeft,
  }: {
    amount: number;
    timeLeft: number;
  }) => {
    if (timeLeft <= 0) {
      useToastStore.getState().showToast(t('end_of_the_recharge_offer'));
      return;
    }

    sdkUtils.sendEvent(AdjustEventKey.START_RECHARGE);
    postPayBrokenRecharge({
      amount,
      isReward: currentRechargeCard !== RechargeCard.GENERAL,
      isTransferInGame: false,
      payConfigName: currentPayChannel.payName,
      payType: 'upi',
      isAddon: false,
      baseAmount: 0,
    });
  };

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleLowBalanceRechargeModalCloseModalClickAction]: () => {
      handleGlobalClick({
        target: handleLowBalanceRechargeModalCloseModalClickAction,
        callback: () => {
          setShowLowBalanceRechargeModal(false);
          useModalLayoutStore
            .getState()
            .verifyNextStep('LowBalanceRechargeShowAction');
        },
      });
    },
    [handleLowBalanceRechargeModalShowModalClickAction]: () => {
      handleGlobalClick({
        target: handleLowBalanceRechargeModalShowModalClickAction,
        callback: () => {
          setShowLowBalanceRechargeModal(true);
        },
      });
    },
    [handleLowBalanceRechargeModalRechargeOptionChangeAction]: ({ item }) => {
      handleGlobalClick({
        target: handleLowBalanceRechargeModalRechargeOptionChangeAction,
        payload: { item },
        callback: () => {
          if (item.id === currentRecharge.id) return;
          setCurrentRecharge(item);
        },
      });
    },
    [handleLowBalanceRechargeModalRechargeChannelChangeAction]: ({ item }) => {
      handleGlobalClick({
        target: handleLowBalanceRechargeModalRechargeChannelChangeAction,
        payload: { item },
        callback: () => {
          console.log(item);
          // if (item.payName === currentPayChannel.payName) return;
          setRechargeOptions(item.options);
        },
      });
    },
    [handleLowBalanceRechargeModalRechargeClickAction]: ({ timeLeft }) => {
      handleGlobalClick({
        target: handleLowBalanceRechargeModalRechargeClickAction,
        payload: { timeLeft },
        callback: () => {
          // if (timeLeft <= 0) {
          //   useToastStore.getState().showToast(t('end_of_the_recharge_offer'));
          //   return;
          // }

          onRecharge({ amount: currentRecharge.amount, timeLeft });
          // sdkUtils.sendEvent(AdjustEventKey.START_RECHARGE);
          // postPayBrokenRecharge({
          //   amount: currentRecharge.amount,
          //   isReward: currentRechargeCard !== RechargeCard.GENERAL,
          //   isTransferInGame: false,
          //   payConfigName: currentPayChannel.payName,
          //   payType: 'upi',
          //   isAddon: false,
          //   baseAmount: 0,
          // });
        },
      });
    },
    [handleLowBalanceRechargeModalAmountOptionsRechargeClickAction]: ({
      item,
      timeLeft,
    }) => {
      handleGlobalClick({
        target: handleLowBalanceRechargeModalAmountOptionsRechargeClickAction,
        payload: { item, timeLeft },
        callback: () => {
          onRecharge({ amount: item.amount, timeLeft });
        },
      });
    },
  };

  const handleLowBalanceRechargeModalClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleLowBalanceRechargeModalActionProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleLowBalanceRechargeModalClick,
  };
};

export default useLowBalanceRechargeModalActions;
