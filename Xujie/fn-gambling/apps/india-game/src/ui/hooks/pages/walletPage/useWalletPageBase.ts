import useWalletPageAPIInit from './useWalletPageAPIInit';
import useWalletPageSwitchTabs from './useWalletPageSwitchTabs';
import useWalletPageLimitStr from './useWalletPageLimitStr';
import useWalletPageHeaderSetting from './useWalletPageHeaderSetting';
import { useEffect } from 'react';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import useWalletPageFooterSetting from '@/ui/hooks/pages/walletPage/useWalletPageFooterSetting';
import { useWalletPageFABSetting } from '@/ui/hooks/pages/walletPage/useWalletPageFABSetting';
import { useUserState } from '@/usecase/useUserState';

export const RECHARGE = 'recharge';
export const AMOUNT = 'amount';
export const PASSWORD = 'password';

export const useWalletPageBase = () => {
  // ==== Style
  // useWalletPageStyle();

  const { refreshUserState } = useUserState();
  // Evan 進入錢包頁面先刷新 user 資料，避免當賢頁面重新整理導致KYC狀態錯誤
  useEffect(() => {
    refreshUserState();
  }, []);

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
