import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';

export const useActivityRulePageHeaterSetting = () => {
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    setConfig({
      type: EHeaderType.Common,
      title: { i18nKey: 'earn_invite_rewards_rules_page_title' },
    });
  }, []);
};
