import useMode2ActivityPageSwitchPage from './useMode2ActivityPageSwitchPage';
import useMode2ActivityPageIdInit from './useMode2ActivityPageIdInit';
import useActivityPageHeaderSetting from './useActivityPageHeaderSetting';
import { useActivityPageFooterSetting } from '@/ui/hooks/pages/activityPage/useActivityPageFooterSetting';
import { usePageResetFloatActionButton } from '@/ui/hooks/pages/usePageResetFloatActionButton';
import useMode2ActivityList from '@mode2/usecase/page/activityPage/useMode2ActivityList';

export const useActivityPageBase = () => {
  useMode2ActivityPageIdInit();

  // ====== 活動頁 Switch Tab List
  useMode2ActivityPageSwitchPage();

  // ====== 活動頁 Activity List Tab
  useMode2ActivityList();

  // === ActivityPage Header Setting
  useActivityPageHeaderSetting();

  // === ActivityPage Footer Setting
  useActivityPageFooterSetting();

  // === Page FloatActionButton reset
  usePageResetFloatActionButton();
};
export default useActivityPageBase;
