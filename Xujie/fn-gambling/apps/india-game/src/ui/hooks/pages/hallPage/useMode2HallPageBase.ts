import useMode2MarqueeList from './useMode2MarqueeList';
import useMode2HallPageTabs from './useMode2HallPageTabs';
import useMode2HallPageGameList from './useMode2HallPageGameList';
import useMode2HallPageInit from './useMode2HallPageInit';
import useHallPageHeaderSetting from './useHallPageHeaderSetting';
import useHallPageDeepLinkWithQueryString from './useHallPageDeepLinkWithQueryString';
import { useHallPageFooterSetting } from '@/ui/hooks/pages/hallPage/useHallPageFooterSetting';
import { useHallPageFABSetting } from '@/ui/hooks/pages/hallPage/useHallPageFABSetting';
import useBannerListBase from '@mode2/usecase/components/useBannerListBase';

export const useMode2HallPageBase = () => {
  // ==== 首頁 資料初始化(使用 transform & set zustand)
  useMode2HallPageInit();

  // ==== 首頁 Banner
  useBannerListBase();

  // === 首頁 跑馬燈
  useMode2MarqueeList();

  // === 首頁 遊戲分類 Tabs
  useMode2HallPageTabs();

  // === 首頁 遊戲列表
  useMode2HallPageGameList();

  // === 首頁 Header 設定
  useHallPageHeaderSetting();

  // === 首頁 Footer 設定
  useHallPageFooterSetting();

  // === 首頁 FloatActionButton setting
  useHallPageFABSetting();

  // === DeepLink
  useHallPageDeepLinkWithQueryString();
};

export default useMode2HallPageBase;
