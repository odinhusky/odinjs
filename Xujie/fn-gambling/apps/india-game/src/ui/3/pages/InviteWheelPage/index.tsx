import { DEFAULT_BG, MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import useInviteWheelPageBase from '@mode2/usecase/page/inviteWheel/useInviteWheelPageBase';
import cx from '@commonUtils/cx';
import InviteWheelWithdrawCash from '@pages/InviteWheelPage/components/InviteWheelWithdrawCash';
import InvitationWheel from '@pages/InviteWheelPage/components/InvitationWheel';
import { InviteWheelShareButton } from '@pages/InviteWheelPage/components/InviteWheelShareButton';
import InviteWheelSpinRecord from '@pages/InviteWheelPage/components/InviteWheelSpinRecord';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { PinduoduoFreeDrawModal } from './models/PinduoduoFreeDrawModal';
import InviteWheelTipsModal from './components/InviteWheelTipsModal';
import InviteWheelResetTips from './components/InviteWheelResetTips';
import useInviteWheelPageHeaderSettingOverride from './useInviteWheelPageHeaderSettingOverride';

const InviteWheelPage = () => {
  useInviteWheelPageBase();
  useInviteWheelPageHeaderSettingOverride();

  const bgMainPath = getImgUrl(
    EResourceLevel.V,
    'invitation_wheel_background_1_m'
  );

  return (
    <div
      className={cx(
        'w-full h-full',
        'flex flex-col justify-center items-center',
        'w-screen',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mx-4 -mb-10 pb-10',
        DEFAULT_BG,
        'bg-top'
      )}
      style={{
        backgroundImage: `url(${bgMainPath})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 -10rem',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* 跑馬燈 */}
      {/*<InviteWheelMarquee />*/}

      {/* 領取獎勵 */}
      <InviteWheelWithdrawCash />

      {/* 輪盤 */}
      <InvitationWheel />

      {/* invite Share button */}
      <InviteWheelShareButton />

      {/* 重置 tips*/}
      <InviteWheelResetTips />

      {/* 轉盤紀錄 */}
      <InviteWheelSpinRecord />

      {/* InviteWheelTipsModal 活動追加提示 */}
      <InviteWheelTipsModal />

      {/* 礼盒弹窗 */}
      <PinduoduoFreeDrawModal />
    </div>
  );
};

export default InviteWheelPage;
