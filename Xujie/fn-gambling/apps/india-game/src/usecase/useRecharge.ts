import {
  usePostPayRechargeMutation,
  usePostRechargeIntoGameMutation,
} from '@mode2API/index';
import { useCallback } from 'react';
import { message } from 'antd';
import { PayRechargeRequest } from '@mode2API/endpoint/info/PostPayRechargeEndpoint';
import { useDeepEffect } from '@libs/commonUtils';
import {
  RechargeFromResult,
  RechargeStatusResult,
  useRechargeStore,
} from '@/zustand/wallet/rechargeStore';
import sdkUtils from '@mode2/utils/sdk';
import { AdjustEventKey } from '@mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import { PayActivationResult } from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';
import { useRechargeConfirmationModalStore } from '@mode2/zustand/components/rechargeConfirmationStore';
import { useMode2WebviewPageStore } from '@libs/mode2/zustand/page/webviewPageStore';
import { useRechargeBase } from '@mode2/usecase/useRechargeBase';
import { useLoadingStore } from '@mode2/zustand/components/loadingStore';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';

export const useRecharge = () => {
  const setShowLoading = useLoadingStore((status) => status.setShowLoading);

  const [
    postPayRecharge,
    {
      data: rechargeData,
      reset: resetRecharge,
      isSuccess: isRechargeSuccess,
      isLoading: isRechargeLoading,
      isError: isRechargeError,
    },
  ] = usePostPayRechargeMutation();

  const [
    postRechargeIntoGame,
    {
      reset: intoGameReset,
      isSuccess: isRechargeIntoGameSuccess,
      data: rechargeIntoGameResult,
    },
  ] = usePostRechargeIntoGameMutation();

  const { isPayCheckoutError } = useRechargeBase();
  // const { checkIsBankFirstBind } = useUserVerifyState();
  /* 當前充值卡 */
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );

  /* 當前選定支付通道 */
  const currentPayChannel = useWalletPageRechargeContentStore(
    (state) => state.currentPayChannel
  );

  /* 當前充值金額 */
  const rechargeAmount = useRechargeStore((state) => state.rechargeAmount);

  /* 充值來源 */
  const rechargeFrom = useRechargeStore((state) => state.rechargeFrom);

  /* */
  const rechargeResult = useRechargeStore((state) => state.rechargeResult);
  const setRechargeResult = useRechargeStore(
    (state) => state.setRechargeResult
  );

  /*  上一次充值結果 ，用於 遊戲內充值回調 */
  const finishRecharge = useRechargeStore((state) => state.finishRecharge);
  const { setIsShowRechargeConfirmationModal } =
    useRechargeConfirmationModalStore();

  const setIsShowRechargeContent = useMode2WebviewPageStore(
    (state) => state.setIsShowRechargeContent
  );

  /* 充值狀態 */
  const setRechargeStatus = useRechargeStore(
    (state) => state.setRechargeStatus
  );

  // TODO Evan 自定義收銀台
  // const mapCustomizedPayCheckout: Record<string, PayActivationResult> = {
  //   [PayActivationResult.CRYPTO_WALLET]: PayActivationResult.CRYPTO_WALLET,
  //   [PayActivationResult.UPI]: PayActivationResult.UPI,
  //   [PayActivationResult.PHONEPE]: PayActivationResult.PHONEPE,
  // };

  // TODO Evan 自定義收銀台
  // useDeepEffect(() => {
  //   if (isRechargeSuccess && rechargeData) {
  //     const rechargeUrl: string = rechargeData.rechargeUrl || '';
  //     const params = new URLSearchParams(rechargeUrl.split('?')[1]);
  //     const txId = params.get('txId') || '';
  //     const payMethod = params.get('payMethod') || '';
  //     const customizedPayCheckout: PayActivationResult | null =
  //       mapCustomizedPayCheckout[payMethod || ''] || null;
  //     if (!isEmpty(txId) && !isEmpty(payMethod) && customizedPayCheckout) {
  //       const result = {
  //         rechargeUrl: rechargeUrl,
  //         payActivation: customizedPayCheckout,
  //         isTransferInGame:
  //           rechargeFrom === RechargeFromResult.TRANSFER_IN_GAME,
  //         timestamp: Date.now(),
  //         txId,
  //         payMethod,
  //       };
  //       setRechargeResult({ ...result });
  //     } else {
  //       const result = {
  //         rechargeUrl,
  //         payActivation: currentPayChannel.payActivation,
  //         isTransferInGame:
  //           rechargeFrom === RechargeFromResult.TRANSFER_IN_GAME,
  //         timestamp: Date.now(),
  //         txId,
  //         payMethod,
  //       };
  //       setRechargeResult({ ...result });
  //     }
  //     if (currentPayChannel.payActivation === PayActivationResult.EXTERNAL) {
  //       sdkUtils.openBrowser(rechargeUrl);
  //     }
  //     // 成功後，重置
  //     resetRecharge();
  //   }
  // }, [isRechargeSuccess, rechargeData, currentPayChannel]);

  useDeepEffect(() => {
    if (isRechargeSuccess && rechargeData) {
      const rechargeUrl: string = rechargeData.rechargeUrl || '';

      const result = {
        rechargeUrl,
        payActivation: currentPayChannel.payActivation,
        isTransferInGame: rechargeFrom === RechargeFromResult.TRANSFER_IN_GAME,
        timestamp: Date.now(),
        txId: '',
        payMethod: '',
      };
      setRechargeResult({ ...result });
      if (currentPayChannel.payActivation === PayActivationResult.EXTERNAL) {
        sdkUtils.openBrowser(rechargeUrl);
      }
      // 成功後，重置
      resetRecharge();
    }
  }, [isRechargeSuccess, rechargeData, currentPayChannel]);

  useDeepEffect(() => {
    if (isRechargeError || isPayCheckoutError) {
      setRechargeStatus(RechargeStatusResult.ERROR);
    }
  }, [isRechargeError, isPayCheckoutError]);

  useDeepEffect(() => {
    if (isRechargeIntoGameSuccess && rechargeIntoGameResult) {
      if (rechargeIntoGameResult.isRechargeSuccess) {
        finishRecharge();
        intoGameReset();
        setIsShowRechargeContent(false);
        setIsShowRechargeConfirmationModal(false);
      } else {
        message.info(rechargeIntoGameResult.rechargeResultMsg);
      }
    }
  }, [isRechargeIntoGameSuccess, rechargeIntoGameResult]);

  /**
   * 執行充值
   */
  const onRecharge = useCallback(() => {
    sdkUtils.sendEvent(AdjustEventKey.START_RECHARGE);
    const data: PayRechargeRequest = {
      amount: +rechargeAmount,
      isReward: currentRechargeCard === RechargeCard.GENERAL ? 0 : 1,
      isTransferInGame: rechargeFrom === RechargeFromResult.TRANSFER_IN_GAME,
      payConfigName: currentPayChannel.payName,
      payType: 'upi',
    };

    if (+rechargeAmount <= 0) {
      return false;
    }
    // if (
    //   mapCustomizedPayCheckout[currentPayChannel.payActivation] &&
    //   rechargeResult.txId
    // ) {
    //   //STEP checkout走rechargeResult缓存数据
    //   setRechargeStatus(RechargeStatusResult.CUSTOMIZED);
    // } else {
    //   postPayRecharge(data);
    // }

    postPayRecharge(data);
    return;
  }, [
    rechargeAmount,
    currentRechargeCard,
    currentPayChannel,
    rechargeResult.txId,
  ]);

  // /**
  //  * 取得充值詳情，for USDT pay
  //  */
  // const onPayCheckoutDetail = useCallback(() => {
  //   const txId: string = '';
  //   if (+rechargeAmount <= 0) {
  //     return false;
  //   }
  //   getPayCheckout({ txId: txId });
  //   return;
  // }, [rechargeAmount, currentRechargeCard, currentPayChannel]);

  useDeepEffect(() => {
    setShowLoading(isRechargeLoading);
  }, [isRechargeLoading]);

  const doRechargeInToGameCallback = () => {
    postRechargeIntoGame();
  };

  return {
    onRecharge,
    doRechargeInToGameCallback,
  };
};
