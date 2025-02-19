import { BasePagePathObj } from '@mode2/routerTypes/types';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { useLocationStore } from '@mode2/zustand/locationStore';
import {
  ActivityRecordPageTypes,
  useActivityRecordPageStore,
} from '@mode2/zustand/page/activityRecordPageStore';
import { useDeviceStore } from '@mode2/zustand/deviceStore';

export const useMobileExclusiveActivityRecordPageOverride = () => {
  const thisPath = BasePagePathObj.ActivityRecordPage;
  const location = useLocationStore((state) => state.location);
  const setConfig = useHeaderStore((state) => state.setConfig);
  const tabIndex = useActivityRecordPageStore((state) => state.tabIndex);
  const store = useDeviceStore();
  useEffect(() => {
    if (location?.pathname === thisPath) {
      const i18nKey =
        tabIndex ===
        ActivityRecordPageTypes.INVITE_WHEEL_WITHDRAWAL_RECORD_CONTENT
          ? 'earn_rewards_detail_withdrawal_history'
          : 'deposit_wheel_my_rewards_page_title';
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: i18nKey },
      });
    }
  }, [location, tabIndex, store]);
};

export default useMobileExclusiveActivityRecordPageOverride;
