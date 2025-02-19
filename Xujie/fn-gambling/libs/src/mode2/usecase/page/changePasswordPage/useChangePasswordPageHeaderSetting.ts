import { useBreakPoint } from '@libs/commonUtils';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useChangePasswordPageHeaderSetting = () => {
  const thisPath = BasePagePathObj.ChangePasswordPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const { isDesktop } = useBreakPoint();

  useEffect(() => {
    if (location.pathname === thisPath) {
      if (isDesktop) {
        setConfig({
          type: EHeaderType.Main,
        });
      } else {
        setConfig({
          type: EHeaderType.Common,
          title: { i18nKey: 'account_menu_change_password' },
        });
      }
    }
  }, [isDesktop]);
};

export default useChangePasswordPageHeaderSetting;
