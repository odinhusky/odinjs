import { useEffect } from 'react';
import { useFooterStore } from '@mode2/zustand/components/footerStore';

export const useHallPageFooterSetting = () => {
  const setDisplayConfig = useFooterStore((state) => state.setDisplayConfig);
  useEffect(() => {
    setDisplayConfig({
      isDesktop: true,
      isTablet: true,
      isMobile: true,
    });
  }, []);
};
