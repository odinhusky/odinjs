import useChangePasswordPageHeaderSetting from './useChangePasswordPageHeaderSetting';
import useChangePasswordPageInitData from './useChangePasswordPageInitData';
import useChangePasswordPageFooterSetting from '@/ui/hooks/pages/changePasswordPage/useChangePasswordPageFooterSetting';
import { usePageResetFloatActionButton } from '@/ui/hooks/pages/usePageResetFloatActionButton';

export const useMode2ChangePasswordPageBase = () => {
  // ==== ChangePasswordPage Header Setting
  useChangePasswordPageHeaderSetting();

  useChangePasswordPageInitData();

  // ==== ChangePasswordPage Footer Setting
  useChangePasswordPageFooterSetting();

  // === Page FloatActionButton reset
  usePageResetFloatActionButton();
};

export default useMode2ChangePasswordPageBase;
