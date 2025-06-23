import { LoginModal } from '@modals/LoginModal';
import { MoneyBoxModal } from '@modals/MoneyBoxModal';
import ForceUpdateModal from '@modals/ForceUpdateModal';
import { ForgotPasswordModal } from '@modals/ForgotPasswordModal';
import { useIsShowLoginModalStore } from '@mode2/zustand/loginStore';
import LeaveGameConfirmModal from '@modals/LeaveGameConfirmModal';
import { GameLoading } from '@components/GameLoading';
import Loading from '@/components/Loading';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import { FirstChargeDiscountModal } from '@modals/FirstChargeDiscountModal';
import GuidanceDepositModal from '@modals/GuidanceDepositModal';
import { GiftCodeRedeemModal } from '@modals/GiftCodeRedeemModal';
import BindPlayerPhoneModal from '@modals/BindPlayerPhoneModal';
import LogoutWeakTipsModal from '@modals/LogoutWeakTipsModal';
import InviteWheelRuleModal from '@modals/InviteWheelRuleModal';
import TeamClubModal from '@modals/TeamClubModal';
import InviteWheelModal from '@modals/InviteWheelModal';
import DailyRebateModal from '@modals/DailyRebateModal';
import FullAnimation from '@components/FullAnimation';
import { GiftCodeRedeemResultModal } from '@modals/GiftCodeRedeemResultModal';
import SurpriseRewardModal from '@modals/SurpriseRewardModal';
import PostTGActivityModal from '@modals/PostTGActivityModal';

import { memo } from 'react';
import useMobileExclusiveModalLayoutOverride from './useMobileExclusiveModalLayoutOverride';
import RankingActivityModal from '@modals/RankingActivityModal';
import GlobalAnnouncementModal from '@modals/GlobalAnnouncementModal';
import WinningsShareModel from '@modals/WinningsShareModel';
import DynamicActivityModal from '@modals/DynamicActivityModal';
import TaskListModal from '@modals/TaskListModal';
import AccountDetailModal from '@modals/AccountDetailModal';
import ActivityCenterModal from '@libs/components/ActivityCenterModal';
import ActivityDescriptionModal from '@modals/ActivityDescriptionModal';
import LowBalanceRechargeModal from '@modals/LowBalanceRechargeModal';
import LowBalanceRescueBoxModal from '@modals/LowBalanceRescueBoxModal';
import InboxReceiveModal from '@modals/InboxReceiveModal';
import DepositJackpotWheelModal from '@modals/DepositJackpotWheelModal';

const ModalLayout = memo(() => {
  useMobileExclusiveModalLayoutOverride();
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

      {/* Evan [V6] 棄用*/}
      {/*<BonusAnnounceModel />*/}
      {/*/!* 活動中心  *!/*/}
      <ActivityCenterModal />
      <ActivityDescriptionModal />

      {/* 老客餘額不足 */}
      {/* <DepositAdvertisementModal /> */}

      {/*/!* 登录/注册成功 充值popup *!/*/}
      {/*<ReminderModal />*/}

      <LeaveGameConfirmModal />

      {/* 游戏页面-加载页 */}
      <GameLoading />

      {/* 邀請輪盤規則 */}
      <InviteWheelRuleModal />

      {/* 遊戲錢 引導充值 */}
      <GuidanceDepositModal />

      {/* Gift Code 優惠碼 */}
      <GiftCodeRedeemModal />

      {/* 登出的弱提示 */}
      <LogoutWeakTipsModal />

      {/* 綁定會員手機Modal */}
      <BindPlayerPhoneModal />

      {/* 破產充值優惠Modal */}
      <LowBalanceRechargeModal />

      {/* 破產獎勵寶箱Modal */}
      <LowBalanceRescueBoxModal />

      {/* ---- ad modal start ---- */}

      {/* 國際俱樂部Modal */}
      <TeamClubModal />

      {/* 邀請輪盤Modal */}
      <InviteWheelModal />

      {/* 新客首充優惠 */}
      <FirstChargeDiscountModal />

      {/* 每日返水Modal */}
      <DailyRebateModal />

      {/* 不定时惊喜奖励Modal */}
      <SurpriseRewardModal />

      {/* Telegram Modal */}
      <PostTGActivityModal />

      {/* Ranking Modal */}
      <RankingActivityModal />

      {/*<CricketFeverModal />*/}

      {/*<JiliSpinChallengeModal />*/}
      <DynamicActivityModal />

      {/* Piggy Bank 每日返水 */}
      <MoneyBoxModal />

      {/* 充值獎勵輪盤 */}
      <DepositJackpotWheelModal />
      {/* ---- ad modal end ---- */}

      {/* 整個頁面類型的動畫圖 */}
      <FullAnimation />

      {/* 兑换優惠碼api回應結果的Modal */}
      <GiftCodeRedeemResultModal />

      {/* 全局公告 */}
      <GlobalAnnouncementModal />

      {/* 新人福利 & 每日任務 */}
      <TaskListModal />

      <WinningsShareModel />

      {/* 強，弱 更新 apk */}
      <ForceUpdateModal />

      {/* 通用 Loading  效果*/}
      <Loading />

      {/* AccountPage 修改用戶信息的Modal - [性別 暱稱 密碼 推薦碼] */}
      <AccountDetailModal />

      {/* InBox信件領取結果Modal - 信件頁面&信件詳情頁面[V6]會用到 */}
      <InboxReceiveModal />
    </div>
  );
});
export default ModalLayout;
