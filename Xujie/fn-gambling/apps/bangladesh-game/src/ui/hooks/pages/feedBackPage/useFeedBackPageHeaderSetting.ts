import { useBreakPoint } from '@libs/commonUtils';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';

import { useEffect } from 'react';

export const useFeedBackPageHeaderSetting = () => {
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
        title: { i18nKey: 'help_center_header_help_center' },
      });
    }
  }, [isDesktop]);
};

export default useFeedBackPageHeaderSetting;
