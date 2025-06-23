import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useLoginPageHeaderSettingOverride = () => {
  const thisPath = BasePagePathObj.LoginPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        headerBgColor: 'transparent',
      });
    }
  }, []);
};

export default useLoginPageHeaderSettingOverride;
