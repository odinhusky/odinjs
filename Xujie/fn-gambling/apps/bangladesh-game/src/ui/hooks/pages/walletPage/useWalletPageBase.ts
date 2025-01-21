import useWalletPageAPIInit from './useWalletPageAPIInit';
import useWalletPageSwitchTabs from './useWalletPageSwitchTabs';
import useWalletPageLimitStr from './useWalletPageLimitStr';
import useWalletPageHeaderSetting from './useWalletPageHeaderSetting';
import { useEffect } from 'react';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import useWalletPageFooterSetting from '@/ui/hooks/pages/walletPage/useWalletPageFooterSetting';
import { useWalletPageFABSetting } from '@/ui/hooks/pages/walletPage/useWalletPageFABSetting';

export const RECHARGE = 'recharge';
export const AMOUNT = 'amount';
export const PASSWORD = 'password';

export const useWalletPageBase = () => {
  // ==== Style
  // useWalletPageStyle();

  // ==== API Init
  useWalletPageAPIInit();

  // ==== Switch tabs
  useWalletPageSwitchTabs();

  // ==== limitStr
  useWalletPageLimitStr();

  // ==== WalletPage header setting
  useWalletPageHeaderSetting();

  // ==== WalletPage footer setting
  useWalletPageFooterSetting();

  // ==== WalletPage FloatActionButton setting
  useWalletPageFABSetting();

  useEffect(() => {
    return () => {
      useRechargeStore.getState().finishRecharge();
    };
  }, []);
};

export default useWalletPageBase;
