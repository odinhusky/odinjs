
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';

export const useSubordinateDataPageHeaderSetting = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    setConfig({
      type: EHeaderType.Common,
      title: { i18nKey: 'earn_subordinate_data_page_title' },
    });
  }, []);
};
export default useSubordinateDataPageHeaderSetting;
