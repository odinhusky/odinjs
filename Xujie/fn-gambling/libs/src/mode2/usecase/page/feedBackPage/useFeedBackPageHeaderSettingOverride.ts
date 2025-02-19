import { feedBackPageTabIdObj } from '@libs/mode2/@types/feedBackPageTab';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { getParams } from '@libs/mode2/utils';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useMode2FeedBackPageTabStore } from '@libs/mode2/zustand/page/feedbackPageStore';

import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useFeedBackPageHeaderSettingOverride = () => {
  const thisPath = BasePagePathObj.FeedBackPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const setActiveTabId = useMode2FeedBackPageTabStore(
    (state) => state.setActiveTabId
  );

  const params = getParams(['tab'], location.search, location.state);

  useEffect(() => {
    console.log('@@===> params', params);

    const tabData: { [key: string]: string } = {
      [feedBackPageTabIdObj.INBOX]: 'Mail',
      [feedBackPageTabIdObj.FAQ]: '',
    };

    // Mail ｜ FAQ
    const { tab } = params;
    if (tab !== undefined && location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: tabData[tab || feedBackPageTabIdObj.INBOX] },
      });
      setActiveTabId(Number(tab));
    }
  }, [params]);
};

export default useFeedBackPageHeaderSettingOverride;
