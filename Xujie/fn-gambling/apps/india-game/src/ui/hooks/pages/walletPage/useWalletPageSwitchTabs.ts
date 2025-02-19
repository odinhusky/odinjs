import { useEffect } from 'react';

import {
  useWalletPageSwitchTabsActionsStore,
  useWalletPageSwitchTabsStore,
  WalletPageSwitchTabUnit,
} from '@/zustand/page/walletPageStore';

import { useLocation } from 'react-router';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { useUserVerifyState } from '@/usecase/useUserVerifyState';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';
import { handleWalletPageSwitchTabClick } from '@mode2/action/walletPageAction/acitonType';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { UserRoleType } from '@mode2/@types/userRoleTypes';

export const useWalletPageSwitchTabs = () => {
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();
  const { checkIsBankFirstBind } = useUserVerifyState();
  const setWalletSwitchTabList = useWalletPageSwitchTabsStore(
    (state) => state.setWalletSwitchTabList
  );

  const setWalletSwitchTabListAcions = useWalletPageSwitchTabsActionsStore(
    (state) => state.setWalletSwitchTabListAcions
  );

  const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.setCurSwitchContentTabId
  );

  const location = useLocation();

  // $ Tab Id init
  useEffect(() => {
    if (location.state?.tab) {
      if (
        location.state?.tab === WalletPageTabType.WITHDRAW &&
        useUserProfileStore.getState().userRole === UserRoleType.PLAYER
      ) {
        /* empty */
      } else {
        setCurSwitchContentTabId(location.state.tab);
      }
    }
  }, [location.state]);

  // $ Switch Tab List Init
  useEffect(() => {
    const tabList: WalletPageSwitchTabUnit[] = [
      {
        id: WalletPageTabType.DEPOSIT,
        url: 'ic_deposit',
        urlActive: 'ic_deposit',
        label: { i18nKey: 'wallet_nav_deposit' },
      },
      {
        id: WalletPageTabType.WITHDRAW,
        url: 'ic_withdraw',
        urlActive: 'ic_withdraw',
        label: { i18nKey: 'wallet_nav_withdraw' },
      },
    ];
    const tabListActions = tabList.map((item) => () => {
      handleWalletPageBaseClick({
        actionName: handleWalletPageSwitchTabClick,
        payload: { id: item.id },
      });
    });

    setWalletSwitchTabList(tabList);
    setWalletSwitchTabListAcions(tabListActions);

    // isBankFirstBind 離開恢復預設
    return () => {
      if (checkIsBankFirstBind()) {
        setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
      }
    };
  }, []);
};

export default useWalletPageSwitchTabs;
