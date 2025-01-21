import useMode2RecordPageBalanceRecord from './useMode2RecordPageBalanceRecord';
import useMode2RecordPageBalanceReport from './useMode2RecordPageBalanceReport';
import useRecordPageHeaderSetting from './useRecordPageHeaderSetting';
import useRecordPageTabNavigator from './useRecordPageTabNavigator';
import useRecordPageFooterSetting from '@/ui/hooks/pages/recordPage/useRecordPageFooterSetting';
import { usePageResetFloatActionButton } from '@/ui/hooks/pages/usePageResetFloatActionButton';

export const useMode2RecordPageBase = () => {
  // ==== Handle tab switch when navigate from other page
  useRecordPageTabNavigator();

  // ==== Balance Record
  useMode2RecordPageBalanceRecord();

  // ==== Balance Report
  useMode2RecordPageBalanceReport();

  // ==== 設定 RecordPage header
  useRecordPageHeaderSetting();

  // ==== RecordPage Footer setting
  useRecordPageFooterSetting();

  // === Page FloatActionButton reset
  usePageResetFloatActionButton();
};

export default useMode2RecordPageBase;
