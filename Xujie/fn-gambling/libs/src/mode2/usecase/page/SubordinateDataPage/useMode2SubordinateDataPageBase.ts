import useMode2SubordinateDataPageInit from './useMode2SubordinateDataPageInit';
import useSubordinateDataPageHeaderSetting from './useSubordinateDataPageHeaderSetting';
import { useSubordinateDataPageFooterSetting } from './useSharePageFooterSetting';

export const useMode2SubordinateDataPageBase = () => {

  useMode2SubordinateDataPageInit();
  
  useSubordinateDataPageHeaderSetting();
  
  useSubordinateDataPageFooterSetting();

};

export default useMode2SubordinateDataPageBase;
