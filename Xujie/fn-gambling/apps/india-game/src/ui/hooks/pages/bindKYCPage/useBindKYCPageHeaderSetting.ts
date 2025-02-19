import { useBreakPoint } from '@libs/commonUtils';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useKycDisplayStore } from '@/zustand/kyc/useKycDisplayStore';
import { useEffect } from 'react';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocation } from 'react-router';

export const useBindKYCPageHeaderSetting = () => {
  const thisPath = BasePagePathObj.BindKYCPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const headerTitleText = useKycDisplayStore((state) => state.headerTitleText);
  const { isDesktop } = useBreakPoint();

  useEffect(() => {
    if (location.pathname === thisPath) {
      if (isDesktop) {
        setConfig({
          type: EHeaderType.Main,
        });
      } else {
        setConfig({
          title: { i18nKey: headerTitleText },
          type: EHeaderType.Common,
        });
      }
    }
  }, [isDesktop, headerTitleText]);
};

export default useBindKYCPageHeaderSetting;
