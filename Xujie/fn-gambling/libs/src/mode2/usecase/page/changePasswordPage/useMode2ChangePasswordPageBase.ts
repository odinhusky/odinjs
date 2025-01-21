import { useMode2PageResetFloatActionButton } from '../useMode2PageResetFloatActionButton';
import useChangePasswordPageFooterSetting from './useChangePasswordPageFooterSetting';
import useChangePasswordPageHeaderSetting from './useChangePasswordPageHeaderSetting';
import useChangePasswordPageInitData from './useChangePasswordPageInitData';

export const useMode2ChangePasswordPageBase = () => {
  // ==== ChangePasswordPage Header Setting
  useChangePasswordPageHeaderSetting();

  useChangePasswordPageInitData();

  // ==== ChangePasswordPage Footer Setting
  useChangePasswordPageFooterSetting();

  // === Page FloatActionButton reset
  useMode2PageResetFloatActionButton();
};

export default useMode2ChangePasswordPageBase;
