import { useFooterStore } from '@mode2/zustand/components/footerStore';
import { useEffect } from 'react';

export const useFullOrderDetailPageFooterSetting = () => {
  const setDisplayConfig = useFooterStore((state) => state.setDisplayConfig);
  useEffect(() => {
    setDisplayConfig({
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });
  }, []);
};
