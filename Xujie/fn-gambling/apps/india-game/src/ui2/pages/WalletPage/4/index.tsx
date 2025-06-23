import RechargeContent from '@components/RechargeContent';
import useWalletPageBase from '@/ui/hooks/pages/walletPage/useWalletPageBase';
import cx from '@commonUtils/cx';
import { useMemo } from 'react';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import WithdrawContent from '@components/WithdrawContent';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import useMobileExclusiveWalletPageOverride from './useMobileExclusiveWalletPageOverride';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import MyWalletBalanceDashboardContent from './components/MyWalletBalanceDashboardContent';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import WalletWeakTipsModal from './modals/WalletWeakTipsModal';
import { useStayTracker } from '@libs/commonUtils/stayTracker/useStayTracker';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';

const WalletPage = () => {
  useWalletPageBase();
  useMobileExclusiveWalletPageOverride();
  const { navToLoginPage } = useNavPageClick();
  // const { checkIsBankFirstBind } = useUserVerifyState();

  const displayDashboardType = useWalletPageStore(
    (state) => state.displayDashboardType
  );

  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );

  useStayTracker({
    page: BasePagePathObj.TeamClubPage,
    tab: curSwitchContentTabId,
  });

  const userRole = useUserProfileStore((state) => state.userRole);

  const component = useMemo(() => {
    if (displayDashboardType === WalletDashboardType.BALANCE) {
      return <MyWalletBalanceDashboardContent />;
    } else {
      switch (curSwitchContentTabId) {
        case WalletPageTabType.DEPOSIT:
          return <RechargeContent />;
        case WalletPageTabType.WITHDRAW: {
          if (userRole === UserRoleType.GUEST) {
            navToLoginPage(78);
          }
          return userRole === UserRoleType.GUEST ? (
            <MyWalletBalanceDashboardContent />
          ) : (
            <WithdrawContent />
          );
        }
      }
    }
  }, [displayDashboardType, curSwitchContentTabId, userRole]);

  return (
    <div className={cx('')}>
      {component}

      <WalletWeakTipsModal />
      {/*<ReminderModal />*/}
    </div>
  );
};
export default WalletPage;
