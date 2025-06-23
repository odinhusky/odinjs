import useMyVipContentBase from '../activityPage/useMyVipContentBase';
import useVipPageHeaderSetting from './useMode2VipPageHeaderSetting';

export const useMode2VipPageBase = () => {
  useMyVipContentBase();

  useVipPageHeaderSetting();
};

export default useMode2VipPageBase;
