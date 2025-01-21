import { useEffect } from 'react';
import { useFooterStore } from '@mode2/zustand/components/footerStore';

export const usePolicyPageFooterSetting = () => {
  const setDisplayConfig = useFooterStore((state) => state.setDisplayConfig);
  useEffect(() => {
    setDisplayConfig({
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });
  }, []);
};
export default usePolicyPageFooterSetting;
