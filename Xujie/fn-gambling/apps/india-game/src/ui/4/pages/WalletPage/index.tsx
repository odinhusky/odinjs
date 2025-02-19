import RechargeContent from '@components/RechargeContent';
import useWalletPageBase from '@/ui/hooks/pages/walletPage/useWalletPageBase';
import cx from '@commonUtils/cx';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import { useEffect, useMemo } from 'react';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { KYC_BOTH_STATE } from '@constant/KYC';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { useUserVerifyState } from '@/usecase/useUserVerifyState';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import WithdrawContent from '@components/WithdrawContent';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import useMobileExclusiveWalletPageOverride from '../WalletPage/useMobileExclusiveWalletPageOverride';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import MyWalletBalanceDashboardContent from '../WalletPage/components/MyWalletBalanceDashboardContent';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';
import { useReminderModalStore } from '@mode2/zustand/components/reminderModalStore';

const WalletPage = () => {
  useWalletPageBase();
  useMobileExclusiveWalletPageOverride();
  const { navToBindKYCPage } = useNavPageClick();
  const { checkIsBankFirstBind } = useUserVerifyState();

  const displayDashboardType = useWalletPageStore(
    (state) => state.displayDashboardType
  );

  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );
  const userRole = useUserProfileStore((state) => state.userRole);

  const rechargeStatus = useRechargeStore((state) => state.rechargeStatus);
  const setShowReminderModal = useReminderModalStore(
    (state) => state.setShowReminderModal
  );
  useEffect(() => {
    setShowReminderModal(true);
    if (
      curSwitchContentTabId === WalletPageTabType.WITHDRAW &&
      checkIsBankFirstBind()
    ) {
      navToBindKYCPage('', {
        state: { tab: KYC_BOTH_STATE, from: BasePagePathObj.WalletPage },
      });
    }
  }, [curSwitchContentTabId, userRole]);

  const component = useMemo(() => {
    if (displayDashboardType === WalletDashboardType.BALANCE) {
      return <MyWalletBalanceDashboardContent />;
    } else {
      switch (curSwitchContentTabId) {
        case WalletPageTabType.DEPOSIT:
          return <RechargeContent />;
        case WalletPageTabType.WITHDRAW:
          return <WithdrawContent />;
      }
    }
  }, [displayDashboardType, curSwitchContentTabId]);

  return (
    <div className={cx('')}>
      {component}
      {/*<ReminderModal />*/}
    </div>
  );
};
export default WalletPage;
