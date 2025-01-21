import { useBreakPoint } from '@libs/commonUtils';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';

export const useChangePasswordPageHeaderSetting = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);
  const { isDesktop } = useBreakPoint();

  useEffect(() => {
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
  }, [isDesktop]);
};

export default useChangePasswordPageHeaderSetting;
