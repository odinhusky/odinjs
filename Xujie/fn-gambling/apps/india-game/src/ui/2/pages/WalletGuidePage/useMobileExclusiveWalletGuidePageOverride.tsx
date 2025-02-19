import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocation } from 'react-router';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import { useEffect } from 'react';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';
import { useWalletGuidePageStore } from '@mode2/zustand/page/WalletGuidePage/useWalletGuidePageStore';
import { WalletGuideTutorialsType } from '@mode2/@types/walletGuideTutorialsType';

export const useMobileExclusiveWalletGuidePageOverride = () => {
  const thisPath = BasePagePathObj.WalletGuidePage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);

  // TODO i18n
  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'How to use?' },
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      useWalletGuidePageStore
        .getState()
        .setTutorialsTab(WalletGuideTutorialsType.VIDEO);
      useWalletPageStore
        .getState()
        .setDisplayDashboardType(WalletDashboardType.NONE);
    };
  }, []);
};

export default useMobileExclusiveWalletGuidePageOverride;
