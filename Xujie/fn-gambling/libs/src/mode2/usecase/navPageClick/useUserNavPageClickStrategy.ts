import useNavigateInterceptor from '@mode2/usecase/navPageClick/useNavigateInterceptor';
import { LoginFormType } from '@mode2/zustand/loginStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { NavigateOptions } from 'react-router/dist/lib/context';
import useNavToLoginPage from '@mode2/usecase/navPageClick/useNavToLoginPage';
import { To } from 'react-router';
import useShouldNavigate from '@mode2/usecase/navPageClick/useShouldNavigate';
import { KYC_BOTH_STATE } from '@constant/KYC';
import posthog from 'posthog-js';
import { PostHogFeatureTypes } from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';

/**
 * 已經登入的使用者，導航決策
 */
const useUserNavPageClickStrategy = () => {
  const navigate = useShouldNavigate();
  const { toWalletPageWithdrawTab } = useNavigateInterceptor();
  const navToLoginPage = (
    flag: number,
    show: boolean = true,
    type: LoginFormType = LoginFormType.LOGIN
  ) => {
    console.log(
      '@@@===> navToLoginPage',
      JSON.stringify({ flag, show, type }, null, 2)
    );
    useNavToLoginPage(flag, show, type, navigate);
  };

  const navToHallPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.HallPage}${query}`, options);
  };

  const navToWalletPage = (query: string = '', options?: NavigateOptions) => {
    // Evan for [V6] 行為特例， 短解
    if (import.meta.env['VITE_V_VERSION'] === 'v6') {
      navigate(`${BasePagePathObj.WalletPage}${query}`, options);
      return;
    }
    if (toWalletPageWithdrawTab(options)) {
      navigate(`${BasePagePathObj.WalletPage}${query}`, options);
    } else {
      navigate(BasePagePathObj.BindKYCPage, {
        state: { tab: KYC_BOTH_STATE },
      });
    }
  };

  const navToInvitePage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.InvitePage}${query}`, options);
  };

  const navToMyPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.MyPage}${query}`, options);
  };

  const navToActivityPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.ActivityPage}${query}`, options);
  };

  const navToActivityRulePage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.ActivityRulePage}${query}`, options);
  };

  const navToRecordPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.RecordPage}${query}`, options);
  };

  const navToChangePasswordPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.ChangePasswordPage}${query}`, options);
  };

  const navToBindKYCPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.BindKYCPage}${query}`, options);
  };

  const navToFeedbackPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.FeedBackPage}${query}`, options);
  };

  const navToTeamClubPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.TeamClubPage}${query}`, options);
  };

  const navToRewardsDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.RewardsDetail}${query}`, options);
  };

  const navToSubordinateDataPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.SubordinateDataPage}${query}`, options);
  };

  const navToSharePage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.SharePage}${query}`, options);
  };

  const navToInviteWheelPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.InviteWheelPage}${query}`, options);
  };

  const navToRechargeWheelPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.RechargeWheelPage}${query}`, options);
  };

  const navToRechargeWheelRecordsPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.RechargeWheelRecordsPage}${query}`, options);
  };

  const navToActivityRecordPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.ActivityRecordPage}${query}`, options);
  };
  const navToFullOrderDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.FullOrderDetailPage}${query}`, options);
  };

  const navToGiftCodeRedeemPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.GiftCodeRedeemPage}${query}`, options);
  };

  // ---- new foe v6 start ----
  const navToAccountPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.AccountPage}${query}`, options);
  };

  const navToWalletGuidePage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.WalletGuidePage}${query}`, options);
  };

  const navToSettingPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.SettingPage}${query}`, options);
  };

  const navToOrderDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.OrderDetailPage}${query}`, options);
  };

  const navToVipPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.VipPage}${query}`, options);
  };

  const navToVipBonusPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.VipBonusPage}${query}`, options);
  };

  const navToRankingPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.RankingPage}${query}`, options);
  };

  const navToActivityDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.ActivityDetailPage}${query}`, options);
  };

  const navToTaskCenterPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.TaskCenterPage}${query}`, options);
  };

  const navToSearchGamePage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.SearchGamePage}${query}`, options);
  };

  const navToInboxDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.InboxDetailPage}${query}`, options);
  };

  const navToRechargeSecretPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    const secretRechargeEnabled = posthog.isFeatureEnabled(
      PostHogFeatureTypes.secretRecharge.flag
    );
    if (secretRechargeEnabled) {
      navigate(`${BasePagePathObj.RechargeSecretPage}${query}`, options);
    } else {
      navToHallPage();
    }
  };

  const navToLowBalanceRescueBoxPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    const lowBalanceRescueBoxEnabled = posthog.isFeatureEnabled(
      PostHogFeatureTypes.lowBalanceRescueBox.flag
    );

    if (lowBalanceRescueBoxEnabled) {
      navigate(`${BasePagePathObj.LowBalanceRescueBoxPage}${query}`, options);
    } else {
      navToHallPage();
    }
  };

  // ---- new foe v6 end ----

  const mapRoutesNavTo = (
    to: To,
    query: string = '',
    options?: NavigateOptions
  ) => {
    const path = typeof to === 'string' ? to : to.pathname;
    switch (path) {
      case BasePagePathObj.HallPage:
        navToHallPage(query, options);
        break;
      case BasePagePathObj.WalletPage:
        navToWalletPage(query, options);
        break;
      case BasePagePathObj.InvitePage:
        navToInvitePage(query, options);
        break;
      case BasePagePathObj.MyPage:
        navToMyPage(query, options);
        break;
      case BasePagePathObj.ActivityPage:
        navToActivityPage(query, options);
        break;
      case BasePagePathObj.ActivityRulePage:
        navToActivityRulePage(query, options);
        break;
      case BasePagePathObj.RecordPage:
        navToRecordPage(query, options);
        break;
      case BasePagePathObj.ChangePasswordPage:
        navToChangePasswordPage(query, options);
        break;
      case BasePagePathObj.BindKYCPage:
        navToBindKYCPage(query, options);
        break;
      case BasePagePathObj.TeamClubPage:
        navToTeamClubPage(query, options);
        break;
      case BasePagePathObj.RewardsDetail:
        navToRewardsDetailPage(query, options);
        break;
      case BasePagePathObj.SubordinateDataPage:
        navToSubordinateDataPage(query, options);
        break;
      case BasePagePathObj.SharePage:
        navToSharePage(query, options);
        break;
      case BasePagePathObj.FeedBackPage:
        navToFeedbackPage(query, options);
        break;
      case BasePagePathObj.InviteWheelPage:
        navToInviteWheelPage(query, options);
        break;
      case BasePagePathObj.RechargeWheelPage:
        navToRechargeWheelPage(query, options);
        break;
      case BasePagePathObj.RechargeWheelRecordsPage:
        navToRechargeWheelRecordsPage(query, options);
        break;
      case BasePagePathObj.ActivityRecordPage:
        navToActivityRecordPage(query, options);
        break;
      case BasePagePathObj.FullOrderDetailPage:
        navToFullOrderDetailPage(query, options);
        break;
      case BasePagePathObj.GiftCodeRedeemPage:
        navToGiftCodeRedeemPage(query, options);
        break;
      case BasePagePathObj.AccountPage:
        navToAccountPage(query, options);
        break;
      case BasePagePathObj.WalletGuidePage:
        navToWalletGuidePage(query, options);
        break;
      case BasePagePathObj.SettingPage:
        navToSettingPage(query, options);
        break;
      case BasePagePathObj.OrderDetailPage:
        navToOrderDetailPage(query, options);
        break;
      case BasePagePathObj.VipPage:
        navToVipPage(query, options);
        break;
      case BasePagePathObj.VipBonusPage:
        navToVipBonusPage(query, options);
        break;
      case BasePagePathObj.RankingPage:
        navToRankingPage(query, options);
        break;
      case BasePagePathObj.ActivityDetailPage:
        navToActivityDetailPage(query, options);
        break;
      case BasePagePathObj.TaskCenterPage:
        navToTaskCenterPage(query, options);
        break;
      case BasePagePathObj.SearchGamePage:
        navToSearchGamePage(query, options);
        break;
      case BasePagePathObj.InboxDetailPage:
        navToInboxDetailPage(query, options);
        break;
      case BasePagePathObj.RechargeSecretPage:
        navToRechargeSecretPage(query, options);
        break;
      case BasePagePathObj.LowBalanceRescueBoxPage:
        navToLowBalanceRescueBoxPage(query, options);
        break;
      default:
        navigate(`${path}${query}`, options);
    }
  };

  return {
    mapRoutesNavTo,
    navToLoginPage,
    navToHallPage,
    navToWalletPage,
    navToInvitePage,
    navToMyPage,
    navToActivityPage,
    navToActivityRulePage,
    navToRecordPage,
    navToChangePasswordPage,
    navToBindKYCPage,
    navToFeedbackPage,
    navToTeamClubPage,
    navToRewardsDetailPage,
    navToSubordinateDataPage,
    navToSharePage,
    navToInviteWheelPage,
    navToRechargeWheelPage,
    navToRechargeWheelRecordsPage,
    navToActivityRecordPage,
    navToFullOrderDetailPage,
    navToGiftCodeRedeemPage,
    navToAccountPage,
    navToWalletGuidePage,
    navToSettingPage,
    navToOrderDetailPage,
    navToVipPage,
    navToVipBonusPage,
    navToRankingPage,
    navToActivityDetailPage,
    navToTaskCenterPage,
    navToSearchGamePage,
    navToInboxDetailPage,
    navToRechargeSecretPage,
    navToLowBalanceRescueBoxPage,
  };
};

export default useUserNavPageClickStrategy;
