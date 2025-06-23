import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocation } from 'react-router';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import WalletPageMobileHeader from './components/WalletPageMobileHeader';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { usePostWithdrawOptionsMutation } from '@mode2API/index';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';
import isEmpty from 'lodash/isEmpty';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import useDepositJackpotWheelModalStore from '@mode2/zustand/modal/DepositJackpotWheelModal';

/**
 * Evan for [V6]  WalletPage控制
 */
export const useMobileExclusiveWalletPageOverride = () => {
  const thisPath = BasePagePathObj.WalletPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const displayDashboardType = useWalletPageStore(
    (state) => state.displayDashboardType
  );

  // const userRole = useUserProfileStore((state) => state.userRole);

  const [postWithdrawOptions, { data, isSuccess }] =
    usePostWithdrawOptionsMutation();

  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );
  const setWithdrawOptions = useWithdrawStore(
    (state) => state.setWithdrawOptions
  );
  const withdrawTotalBalance = useWithdrawStore(
    (state) => state.withdrawTotalBalance
  );

  const setWithdrawAmountSelected = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawAmountSelected
  );

  const setCurrentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.setCurrentRechargeCard
  );

  // 2X Deposit Bonus
  useEffect(() => {
    if (location.pathname === thisPath) {
      // Evan [V6] 不分新老客，預設都勾選 Bonus
      setCurrentRechargeCard(RechargeCard.TOP_UP_BONUS);

      const limitedEndTime =
        useDepositJackpotWheelModalStore.getState()
          .doubleBuffRechargeBonusLimitedEndTime;
      const titleKey =
        displayDashboardType === WalletDashboardType.BALANCE
          ? 'leftnav_wallet'
          : curSwitchContentTabId === WalletPageTabType.WITHDRAW
          ? 'withdrawal_page_title'
          : limitedEndTime > 0
          ? '2X Deposit Bonus'
          : 'wallet_nav_deposit';

      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: titleKey },
        render: () => {
          return <WalletPageMobileHeader />;
        },
      });
    }
  }, [displayDashboardType, curSwitchContentTabId]);

  // 重新引導行為
  // useEffect(() => {
  //   if (displayDashboardType !== WalletDashboardType.NONE) {
  //     return;
  //   }
  //   switch (userRole) {
  //     case UserRoleType.NONE:
  //       break;
  //     case UserRoleType.GUEST:
  //       break;
  //     case UserRoleType.PLAYER:
  //       // {
  //       //   if (curSwitchContentTabId === WalletPageTabType.WITHDRAW) {
  //       //     setShowBindPlayerPhoneModal(true);
  //       //     setDisplayDashboardType(WalletDashboardType.BALANCE);
  //       //   }
  //       // }
  //       break;
  //     case UserRoleType.USER:
  //       break;
  //   }
  // }, [userRole, curSwitchContentTabId, displayDashboardType]);

  useEffect(() => {
    if (curSwitchContentTabId === WalletPageTabType.WITHDRAW) {
      postWithdrawOptions();
    }
  }, [curSwitchContentTabId]);

  useEffect(() => {
    if (isSuccess && data) {
      // 防呆處理 ，data.optItems isEmpty 給預設 200
      const filterItems = isEmpty(data.optItems)
        ? [
            {
              isActive: true,
              disabled: false,
              index: 0,
              amount: 0,
              fee: 0,
            },
          ]
        : data.optItems.map((item, index) => ({
            ...item,
            isActive: index === 0,
            disabled: false,
          }));

      setWithdrawAmountSelected(filterItems[0]);

      setWithdrawOptions(filterItems);
    }
  }, [isSuccess, data, withdrawTotalBalance]);

  useEffect(() => {
    return () => {
      // useWalletPageStore
      //   .getState()
      //   .setDisplayDashboardType(WalletDashboardType.BALANCE);
    };
  }, []);
};

export default useMobileExclusiveWalletPageOverride;
