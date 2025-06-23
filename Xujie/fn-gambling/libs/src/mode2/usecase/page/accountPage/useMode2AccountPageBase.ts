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

  const setTabIndex = useAccountPageStore((state) => state.setTabIndex);

  const displayUserName = useUserProfileStore((state) => state.displayUserName);
  const realPhone = useUserProfileStore((state) => state.realPhone);
  const setNickname = useAccountPageStore((state) => state.setNickname);
  const loginForm = useAccountPageStore((state) => state.loginForm);
  const setLoginForm = useAccountPageStore((state) => state.setLoginForm);

  const params = getParams(['tab'], location.search, location.state);

  useEffect(() => {
    const { tab } = params;
    if (tab != undefined) {
      setTabIndex(tab as AccountPageTypes);
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (displayUserName) {
      setNickname(displayUserName);
    }

    if (realPhone) {
      setLoginForm({ ...loginForm, phone: realPhone });
    }

    console.log('@@===> params', params, realPhone);

    return () => {};
  }, [displayUserName, realPhone]);
};

export default useMode2AccountPageBase;
