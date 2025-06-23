import useFeedBackPageHeaderSetting from './useFeedBackPageHeaderSetting';
import useMode2FeedBackPageInBoxData from './useMode2FeedBackPageInBoxData';
import useMode2FeedBackPageFAQList from './useMode2FeedBackPageFAQList';
import useMode2FeedBackPageTabList from './useMode2FeedBackPageTabList';
import useMode2FeedBackType from './useMode2FeedBackType';
import useFeedBackPageFooterSetting from './useFeedBackPageFooterSetting';
import { useMode2PageResetFloatActionButton } from '../useMode2PageResetFloatActionButton';
import { useEffect } from 'react';
import { useInboxMessageStore } from '@mode2/zustand/user/inboxMessageStore';

export const useFeedBackPageBase = () => {
  // ==== FeedBack 頁 Tab List
  useMode2FeedBackPageTabList();

  // ==== FeedBack 頁 FAQ List
  useMode2FeedBackPageFAQList();

  // ==== 處理進來的時候是否有帶參數
  useMode2FeedBackType();

  // === FeedBackPage Header Setting
  useFeedBackPageHeaderSetting();

  // === FeedBackPage InBox 取得資料的 API
  useMode2FeedBackPageInBoxData();

  // === FeedBackPage Footer Setting
  useFeedBackPageFooterSetting();

  // === Page FloatActionButton reset
  // usePageResetFloatActionButton();
  useMode2PageResetFloatActionButton();

  useEffect(() => {
    return () => {
      useInboxMessageStore.getState().refreshNotifyUnread();
    };
  }, []);
};
export default useFeedBackPageBase;
