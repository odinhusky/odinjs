import useWebviewPageHeaderSetting from './useWebviewPageHeaderSetting';
import useWebviewPageFooterSetting from '@/ui/hooks/pages/webViewPage/useWebviewPageFooterSetting';
import { usePageResetFloatActionButton } from '@/ui/hooks/pages/usePageResetFloatActionButton';
import { useWebViewPageTransferInGameSetting } from '@/ui/hooks/pages/webViewPage/useWebViewPageTransferInGameSetting';

export const useWebviewPageBase = () => {
  useWebviewPageHeaderSetting();

  // === in game or gameLobby recharge setting
  useWebViewPageTransferInGameSetting();

  useWebviewPageFooterSetting();

  // === Page FloatActionButton reset
  usePageResetFloatActionButton();
};

export default useWebviewPageBase;
