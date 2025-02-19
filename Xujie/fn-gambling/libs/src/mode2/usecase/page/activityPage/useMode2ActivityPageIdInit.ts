import { useMode2ActivitySwitchPageStore } from '@libs/mode2/zustand/page/activityPageStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import { getParams } from '@libs/mode2/utils';

export const useMode2ActivityPageIdInit = () => {
  const location = useLocation();

  const setPageIdx = useMode2ActivitySwitchPageStore(
    (state) => state.setPageIdx
  );

  const params = getParams(['tab'], location.search, location.state);

  useEffect(() => {
    const { tab } = params;
    if (tab !== undefined) {
      setPageIdx(tab as ActivityPageTabType);
    }
  }, [params]);
};

export default useMode2ActivityPageIdInit;
