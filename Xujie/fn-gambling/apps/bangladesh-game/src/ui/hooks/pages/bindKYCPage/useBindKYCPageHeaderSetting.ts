import { useBreakPoint } from '@libs/commonUtils';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useKycDisplayStore } from '@/zustand/kyc/useKycDisplayStore';
import { useEffect } from 'react';

export const useBindKYCPageHeaderSetting = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);
  const headerTitleText = useKycDisplayStore((state) => state.headerTitleText);
  const { isDesktop } = useBreakPoint();

  useEffect(() => {
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
  }, [isDesktop, headerTitleText]);
};

export default useBindKYCPageHeaderSetting;
