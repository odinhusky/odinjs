import usePolicyPageHeaderSetting from './usePolicyPageHeaderSetting';
import useMode2PolicyPageList from './useMode2PolicyPageList';
import usePolicyPageFooterSetting from '@/ui/hooks/pages/policyPage/usePolicyPageFooterSetting';
import { usePageResetFloatActionButton } from '@/ui/hooks/pages/usePageResetFloatActionButton';

const useMode2PolicyPageBase = () => {
  usePolicyPageHeaderSetting();
  useMode2PolicyPageList();

  // === PolicyPage Footer Setting
  usePolicyPageFooterSetting();

  // === Page FloatActionButton reset
  usePageResetFloatActionButton();
};

export default useMode2PolicyPageBase;
