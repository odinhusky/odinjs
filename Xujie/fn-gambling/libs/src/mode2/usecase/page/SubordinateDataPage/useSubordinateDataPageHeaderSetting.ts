import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useSubordinateDataPageHeaderSetting = () => {
  const thisPath = BasePagePathObj.SubordinateDataPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'earn_subordinate_data_page_title' },
      });
    }
  }, []);
};
export default useSubordinateDataPageHeaderSetting;
