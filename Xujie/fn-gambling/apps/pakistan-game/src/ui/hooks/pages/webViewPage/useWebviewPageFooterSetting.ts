import { useEffect } from 'react';
import { useFooterStore } from '@mode2/zustand/components/footerStore';

export const useWebviewPageFooterSetting = () => {
  const setDisplayConfig = useFooterStore((state) => state.setDisplayConfig);
  useEffect(() => {
    setDisplayConfig({
      isDesktop: false,
      isTablet: false,
      isMobile: false,
    });
  }, []);
};
export default useWebviewPageFooterSetting;
