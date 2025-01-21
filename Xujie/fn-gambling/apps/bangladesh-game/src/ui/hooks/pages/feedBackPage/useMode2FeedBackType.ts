import { useMode2FeedBackPageTabStore } from '@mode2/zustand/page/feedbackPageStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useMode2FeedBackType = () => {
  const location = useLocation();
  const givenTabId = location.state ? location.state?.tab : 1;

  const setActiveTabId = useMode2FeedBackPageTabStore(
    (state) => state.setActiveTabId
  );

  useEffect(() => {
    if (givenTabId) setActiveTabId(givenTabId);
  }, [givenTabId]);
};

export default useMode2FeedBackType;
