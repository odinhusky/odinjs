import { getParams } from '@libs/mode2/utils';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';

import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { RewardsDetailPageRecordHeader } from './components/RewardsDetailPageRecordHeader';
import {
  RewardsDetailPageHeaderTabsTypes,
  useRewardsDetailStore,
} from '@libs/mode2/zustand/page/rewardsDetailStore';

export const useRewardsDetailPageHeaderSettingOverride = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);
  const setHeaderTabIndex = useRewardsDetailStore(
    (state) => state.setHeaderTabIndex
  );
  const location = useLocation();

  const params = getParams(['tab'], location.search, location.state);

  useEffect(() => {
    console.log('@@@===> params', params?.tab);
    const { tab } = params;
    if (tab !== undefined) {
      setHeaderTabIndex(tab as RewardsDetailPageHeaderTabsTypes);
    }
    setConfig({
      type: EHeaderType.Common,
      render: () => {
        return <RewardsDetailPageRecordHeader />;
      },
    });
  }, []);
};

export default useRewardsDetailPageHeaderSettingOverride;
