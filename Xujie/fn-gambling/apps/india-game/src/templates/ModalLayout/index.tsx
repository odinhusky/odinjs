import { LoginModal } from '@modals/LoginModal';
import { MoneyBoxModal } from '@modals/MoneyBoxModal';
import { BonusAnnounceModel } from '@modals/BonusAnnounceModel';
import ForceUpdateModal from '@modals/ForceUpdateModal';
import { ForgotPasswordModal } from '@modals/ForgotPasswordModal';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';
import { ReminderModal } from '@modals/ReminderModal';
import LeaveGameConfirmModal from '@modals/LeaveGameConfirmModal';
import { GameLoading } from '@components/GameLoading';
import ActivityCenterModal from '@libs/components/ActivityCenterModal';
import Loading from '@/components/Loading';
import ActivityDescriptionModal from '@modals/ActivityDescriptionModal';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import DepositAdvertisementModal from '@modals/DepositAdvertisementModal';
import { FirstChargeDiscountModal } from '@modals/FirstChargeDiscountModal';
import GuidanceDepositModal from '@modals/GuidanceDepositModal';

const ModalLayout = () => {
  const { navToLoginPage } = useNavPageClick();
  const { isShowLoginModal, loginType, isShowForgotPasswordModal } =
    useIsShowLoginModalStore((state) => ({
      isShowLoginModal: state.isShowLoginModal,
      loginType: state.loginType,
      isShowForgotPasswordModal: state.isShowForgotPasswordModal,
    }));

  return (
    <div>
      <LoginModal
        open={isShowLoginModal}
        type={loginType}
        onClose={() => {
          navToLoginPage(false);
        }}
      />

      {isShowForgotPasswordModal ? <ForgotPasswordModal /> : null}

      <MoneyBoxModal />

      <BonusAnnounceModel />

      <ForceUpdateModal />

      <LeaveGameConfirmModal />

      {/* 游戏页面-加载页 */}
      <GameLoading />

      {/* 通用 Loading  效果*/}
      <Loading />

      {/* 活動中心  */}
      <ActivityCenterModal />
      <ActivityDescriptionModal />

      {/* 老客餘額不足 */}
      <DepositAdvertisementModal />
      {/* 新客首充優惠 */}
      <FirstChargeDiscountModal />

      {/* 登录/注册成功 充值popup */}
      <ReminderModal />

      {/* 遊戲錢 引導充值 */}
      <GuidanceDepositModal />
    </div>
  );
};
export default ModalLayout;
