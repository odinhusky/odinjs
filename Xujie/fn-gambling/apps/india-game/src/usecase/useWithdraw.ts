import { useCallback, useEffect } from 'react';
import { Md5 } from 'ts-md5';
import { usePostPayPayoutMutation } from '@/external/api';
import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';
import { useDeepEffect } from '@libs/commonUtils';
import sdkUtils from '@mode2/utils/sdk';
import { useMessageStore } from '@mode2/zustand/components/messageStore';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';

export const useWithdraw = () => {
  const [postPayPayout, { data, reset, isSuccess, isLoading, isError }] =
    usePostPayPayoutMutation();

  const withdrawAmountInputValue = useWalletPageWithdrawContentStore(
    (state) => state.withdrawAmountInputValue
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
      useMessageStore.getState().success(data.withdrawResult);
      useWalletPageStore.getState().setWithdrawalsState(true);
      setWithdrawAmountInputValue('');
      setWithdrawPasswordInputValue('');
      // 成功後，重置
      reset();
    }
  }, [isSuccess, data]);

  const onWithdraw = useCallback(() => {
    useWalletPageStore.getState().setWithdrawalsState(false);
    postPayPayout({
      amount: +withdrawAmountInputValue,
      password: Md5.hashStr(withdrawPasswordInputValue),
    });
    return;
  }, [withdrawAmountInputValue, withdrawPasswordInputValue, sdkUtils]);

  useEffect(() => {
    setDisabled(isLoading);
  }, [isLoading]);

  const onPasswordlessWithdraw = useCallback(() => {
    // TODO for V6 無密碼提領
    console.log('@@@===> TODO for V6 無密碼提領');
    useWalletPageStore.getState().setWithdrawalsState(false);
    postPayPayout({
      amount: +withdrawAmountInputValue,
      password: '',
    });
    return;
  }, [withdrawAmountInputValue, withdrawPasswordInputValue, sdkUtils]);

  useEffect(() => {
    setDisabled(isLoading);
  }, [isLoading]);

  // TODO Evan mock
  useEffect(() => {
    if (isError) {
      // useWalletPageStore.getState().setWithdrawalsState(true);
    }
  }, [isError]);

  return {
    isWithdrawSuccess: isSuccess,
    onWithdraw,
    onPasswordlessWithdraw,
  };
};
