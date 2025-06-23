import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { useMode2TeamClubPageStore } from '@mode2/zustand/page/teamClubPageStore';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useRouterPenddingDataStore } from '@libs/mode2/zustand/routerPenddingDataStore';

export const useTeamClubPageInit = () => {
  const location = useLocation();
  const setCurTab = useMode2TeamClubPageStore((state) => state.setCurTab);

  const penddingData = useRouterPenddingDataStore(
    (state) => state.penddingData
  ).get(BasePagePathObj.TeamClubPage);

  console.log('[router] tab', penddingData);

  useEffect(() => {
    const teamClubTab = location.state?.tab;
    if (teamClubTab && !penddingData?.tab) {
      setCurTab(teamClubTab);
    }
  }, [location.pathname, location.state, penddingData]);

  useEffect(() => {}, []);
};
