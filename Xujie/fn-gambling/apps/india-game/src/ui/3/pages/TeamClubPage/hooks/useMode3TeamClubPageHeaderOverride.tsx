import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import TeamClubPageTabList from '../components/TeamClubPageTabList';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocation } from 'react-router';

export const useMode3TeamClubPageHeaderOverride = () => {
  const thisPath = BasePagePathObj.TeamClubPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Empty,
        render: () => {
          return <TeamClubPageTabList />;
        },
      });
    }
  }, []);
};

export default useMode3TeamClubPageHeaderOverride;
