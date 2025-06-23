import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useLocationStore } from '@mode2/zustand/locationStore';
import {
  ActivityRulesContentTypes,
  useActivityRulesPageStore,
} from '@mode2/zustand/page/activityRulesPageStore';

export const useMobileActivityRulePageOverride = () => {
  const contentTabIndex = useActivityRulesPageStore(
    (state) => state.contentTabIndex
  );

  const setConfig = useHeaderStore((state) => state.setConfig);
  // const config = useHeaderStore((state) => state.config);

  const thisPath = BasePagePathObj.ActivityRulePage;
  const location = useLocationStore((state) => state.location);

  useEffect(() => {
    if (location?.pathname !== thisPath) {
      return;
    }

    switch (contentTabIndex) {
      case ActivityRulesContentTypes.MONTH_RULES_CONTENT: // 團隊俱樂部
      case ActivityRulesContentTypes.RULES_CONTENT: // 團隊俱樂部
        setConfig({
          type: EHeaderType.Common,
          title: { i18nKey: 'earn_invite_rewards_rules_page_title' },
          templateBgColor: 'var(--background-dark)',
        });
        break;
      case ActivityRulesContentTypes.RED_ENVELOPE_RAIN_RULES_CONTENT: // 紅包雨規則
        setConfig({
          type: EHeaderType.Common,
          title: { i18nKey: 'red_packets_rain_state_default' },
          templateBgColor: 'var(--background-dark)',
        });
        break;
      default:
        setConfig({
          type: EHeaderType.Common,
          title: { i18nKey: 'earn_invite_rewards_rules_page_title' },
          templateBgColor: 'var(--background-middle)',
        });
        break;
    }
  }, [contentTabIndex, location]);
};

export default useMobileActivityRulePageOverride;
