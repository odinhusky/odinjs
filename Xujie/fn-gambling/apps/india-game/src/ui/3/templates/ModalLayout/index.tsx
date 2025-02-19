import { LoginModal } from '@modals/LoginModal';
import { MoneyBoxModal } from '@modals/MoneyBoxModal';
import { BonusAnnounceModel } from '@modals/BonusAnnounceModel';
import ForceUpdateModal from '@modals/ForceUpdateModal';
import { ForgotPasswordModal } from '@modals/ForgotPasswordModal';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';
import LeaveGameConfirmModal from '@modals/LeaveGameConfirmModal';
import { GameLoading } from '@components/GameLoading';
import Loading from '@/components/Loading';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import DepositAdvertisementModal from '@modals/DepositAdvertisementModal';
import { FirstChargeDiscountModal } from '@modals/FirstChargeDiscountModal';
import GuidanceDepositModal from '@modals/GuidanceDepositModal';
import { GiftCodeRedeemModal } from '@modals/GiftCodeRedeemModal';
import BindPlayerPhoneModal from '@modals/BindPlayerPhoneModal';
import LogoutWeakTipsModal from '@modals/LogoutWeakTipsModal';
import InviteWheelRuleModal from '@modals/InviteWheelRuleModal';

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
          navToLoginPage(65, false);
        }}
      />

      {isShowForgotPasswordModal ? <ForgotPasswordModal /> : null}

      <MoneyBoxModal />

      {/* TODO Evan 開發中先關閉 很煩*/}
      {/*<BonusAnnounceModel />*/}

      <ForceUpdateModal />

      <LeaveGameConfirmModal />

      {/* 游戏页面-加载页 */}
      <GameLoading />

      {/* 通用 Loading  效果*/}
      <Loading />

      {/*/!* 活動中心  *!/*/}
      {/*<ActivityCenterModal />*/}
      {/*<ActivityDescriptionModal />*/}

      {/* 邀請輪盤規則 */}
      <InviteWheelRuleModal />

      {/* 老客餘額不足 */}
      <DepositAdvertisementModal />
      {/* 新客首充優惠 */}
      <FirstChargeDiscountModal />

      {/*/!* 登录/注册成功 充值popup *!/*/}
      {/*<ReminderModal />*/}

      {/* 遊戲錢 引導充值 */}
      <GuidanceDepositModal />

      {/* Gift Code 優惠碼 */}
      <GiftCodeRedeemModal />

      {/* 登出的弱提示 */}
      <LogoutWeakTipsModal />

      {/* 綁定會員手機Modal */}
      <BindPlayerPhoneModal />
    </div>
  );
};
export default ModalLayout;
