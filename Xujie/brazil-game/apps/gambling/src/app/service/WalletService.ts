import { useBindWithdrawPasswordTransform } from '../external/transform/wallet/useBindWithdrawPasswordTransform';
import { useHasWithdrawPasswordTransform } from '../external/transform/wallet/useHasWithdrawPasswordTransform';
import { useVerifyWithdrawPasswordTransform } from '../external/transform/wallet/useVerifyWithdrawPasswordTransform';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxStore';
import { useEffect } from 'react';

export const WalletService = () => {
  const { isLogin } = useSelector((state: RootState) => state.app);
  const {
    trigger: triggerBindWithdrawPassword,
    isSuccess: isBindSuccess,
    reset: resetBind,
  } = useBindWithdrawPasswordTransform();

  const {
    trigger: triggerVerifyWithdrawPassword,
    isSuccess: isVerifySuccess,
    reset: resetVerify,
  } = useVerifyWithdrawPasswordTransform();

  const { isBinding: isBindingWithdrawPassword } =
    useHasWithdrawPasswordTransform(isLogin);

  /**
   * init reset
   */
  useEffect(() => {
    resetBind();
    resetVerify();
  }, []);

  /**
   * 綁定提現密碼
   */
  const doBindWithdrawPassword = (password: string) => {
    return triggerBindWithdrawPassword(password)
      .then((response) => {
        return response;
      })
      .finally(() => {});
  };

  /**
   * 驗證提現密碼
   */
  const doVerifyWithdrawPassword = (password: string) => {
    return triggerVerifyWithdrawPassword(password)
      .then((response) => {
        return response;
      })
      .finally(() => {});
  };

  return {
    isBindingWithdrawPassword, // 是否已經綁定過提現密碼
    doBindWithdrawPassword,
    isBindSuccess,
    doVerifyWithdrawPassword,
    isVerifySuccess,
  };
};
