import { useEffect } from 'react';
import useModa2OrderDetailPageBaseInit from './useModa2OrderDetailPageBaseInit';
import { useModa2OrderDetailPageHeaderSetting } from './useMode2OrderDetailPageHeaderSetting';
import { useMode2OrderDetailPageStore } from '@libs/mode2/zustand/page/orderDetailPageStore';

export const useModa2OrderDetailPageBase = () => {
  useModa2OrderDetailPageHeaderSetting();
  useModa2OrderDetailPageBaseInit();

  const setOrderDetailList = useMode2OrderDetailPageStore(
    (state) => state.setOrderDetailList
  );
  const setOrderDetailTabIndex = useMode2OrderDetailPageStore(
    (state) => state.setOrderDetailTabIndex
  );

  useEffect(() => {
    setOrderDetailTabIndex(1);
    setOrderDetailList([]);
  }, []);
};

export default useModa2OrderDetailPageBase;
