import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { getParams } from '@libs/mode2/utils';
import {
  useHeaderStore,
  EHeaderType,
} from '@libs/mode2/zustand/components/headerStore';
import {
  EOrderDetailPageType,
  IOrderDetailTabUnit,
  useMode2OrderDetailPageStore,
} from '@libs/mode2/zustand/page/orderDetailPageStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useModa2OrderDetailPageHeaderSetting = () => {
  const thisPath = BasePagePathObj.OrderDetailPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const setOrderDetailPageType = useMode2OrderDetailPageStore(
    (state) => state.setOrderDetailPageType
  );
  const setOrderDetailTabList = useMode2OrderDetailPageStore(
    (state) => state.setOrderDetailTabList
  );

  const params = getParams(['tab'], location.search, location.state);

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
    console.log('@@===> params', params);

    // 充值紀錄 ｜ 提現紀錄
    const { tab } = params;
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'History' },
      });
      setOrderDetailPageType(
        (tab as EOrderDetailPageType) || EOrderDetailPageType.RECHARGE
      );
    }
  }, [params]);

  useEffect(() => {
    setOrderDetailTabList(tabList);
  }, []);
};
