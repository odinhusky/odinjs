import { useMode2PageResetFloatActionButton } from '../useMode2PageResetFloatActionButton';
import useMode2RecordPageBalanceRecord from './useMode2RecordPageBalanceRecord';
import useMode2RecordPageBalanceReport from './useMode2RecordPageBalanceReport';
import useRecordPageFooterSetting from './useRecordPageFooterSetting';
import useRecordPageHeaderSetting from './useRecordPageHeaderSetting';
import useRecordPageTabNavigator from './useRecordPageTabNavigator';

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
  // usePageResetFloatActionButton();
  useMode2PageResetFloatActionButton();
};

export default useMode2RecordPageBase;
