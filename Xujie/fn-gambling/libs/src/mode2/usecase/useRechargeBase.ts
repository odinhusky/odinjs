import { useLazyGetPayCheckoutDetailQuery } from '@mode2API/index';
import { isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { PayCheckoutDetailStateResult } from '../external/api/endpoint/wallet/GetPayCheckoutDetailEndpoint';
import dayjs from 'dayjs';

type PayCheckoutData = { txId?: string; url?: string };

export const useRechargeBase = () => {
  const [getPayCheckout, { currentData, isSuccess, isError }] =
    useLazyGetPayCheckoutDetailQuery();

  useEffect(() => {
    if (!currentData) return;
    if (isSuccess) {
      // TODO CustomizeCheckout info
      // TODO  polling polling 10 second
    }
    if (
      isError ||
      (currentData.status &&
        currentData.status !== PayCheckoutDetailStateResult.PENDING)
    ) {
      stopLoopGetCheckoutDetail();
    }
  }, [currentData]);

  /**
   * 兩種使用情境
   * 從 router [/checkout] 可以直接給 {url: '{domain}/checkout/${query}'} <Page/>
   * 從 充值頁面，遊戲內充值等等， 給 {txId : '{txId}'} <Content/>
   * @param data
   */
  const onPayCheckoutDetail = (data: PayCheckoutData) => {
    let txId: string = '';
    if (isEmpty(data.txId)) {
      const params = new URLSearchParams(data.url || '');
      txId = params.has('txId') ? params.get('txId') || '' : '';
    } else {
      txId = data.txId || '';
    }
    return getPayCheckout({ txId: txId });
  };
  /**
   * 轮询支付结果
   */
  const getIntervalId = useRef<NodeJS.Timer | null>(null);
  const stopLoopGetCheckoutDetail = () => {
    getIntervalId.current && clearInterval(getIntervalId.current);
  };
  const getLoopPayCheckoutDetail = (data: PayCheckoutData) => {
    onPayCheckoutDetail(data);
    getIntervalId.current = setInterval(() => {
      onPayCheckoutDetail(data);
    }, 10000);
  };
  useEffect(() => {
    return stopLoopGetCheckoutDetail;
  }, []);
  /**
   * 支付剩余时间（s）
   */
  const [countdownTime, setCountDownTime] = useState<number>(0);
  useEffect(() => {
    if (!currentData?.expirationTime) return;
    const time = currentData.expirationTime - dayjs().unix();

    setCountDownTime(time > 0 ? time : 0);
    const interval = setInterval(() => {
      setCountDownTime((pre) => {
        return pre > 0 ? pre - 1 : 0;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [currentData?.expirationTime]);

  return {
    onPayCheckoutDetail,
    payCheckoutData: currentData,
    isPayCheckoutError: isError,
    getLoopPayCheckoutDetail,
    countdownTime,
  };
};
