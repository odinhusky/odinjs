import { getParams } from '@libs/mode2/utils';
import useMode2SettingPageHeaderSetting from './useMode2SettingPageHeaderSetting';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  SettingPageTypes,
  useSettingPageStore,
} from '@libs/mode2/zustand/page/settingPageStore';

export const useMode2SettingPageBase = () => {
  const location = useLocation();

  // header setting
  useMode2SettingPageHeaderSetting();

  const setTabIndex = useSettingPageStore((state) => state.setTabIndex);

  const params = getParams(['tab'], location.search, location.state);

  useEffect(() => {
    console.log('@@===> params', params);
    const { tab } = params;
    if (tab != undefined) {
      setTabIndex(tab as SettingPageTypes);
    }
  }, []);
};

export default useMode2SettingPageBase;
