import { useMode2InviteTabStore } from '@mode2/zustand/page/invitePageStore';
import { useEffect } from 'react';
import { InvitePageTabType } from '@mode2/@types/invitePageTabTyp';
import { useLocation } from 'react-router';

export const useMode2InvitePageInit = () => {
  const location = useLocation();

  const itInviteCurTab = location.state?.tab
    ? location.state?.tab
    : InvitePageTabType.STATISTICS;

  const setInviteCurTab = useMode2InviteTabStore(
    (state) => state.setInviteCurTab
  );
  useEffect(() => {
    setInviteCurTab(itInviteCurTab);
    return () => {
      setInviteCurTab(InvitePageTabType.STATISTICS);
    };
  }, [itInviteCurTab]);
};

export default useMode2InvitePageInit;
