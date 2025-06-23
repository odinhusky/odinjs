import {
  handleRechargeSecretPageOpenOnlineServiceActionClick,
  handleRechargeSecretPagePayNowBtnClick,
  handleRechargeSecretPageRechargeChannelChangeAction,
  handleRechargeSecretPageRechargeOptionChangeAction,
} from '@mode2/action/actionTypes';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { useToastStore } from '@libs/mode2/zustand/components/toastStore';
import sdkUtils from '@libs/mode2/utils/sdk';
import useRechargeSecretPageStore from '@libs/mode2/zustand/page/rechargeSecretPageStore';
import {
  PayInboxInfoResult,
  PayInboxOptionsResult,
} from '@libs/mode2/external/api/endpoint/wallet/PostPayInboxConfigEndpoint';
import { usePostPayInboxRechargeMutation } from '@libs/mode2/external/api';
import { AdjustEventKey } from '@libs/mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import { useEffect, useMemo } from 'react';
import { RechargeCard } from '@libs/mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

type ActionClickPayloadMap = {
  [handleRechargeSecretPagePayNowBtnClick]: void;
  [handleRechargeSecretPageOpenOnlineServiceActionClick]: void;
  [handleRechargeSecretPageRechargeOptionChangeAction]: {
    item: PayInboxOptionsResult;
  };
  [handleRechargeSecretPageRechargeChannelChangeAction]: {
    item: PayInboxInfoResult;
  };
};

export interface HandleRechargeSecretPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useRechargeSecretPageAction = () => {
  const { t } = useTranslation();

  const currentRecharge = useRechargeSecretPageStore(
    (state) => state.currentRecharge
  );

  const currentRechargeCard = useRechargeSecretPageStore(
    (state) => state.currentRechargeCard
  );

  const currentPayChannel = useRechargeSecretPageStore(
    (state) => state.currentPayChannel
  );

  const setCurrentPayChannel = useRechargeSecretPageStore(
    (state) => state.setCurrentPayChannel
  );

  const setCurrentRecharge = useRechargeSecretPageStore(
    (state) => state.setCurrentRecharge
  );

  const setRechargeOptions = useRechargeSecretPageStore(
    (state) => state.setRechargeOptions
  );

  const rechargeSecretLimitedOffersEndTime = useRechargeSecretPageStore(
    (state) => state.rechargeSecretLimitedOffersEndTime
  );

  const [postPayInboxRecharge, { data, isSuccess }] =
    usePostPayInboxRechargeMutation();
  useEffect(() => {
    if (data && isSuccess) {
      sdkUtils.openBrowser(data.rechargeUrl);
      // 充值成功
    }
  }, [data, isSuccess]);

  const countdownTime = useMemo(() => {
    const nowUnix = dayjs().unix();
    return rechargeSecretLimitedOffersEndTime > nowUnix
      ? rechargeSecretLimitedOffersEndTime - nowUnix
      : 0;
  }, [rechargeSecretLimitedOffersEndTime]);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleRechargeSecretPagePayNowBtnClick]: () => {
      handleGlobalClick({
        target: handleRechargeSecretPagePayNowBtnClick,
        callback: () => {
          // 活動結束：1 倒數計時結束點擊“Deposit Now”，跳出toast 2 跳轉充值-複充頁
          if (countdownTime <= 0) {
            const uuid = uuidv4();
            useToastStore.getState().showToast(
              t('end_of_the_recharge_offer'),
              (id) => {
                if (id === uuid) {
                  useRechargeSecretPageStore
                    .getState()
                    .setShowRechargeContent(true);
                }
              },
              uuid
            );
            return;
          }

          // 活動期間：點擊跳轉外部支付browser
          sdkUtils.sendEvent(AdjustEventKey.START_RECHARGE);
          postPayInboxRecharge({
            amount: currentRecharge.amount,
            isReward: currentRechargeCard !== RechargeCard.GENERAL,
            isTransferInGame: false,
            payConfigName: currentPayChannel.payName,
            payType: 'upi',
            isAddon: false,
            baseAmount: 0,
          });
        },
      });
    },
    [handleRechargeSecretPageOpenOnlineServiceActionClick]: () => {
      handleGlobalClick({
        target: handleRechargeSecretPageOpenOnlineServiceActionClick,
        callback: () => {
          sdkUtils.openChat(() => {});
        },
      });
    },
    [handleRechargeSecretPageRechargeOptionChangeAction]: ({ item }) => {
      handleGlobalClick({
        target: handleRechargeSecretPageRechargeOptionChangeAction,
        payload: { item },
        callback: () => {
          setCurrentRecharge(item);
        },
      });
    },
    [handleRechargeSecretPageRechargeChannelChangeAction]: ({ item }) => {
      handleGlobalClick({
        target: handleRechargeSecretPageRechargeChannelChangeAction,
        payload: { item },
        callback: () => {
          setRechargeOptions(item.options);
          setCurrentPayChannel(item);
        },
      });
    },
  };

  const handleRechargeSecretPageClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleRechargeSecretPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleRechargeSecretPageClick,
  };
};
