import { useCallback, useEffect } from 'react';
import { message } from 'antd';
import { Md5 } from 'ts-md5';
import { usePostPayPayoutMutation } from '@/external/api';
import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';
import { useDeepEffect } from '@libs/commonUtils';
import sdkUtils from '@mode2/utils/sdk';

export const useWithdraw = () => {
  const [postPayPayout, { data, reset, isSuccess, isLoading }] =
    usePostPayPayoutMutation();

  const withdrawAmountInputValue = useWalletPageWithdrawContentStore(
    (state) => state.withdrawAmountInputValue
  );
  const withdrawBankValue = useWalletPageWithdrawContentStore(
    (state) => state.withdrawBankValue
  );
  const withdrawPasswordInputValue = useWalletPageWithdrawContentStore(
    (state) => state.withdrawPasswordInputValue
  );
  const setWithdrawAmountInputValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawAmountInputValue
  );
  const setWithdrawPasswordInputValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawPasswordInputValue
  );
  const setDisabled = useWalletPageWithdrawContentStore(
    (state) => state.setDisabled
  );

  useDeepEffect(() => {
    if (isSuccess && data) {
      message.success(data.withdrawResult);
      setWithdrawAmountInputValue('');
      setWithdrawPasswordInputValue('');
      // 成功後，重置
      reset();
    }
  }, [isSuccess, data]);

  const onWithdraw = useCallback(() => {
    const bankCardId = Number(withdrawBankValue?.id || '-1');
    if (bankCardId > 0) {
      postPayPayout({
        amount: +withdrawAmountInputValue,
        bankCardId: bankCardId,
        password: Md5.hashStr(withdrawPasswordInputValue),
      });
    }
    return;
  }, [
    withdrawAmountInputValue,
    withdrawPasswordInputValue,
    withdrawBankValue,
    sdkUtils,
  ]);

  useEffect(() => {
    setDisabled(isLoading);
  }, [isLoading])

  return {
    onWithdraw,
  };
};
