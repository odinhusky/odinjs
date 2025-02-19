import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useActivityRulePageHeaterSetting = () => {
  const thisPath = BasePagePathObj.ActivityRulePage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (location.pathname === thisPath)
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'earn_invite_rewards_rules_page_title' },
      });
  }, []);
};
