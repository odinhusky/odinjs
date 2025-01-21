import usePolicyPageHeaderSetting from './usePolicyPageHeaderSetting';
import useMode2PolicyPageList from './useMode2PolicyPageList';
import usePolicyPageFooterSetting from './usePolicyPageFooterSetting';
import { useMode2PageResetFloatActionButton } from '../useMode2PageResetFloatActionButton';

const useMode2PolicyPageBase = () => {
  usePolicyPageHeaderSetting();
  useMode2PolicyPageList();

  // === PolicyPage Footer Setting
  usePolicyPageFooterSetting();

  // === Page FloatActionButton reset
  // usePageResetFloatActionButton();
  useMode2PageResetFloatActionButton();
};

export default useMode2PolicyPageBase;
