import useActivityRecordPageHeaderSetting from './useActivityRecordPageHeaderSetting';
import useActivityRecordPageFooterSetting from '@mode2/usecase/page/activityRecordPage/useActivityRecordPageFooterSetting';

export const useActivityRecordPageBase = () => {
  useActivityRecordPageHeaderSetting();

  useActivityRecordPageFooterSetting();
};

export default useActivityRecordPageBase;
