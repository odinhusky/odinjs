import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import {
  useHeaderStore,
  EHeaderType,
} from '@libs/mode2/zustand/components/headerStore';
import {
  IOrderDetailTabUnit,
  useMode2OrderDetailPageStore,
} from '@libs/mode2/zustand/page/orderDetailPageStore';
import { useRouterPenddingDataStore } from '@libs/mode2/zustand/routerPenddingDataStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

export const useModa2OrderDetailPageHeaderSetting = () => {
  const thisPath = BasePagePathObj.OrderDetailPage;
  const location = useLocation();
  const navigate = useNavigateClick();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const setOrderListTabList = useMode2OrderDetailPageStore(
    (state) => state.setOrderListTabList
  );
  const clearAllPaths = useRouterPenddingDataStore(
    (state) => state.clearAllPaths
  );
  const setOrderListTabIndex = useMode2OrderDetailPageStore(
    (state) => state.setOrderListTabIndex
  );

  const tabList: IOrderDetailTabUnit[] = [
    {
      label: '1 Day',
      value: 1,
    },
    {
      label: '7 Days',
      value: 7,
    },
    {
      label: '30 Days',
      value: 30,
    },
  ];

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'History' },
        onBack: () => {
          navigate(-1);
          clearAllPaths();
          setOrderListTabIndex(1);
        },
      });
    }
  }, []);

  useEffect(() => {
    setOrderListTabList(tabList);
  }, []);
};
