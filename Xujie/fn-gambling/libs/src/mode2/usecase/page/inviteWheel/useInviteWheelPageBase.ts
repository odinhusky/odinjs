import useInviteWheelPageHeaderSetting from '@mode2/usecase/page/inviteWheel/useInviteWheelPageHeaderSetting';
import { useMode2PageResetFloatActionButton } from '@mode2/usecase/page/useMode2PageResetFloatActionButton';
import useInviteWheelPageFooterSetting from '@mode2/usecase/page/inviteWheel/useInviteWheelPageFooterSetting';
import useInviteWheelPageInit from '@mode2/usecase/page/inviteWheel/useInviteWheelPageInit';
import useInviteSpinWheelBase from '@mode2/usecase/page/inviteWheel/useInviteSpinWheelBase';

const useInviteWheelPageBase = () => {
  useInviteWheelPageInit();

  // 輪盤控制邏輯
  useInviteSpinWheelBase();

  // ==== InviteWheelPage header setting
  useInviteWheelPageHeaderSetting();

  // ==== InviteWheelPage FloatActionButton reset
  useMode2PageResetFloatActionButton();

  // ==== InviteWheelPage footer setting
  useInviteWheelPageFooterSetting();
};

export default useInviteWheelPageBase;
