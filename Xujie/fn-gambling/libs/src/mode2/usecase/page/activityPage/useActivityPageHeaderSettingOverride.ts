import { ActivityPageTabType } from '@libs/mode2/@types/activityPageTabType';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { getParams } from '@libs/mode2/utils';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useActivityPageHeaderSettingOverride = () => {
  const thisPath = BasePagePathObj.ActivityPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const params = getParams(['tab'], location.search, location.state);

  useEffect(() => {
    const { tab } = params;

    if (tab === ActivityPageTabType.VIP && location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'leftnav_vip' },
      });
    }
  }, [params]);
};

export default useActivityPageHeaderSettingOverride;
