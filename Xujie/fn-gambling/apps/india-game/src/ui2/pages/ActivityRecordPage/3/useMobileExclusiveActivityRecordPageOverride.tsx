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
      const tabIndexToI18nKeyMap: Record<ActivityRecordPageTypes, string> = {
        [ActivityRecordPageTypes.MISSION_REWARDS_RECORD_CONTENT]:
          'mission_history_page_title',
        [ActivityRecordPageTypes.INVITE_WHEEL_WITHDRAWAL_RECORD_CONTENT]:
          'spin_and_share_wheel_withdrawal_history_page_title',
        [ActivityRecordPageTypes.RECHARGE_WHEEL_REWARDS_RECORD_CONTENT]:
          'deposit_wheel_my_rewards_page_title',
        [ActivityRecordPageTypes.DEFAULT]: '',
      };

      const i18nKey = tabIndexToI18nKeyMap[tabIndex] || '';
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: i18nKey },
      });
    }
  }, [location, tabIndex, store]);
};

export default useMobileExclusiveActivityRecordPageOverride;
