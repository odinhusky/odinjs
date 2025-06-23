import { getParams } from '@libs/mode2/utils';
import {
  useHeaderStore,
  EHeaderType,
} from '@libs/mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useMode2AccountPageHeaderSetting = () => {
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);

  const params = getParams(['tab'], location.search, location.state);

  useEffect(() => {
    console.log('@@===> params', params);
    // const tabData: { [key: string]: string } = {
    //   [AccountPageTypes.MYINFO]: 'My info',
    //   [AccountPageTypes.AVATAR]: 'Choose the avatar you like',
    // };

    // 个人资料 ｜ 头像修改
    const { tab } = params;
    if (tab !== undefined) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'profile_my_info_page_title' },
      });
    }
  }, [params]);
};

export default useMode2AccountPageHeaderSetting;
