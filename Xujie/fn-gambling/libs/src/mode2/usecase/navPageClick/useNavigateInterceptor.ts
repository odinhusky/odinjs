import { NavigateOptions } from 'react-router/dist/lib/context';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { useMode2FeedBackPageTabStore } from '@mode2/zustand/page/feedbackPageStore';
import { feedBackPageTabIdObj } from '@mode2/@types/feedBackPageTab';
import sdkUtils from '@mode2/utils/sdk';

// NOTE Evan KYC 解決差異化驗證問題
export const useNavigateInterceptor = () => {
  const toWalletPageWithdrawTab = (options?: NavigateOptions) => {
    const curSwitchContentTabId =
      useWalletPageSwitchContentTabsStore.getState().curSwitchContentTabId;
    const isBankFirstBind = useUserProfileStore.getState().isBankFirstBind;
    if (
      (options?.state?.tab === WalletPageTabType.WITHDRAW ||
        curSwitchContentTabId === WalletPageTabType.WITHDRAW) &&
      typeof isBankFirstBind === 'boolean' &&
      isBankFirstBind
    ) {
      return false;
    } else {
      return true;
    }
  };

  const toFeedBackPageInBoxTab = (options?: NavigateOptions) => {
    const activeTabId = useMode2FeedBackPageTabStore.getState().activeTabId;
    if (
      (options?.state?.tab === feedBackPageTabIdObj.INBOX ||
        activeTabId === feedBackPageTabIdObj.INBOX) &&
      !sdkUtils.isCurrentLogin()
    ) {
      return false;
    } else {
      return true;
    }
  };

  return {
    toWalletPageWithdrawTab,
    toFeedBackPageInBoxTab,
  };
};

export default useNavigateInterceptor;
