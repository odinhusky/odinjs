import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { useActivityRulesPageStore } from '@mode2/zustand/page/activityRulesPageStore';

export const useActivityRulePageInit = () => {
  const location = useLocation();
  const setContentTabIndex = useActivityRulesPageStore(
    (state) => state.setContentTabIndex
  );

  useEffect(() => {
    const { tab } = location.state || {};
    setContentTabIndex(tab);
    return () => {
      setContentTabIndex(null);
    };
  }, [location]);
};

export default useActivityRulePageInit;
