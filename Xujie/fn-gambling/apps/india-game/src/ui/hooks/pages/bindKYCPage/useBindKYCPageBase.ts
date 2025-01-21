import useBindKYCPageHeaderSetting from './useBindKYCPageHeaderSetting';
import useBindKYCPageFooterSetting from '@/ui/hooks/pages/bindKYCPage/useBindKYCPageFooterSetting';
import { usePageResetFloatActionButton } from '@/ui/hooks/pages/usePageResetFloatActionButton';

export const useBindKYCPageBase = () => {
  // ==== 設定 bindKYCPage 的 header
  useBindKYCPageHeaderSetting();

  // === BindKYCPage Footer Setting
  useBindKYCPageFooterSetting();

  // === Page FloatActionButton reset
  usePageResetFloatActionButton();
};

export default useBindKYCPageBase;
