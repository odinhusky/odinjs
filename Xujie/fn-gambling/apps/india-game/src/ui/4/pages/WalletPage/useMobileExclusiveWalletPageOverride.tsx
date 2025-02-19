import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocation } from 'react-router';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import WalletPageMobileHeader from '../WalletPage/components/WalletPageMobileHeader';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { usePostWithdrawOptionsMutation } from '@mode2API/index';
import { useWithdrawStore } from '@/zustand/wallet/useWithdrawStore';
import { useWalletPageWithdrawContentStore } from '@/zustand/page/walletPageStore';

export const useMobileExclusiveWalletPageOverride = () => {
  const thisPath = BasePagePathObj.WalletPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const displayDashboardType = useWalletPageStore(
    (state) => state.displayDashboardType
  );
  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );
  const setWithdrawOptions = useWithdrawStore(
    (state) => state.setWithdrawOptions
  );

  const setWithdrawAmountInputValue = useWalletPageWithdrawContentStore(
    (state) => state.setWithdrawAmountInputValue
  );

  const [postWithdrawOptions, { data, isSuccess }] =
    usePostWithdrawOptionsMutation();
  const withdrawLimit = useWithdrawStore((state) => state.withdrawLimit);

  useEffect(() => {
    if (location.pathname === thisPath) {
      const titleKey =
        displayDashboardType === WalletDashboardType.BALANCE
          ? 'leftnav_wallet'
          : curSwitchContentTabId === WalletPageTabType.DEPOSIT
          ? 'wallet_nav_deposit'
          : 'wallet_nav_withdraw';

      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: titleKey },
        render: () => {
          return <WalletPageMobileHeader />;
        },
      });
    }
  }, [displayDashboardType, curSwitchContentTabId]);

  useEffect(() => {
    if (curSwitchContentTabId === WalletPageTabType.WITHDRAW) {
      postWithdrawOptions();
    }
  }, [curSwitchContentTabId]);

  useEffect(() => {
    if (isSuccess && data) {
      const filterItems = data.optItems.map((item, index) => ({
        ...item,
        isActive: index === 0,
        disabled: item.amount > withdrawLimit.remainingWithdrawLimit,
      }));

      const amount =
        filterItems && filterItems.length > 0 ? filterItems[0].amount : 0;
      setWithdrawAmountInputValue(amount > 0 ? `${amount}` : '');
      setWithdrawOptions(filterItems);
    }
  }, [isSuccess, data, withdrawLimit]);

  useEffect(() => {
    return () => {
      useWalletPageStore
        .getState()
        .setDisplayDashboardType(WalletDashboardType.BALANCE);
    };
  }, []);
};

export default useMobileExclusiveWalletPageOverride;
