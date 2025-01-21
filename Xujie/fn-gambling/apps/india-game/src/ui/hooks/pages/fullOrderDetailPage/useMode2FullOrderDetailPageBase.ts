import useFullOrderDetailPageHeaderSetting from './useFullOrderDetailPageHeaderSetting';
import { useFullOrderDetailPageFooterSetting } from './useFullOrderDetailPageFooterSetting';
import useFullOrderDetailPageInit from './useFullOrderDetailPageInit';

export const useMode2FullOrderDetailPageBase = () => {
  useFullOrderDetailPageInit();

  useFullOrderDetailPageHeaderSetting();

  useFullOrderDetailPageFooterSetting();
};

export default useMode2FullOrderDetailPageBase;
