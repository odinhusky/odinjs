import useBindKYCPageHeaderSetting from './useBindKYCPageHeaderSetting';
import useBindKYCPageFooterSetting from '@/ui/hooks/pages/bindKYCPage/useBindKYCPageFooterSetting';
import { usePageResetFloatActionButton } from '@/ui/hooks/pages/usePageResetFloatActionButton';
import useKYCInitDiff from './useKYCInitDiff';

// Diff
import useBindKYCPageBankAccountTabs from './useBindKYCPageBankAccountTabs';
import useBindKYCPageBankAccountSelectOptions from './useBindKYCPageBankAccountSelectOptions';

export const useBindKYCPageBase = () => {
  // === 元件初始化 - 差異化部分
  useKYCInitDiff();

  // ==== 設定 bindKYCPage 的 header
  useBindKYCPageHeaderSetting();

  // === BindKYCPage Footer Setting
  useBindKYCPageFooterSetting();

  // === Page FloatActionButton reset
  usePageResetFloatActionButton();

  // === Bank Account Tabs(Diff)
  useBindKYCPageBankAccountTabs();

  // === Bank Account Select Option(Diff)
  useBindKYCPageBankAccountSelectOptions();
};

export default useBindKYCPageBase;
