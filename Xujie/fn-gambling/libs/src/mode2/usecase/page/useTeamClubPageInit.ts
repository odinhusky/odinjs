import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { useMode2TeamClubPageStore } from '@mode2/zustand/page/teamClubPageStore';

export const useTeamClubPageInit = () => {
  const location = useLocation();
  const setCurTab = useMode2TeamClubPageStore((state) => state.setCurTab);

  useEffect(() => {
    const teamClubTab = location.state?.tab;
    if (teamClubTab) {
      setCurTab(teamClubTab);
    }
  }, [location.pathname, location.state]);

  useEffect(() => {}, []);
};
