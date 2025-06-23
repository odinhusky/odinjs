import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useMode2VipBonusPageHeaderSetting = () => {
  const thisPath = BasePagePathObj.VipBonusPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'activity_VIP_my_bonus' },
      });
    }
  }, [location]);
};

export default useMode2VipBonusPageHeaderSetting;
