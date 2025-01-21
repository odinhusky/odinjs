import { DEFAULT_BG, MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import useInviteWheelPageBase from '@mode2/usecase/page/inviteWheel/useInviteWheelPageBase';
import cx from '@commonUtils/cx';
import InviteWheelMarquee from '@pages/InviteWheelPage/components/InviteWheelMarquee';
import InviteWheelWithdrawCash from '@pages/InviteWheelPage/components/InviteWheelWithdrawCash';
import InvitationWheel from '@pages/InviteWheelPage/components/InvitationWheel';
import { InviteWheelShareButton } from '@pages/InviteWheelPage/components/InviteWheelShareButton';
import InviteWheelSpinRecord from '@pages/InviteWheelPage/components/InviteWheelSpinRecord';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { PinduoduoFreeDrawModal } from './models/PinduoduoFreeDrawModal';
import InviteWheelTipsModal from './components/InviteWheelTipsModal';
import InviteWheelResetTips from './components/InviteWheelResetTips';
import useInviteWheelPageInit from '@mode2/usecase/page/inviteWheel/useInviteWheelPageInit';

const InviteWheelPage = () => {
  useInviteWheelPageBase();

  const bgMainPath = getImgUrl(
    EResourceLevel.V,
    'invitation_wheel_background_1_m'
  );

  return (
    <div
      className={cx(
        'w-full h-full',
        'pt-0 pb-0 mobile:py-8',
        'mb-8 mobile:mb-10 tablet:mb-8',
        // 'text-2xl text-white font-bold',
        'flex flex-col justify-center gap-2 items-center',
        'w-screen mobile:w-full',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mx-4 mobile:m-auto',
        DEFAULT_BG,
        // 'bg-contain',
        // 'bg-auto',
        'bg-top'
      )}
      style={{
        backgroundImage: `url(${bgMainPath})`,
        backgroundPosition: '0 -3rem',
      }}
    >
      {/* 跑馬燈 */}
      <InviteWheelMarquee />

      {/* 領取獎勵 */}
      <InviteWheelWithdrawCash />

      {/* 輪盤 */}
      <InvitationWheel />

      {/* 重置 tips*/}
      <InviteWheelResetTips />

      {/* invite Share button */}
      <InviteWheelShareButton />

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
