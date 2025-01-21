import { useNavigate } from 'react-router-dom';
import { NavigateOptions } from 'react-router/dist/lib/context';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { KYC_BOTH_STATE } from '@constant/KYC';
import { useMode2FeedBackPageTabStore } from '@mode2/zustand/page/feedbackPageStore';
import { feedBackPageTabIdObj } from '@mode2/@types/feedBackPageTab';
import sdkUtils from '@mode2/utils/sdk';

// NOTE Evan KYC 解決差異化驗證問題
export const useNavigateInterceptor = () => {
  const navigate = useNavigate();
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
      navigate(BasePagePathObj.BindKYCPage, {
        state: { tab: KYC_BOTH_STATE },
      });
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
