
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';

const useSharePageHeaderSetting = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    setConfig({
      type: EHeaderType.Common,
      title: { i18nKey: 'earn_share_page_title' },
    });
  }, []);
};
export default useSharePageHeaderSetting;
