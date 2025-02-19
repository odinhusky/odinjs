import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';

export const useGiftCodeRedeemPageHeaderSetting = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    setConfig({
      type: EHeaderType.Common,
      title: { i18nKey: 'gift_code_page_title' },
    });
  }, []);
};

export default useGiftCodeRedeemPageHeaderSetting;
