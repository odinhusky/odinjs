import { getParams } from '@libs/mode2/utils';
import {
  useHeaderStore,
  EHeaderType,
} from '@libs/mode2/zustand/components/headerStore';
import { SettingPageTypes } from '@libs/mode2/zustand/page/settingPageStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useMode2SettingPageHeaderSetting = () => {
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);

  const params = getParams(['tab'], location.search, location.state);

  useEffect(() => {
    // 音乐设定 ｜ 关于我们（社群列表）
    const tabData: { [key: string]: string } = {
      [SettingPageTypes.MUSIC_SETTING]: 'setting',
      [SettingPageTypes.SOCIALLIST]: 'About us',
    };
    const { tab } = params;

    if (tab !== undefined) {
      console.log('@@===> params', params, tabData[tab]);
      setConfig({
        type: EHeaderType.Common,
        title: {
          i18nKey: tabData[tab],
        },
      });
    }
  }, [params]);
};

export default useMode2SettingPageHeaderSetting;
