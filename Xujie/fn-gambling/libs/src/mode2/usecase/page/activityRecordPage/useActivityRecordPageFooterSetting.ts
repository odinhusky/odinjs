import { useFooterStore } from '@mode2/zustand/components/footerStore';
import { useEffect } from 'react';

const useActivityRecordPageFooterSetting = () => {
  const setDisplayConfig = useFooterStore((state) => state.setDisplayConfig);
  useEffect(() => {
    setDisplayConfig({
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });
  }, []);
};

export default useActivityRecordPageFooterSetting;
