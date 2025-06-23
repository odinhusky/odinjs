import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import RankingPageHeader from './components/RankingPageHeader';
import { useLocation } from 'react-router';

export const useRankingPageBaseOverride = () => {
  const location = useLocation();
  const thisPath = BasePagePathObj.RankingPage;
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Empty,
        render: () => {
          return <RankingPageHeader />;
        },
      });
    }
  }, [location.pathname]);
};

export default useRankingPageBaseOverride;
