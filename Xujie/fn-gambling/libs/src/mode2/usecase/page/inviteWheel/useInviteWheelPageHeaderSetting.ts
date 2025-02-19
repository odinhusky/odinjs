import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

const useInviteWheelPageHeaderSetting = () => {
  const thisPath = BasePagePathObj.InviteWheelPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Main,
      });
    }
  }, []);
};

export default useInviteWheelPageHeaderSetting;
