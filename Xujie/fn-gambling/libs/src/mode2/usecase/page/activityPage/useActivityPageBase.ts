import useMode2ActivityPageSwitchPage from './useMode2ActivityPageSwitchPage';
import useMode2ActivityPageIdInit from './useMode2ActivityPageIdInit';
import useActivityPageHeaderSetting from './useActivityPageHeaderSetting';
import useMode2ActivityList from '@mode2/usecase/page/activityPage/useMode2ActivityList';
import { useMode2PageResetFloatActionButton } from '../useMode2PageResetFloatActionButton';
import { useActivityPageFooterSetting } from './useActivityPageFooterSetting';

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
  useMode2PageResetFloatActionButton();
};
export default useActivityPageBase;
