import { PayActivationResult } from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';
import {
  RechargeStatusResult,
  useRechargeStore,
} from '@/zustand/wallet/rechargeStore';
import { PayCheckoutDetailStateResult } from '@libs/mode2/external/api/endpoint/wallet/GetPayCheckoutDetailEndpoint';
import { useRechargeBase } from '@libs/mode2/usecase/useRechargeBase';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PAY_CONTENT_MAP } from './const';
import { useBreakPoint } from '@libs/commonUtils';
import useCustomizeCheckoutPageFooterSetting from '@/ui/hooks/pages/customizeCheckoutPage/useCustomizeCheckoutPageFooterSetting';
import { usePageResetFloatActionButton } from '@/ui/hooks/pages/usePageResetFloatActionButton';

const useCustomizeCheckout = () => {
  // === CustomizeCheckoutPage Footer Setting
  useCustomizeCheckoutPageFooterSetting();

  // === Page FloatActionButton reset
  usePageResetFloatActionButton();

  const { payCheckoutData, countdownTime, getLoopPayCheckoutDetail } =
    useRechargeBase();
  const rechargeResult = useRechargeStore((state) => state.rechargeResult);
  const finishRecharge = useRechargeStore((state) => state.finishRecharge);
  const setRechargeStatus = useRechargeStore(
    (state) => state.setRechargeStatus
  );
  const config = useHeaderStore((state) => state.config);
  const setConfig = useHeaderStore((state) => state.setConfig);
  const [initConfig] = useState(config);
  const [UTR, setUTR] = useState('');

  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    const txId = rechargeResult.txId;
    txId && getLoopPayCheckoutDetail({ txId });
  }, []);

  //支付结束 ==> 成功 || 失败 || 逾期
  const finishRef = useRef(false);

  const isPayFinish = useMemo(() => {
    const result =
      !!payCheckoutData &&
      (payCheckoutData.status !== PayCheckoutDetailStateResult.PENDING ||
        countdownTime < 0);
    finishRef.current = result;
    return result;
  }, [countdownTime, payCheckoutData]);

  const { isDesktop } = useBreakPoint();

  const payContentData = rechargeResult
    ? PAY_CONTENT_MAP[rechargeResult.payMethod as PayActivationResult]
    : null;
  const title = payContentData?.title || '';

  const handleBack = useCallback(() => {
    !isPayFinish && payContentData?.showConfig.UTR && !UTR
      ? setShowLeaveModal(true)
      : setRechargeStatus(RechargeStatusResult.NONE);
  }, [isPayFinish, UTR]);

  useEffect(() => {
    setConfig({
      type: isDesktop ? EHeaderType.Main : EHeaderType.Common,
      title: { i18nKey: title },
      onBack: handleBack,
    });
    return () => setConfig(initConfig);
  }, [isDesktop, handleBack]);

  useEffect(() => {
    return () => {
      // 支付订单已完成，卸载时清除该笔支付数据
      finishRef.current && finishRecharge();
    };
  }, []);
  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, [isPayFinish]);

  const LeaveModalProps = {
    onLeave: () => setRechargeStatus(RechargeStatusResult.NONE),
    onClose: () => setShowLeaveModal(false),
  };

  return {
    payCheckoutData,
    LeaveModalProps,
    onSubmitUTR: setUTR,
    showLeaveModal,
    countdownTime,
    isPayFinish,
    payMethod: PayActivationResult.CRYPTO_WALLET, // TODO Evan 自定義收銀台
    // payMethod:
    //   (rechargeResult.payMethod as PayActivationResult) ||
    //   PayActivationResult.UPI,
    title,
    handleBack,
  };
};
export default useCustomizeCheckout;
