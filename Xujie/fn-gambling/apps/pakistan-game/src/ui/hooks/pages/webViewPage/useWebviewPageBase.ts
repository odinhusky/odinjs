import { usePageResetFloatActionButton } from '../usePageResetFloatActionButton';
import useWebviewPageFooterSetting from './useWebviewPageFooterSetting';
import useWebviewPageHeaderSetting from './useWebviewPageHeaderSetting';
import { useWebViewPageTransferInGameSetting } from './useWebViewPageTransferInGameSetting';

export const useWebviewPageBase = () => {
  useWebviewPageHeaderSetting();

  // === in game or gameLobby recharge setting
  useWebViewPageTransferInGameSetting();

  useWebviewPageFooterSetting();

  // === Page FloatActionButton reset
  usePageResetFloatActionButton();
};

export default useWebviewPageBase;
