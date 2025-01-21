import { useLoginPageFABSetting } from './useLoginPageFABSetting';
import useLoginPageFooterSetting from './useLoginPageFooterSetting';
import useLoginPageHeaderSetting from './useLoginPageHeaderSetting';

export const useMode2LoginPageBase = () => {
  // ==== LoginPage Header Setting
  useLoginPageHeaderSetting();

  // ==== LoginPage Footer Setting
  useLoginPageFooterSetting();

  // === LoginPage FloatActionButton setting
  useLoginPageFABSetting();
};

export default useMode2LoginPageBase;
