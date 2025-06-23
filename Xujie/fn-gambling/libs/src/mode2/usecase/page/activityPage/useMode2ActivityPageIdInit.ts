import { useMode2ActivitySwitchPageStore } from '@libs/mode2/zustand/page/activityPageStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';

export const useMode2ActivityPageIdInit = () => {
  // 除[IN][V6]之外的版本都需要初始化pageId，有Tab區分活動大廳和VIP頁面
  const location = useLocation();

  const givenPageId = location.state?.tab
    ? location.state?.tab
    : ActivityPageTabType.ACTIVITY;
  const setPageIdx = useMode2ActivitySwitchPageStore(
    (state) => state.setPageIdx
  );

  useEffect(() => {
    setPageIdx(givenPageId);
  }, [givenPageId]);
};

export default useMode2ActivityPageIdInit;
