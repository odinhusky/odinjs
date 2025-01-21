import useFeedBackPageHeaderSetting from './useFeedBackPageHeaderSetting';
import useMode2FeedBackPageInBoxData from './useMode2FeedBackPageInBoxData';
import useMode2FeedBackPageFAQList from './useMode2FeedBackPageFAQList';
import useMode2FeedBackPageTabList from './useMode2FeedBackPageTabList';
import useMode2FeedBackType from './useMode2FeedBackType';
import useFeedBackPageFooterSetting from '@/ui/hooks/pages/feedBackPage/useFeedBackPageFooterSetting';
import { usePageResetFloatActionButton } from '@/ui/hooks/pages/usePageResetFloatActionButton';

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
  usePageResetFloatActionButton();
};
export default useFeedBackPageBase;
