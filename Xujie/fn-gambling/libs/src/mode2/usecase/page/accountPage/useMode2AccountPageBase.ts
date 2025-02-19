import { getParams } from '@libs/mode2/utils';
import {
  AccountPageTypes,
  useAccountPageStore,
} from '@libs/mode2/zustand/page/accountPageStore';
import { useEffect } from 'react';
import useMode2AccountPageHeaderSetting from './useMode2AccountPageHeaderSetting';
import { useLocation } from 'react-router-dom';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

export const useMode2AccountPageBase = () => {
  const location = useLocation();

  useMode2AccountPageHeaderSetting();

  const id = useUserProfileStore((state) => state.id);
  const nickname = useUserProfileStore((state) => state.nickname);
  const setTabIndex = useAccountPageStore((state) => state.setTabIndex);
  const setNickname = useAccountPageStore((state) => state.setNickname);

  const params = getParams(['tab'], location.search, location.state);

  useEffect(() => {
    setNickname(nickname ? nickname : `Player${id}`);

    console.log('@@===> params', params);

    const { tab } = params;
    if (tab != undefined) {
      setTabIndex(tab as AccountPageTypes);
    }

    return () => {};
  }, []);
};

export default useMode2AccountPageBase;
