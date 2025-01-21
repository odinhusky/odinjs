import { LoginModal } from '@modals/LoginModal';
import { MoneyBoxModal } from '@modals/MoneyBoxModal';
import { BonusAnnounce } from '@modals/BonusAnnounce';
import ForceUpdateModal from '@modals/ForceUpdateModal';
import { ForgotPasswordModal } from '@modals/ForgotPasswordModal';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';
import { ReminderModal } from '@modals/ReminderModal';
import LeaveGameConfirmModal from '@modals/LeaveGameConfirmModal';
import { GameLoading } from '@components/GameLoading';
import Loading from '@/components/Loading';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';

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

      <BonusAnnounce />

      <ForceUpdateModal />

      <LeaveGameConfirmModal />

      {/* 游戏页面-加载页 */}
      <GameLoading />

      {/* 通用 Loading  效果*/}
      <Loading />

      {/* 登录/注册成功 充值popup */}
      <ReminderModal />

      {/* 活動中心 TODO */}
      {/* <ActivityCenterModal /> */}
    </div>
  );
};
export default ModalLayout;
