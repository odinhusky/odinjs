import { useEffect } from 'react';
import useModa2OrderDetailPageBaseInit from './useModa2OrderDetailPageBaseInit';
import { useModa2OrderDetailPageHeaderSetting } from './useMode2OrderDetailPageHeaderSetting';
import {
  TOrderDetailTabUnitValue,
  useMode2OrderDetailPageStore,
} from '@libs/mode2/zustand/page/orderDetailPageStore';
import { useWalletPageSwitchContentTabsStore } from '@libs/mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { useStayTracker } from '@libs/commonUtils/stayTracker/useStayTracker';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useRouterPenddingDataStore } from '@libs/mode2/zustand/routerPenddingDataStore';
import { useLocation } from 'react-router-dom';

export const useModa2OrderDetailPageBase = () => {
  const location = useLocation();
  useModa2OrderDetailPageHeaderSetting();
  useModa2OrderDetailPageBaseInit();

  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );

  useStayTracker({
    page: BasePagePathObj.TeamClubPage,
    tab: curSwitchContentTabId,
  });

  const setOrderListTabIndex = useMode2OrderDetailPageStore(
    (state) => state.setOrderListTabIndex
  );

  const penddingData = useRouterPenddingDataStore(
    (state) => state.penddingData
  ).get(BasePagePathObj.OrderDetailPage);

  useEffect(() => {
    if (penddingData?.tab) {
      setOrderListTabIndex(+penddingData.tab as TOrderDetailTabUnitValue);
    }
  }, [location.pathname, location.state, penddingData]);
};

export default useModa2OrderDetailPageBase;
