import useNavigateInterceptor from '@mode2/usecase/navPageClick/useNavigateInterceptor';
import { LoginFormType } from '@mode2/zustand/loginStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { NavigateOptions } from 'react-router/dist/lib/context';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import useNavToLoginPage from '@mode2/usecase/navPageClick/useNavToLoginPage';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { ActivityRulesContentTypes } from '@mode2/zustand/page/activityRulesPageStore';
import { To } from 'react-router';
import useShouldNavigate from '@mode2/usecase/navPageClick/useShouldNavigate';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import { WalletDashboardType } from '@mode2/@types/walletDashboardTypes';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';

/**
 * 未登入的訪客，導航決策
 */
export const useGuestNavPageClickStrategy = () => {
  const navigate = useShouldNavigate();

  const { toFeedBackPageInBoxTab } = useNavigateInterceptor();
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

  /**
   * 有訪客預覽模式
   * @param query
   * @param options
   */
  const navToHallPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.HallPage}${query}`, options);
  };

  /**
   * 有訪客預覽模式
   * @param query
   * @param options
   */
  const navToWalletPage = (query: string = '', options?: NavigateOptions) => {
    // Evan for [V6] 行為特例
    if (import.meta.env['VITE_V_VERSION'] === 'v6') {
      navToLoginPage(19);
      return;
    }
    const dashboardType = useWalletPageStore.getState().displayDashboardType;
    const switchContentTabId =
      useWalletPageSwitchContentTabsStore.getState().curSwitchContentTabId;
    if (
      options?.state?.tab === WalletPageTabType.WITHDRAW ||
      switchContentTabId === WalletPageTabType.WITHDRAW ||
      dashboardType === WalletDashboardType.BALANCE
    ) {
      navToLoginPage(19);
    } else {
      navigate(`${BasePagePathObj.WalletPage}${query}`, options);
    }
  };

  const navToInvitePage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage(18);
  };

  const navToMyPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage(17);
  };

  /**
   * 有訪客預覽模式
   * @param query
   * @param options
   */
  const navToActivityPage = (query: string = '', options?: NavigateOptions) => {
    if (options?.state?.tab === ActivityPageTabType.VIP) {
      navToLoginPage(16);
    } else {
      navigate(`${BasePagePathObj.ActivityPage}${query}`, options);
    }
  };

  /**
   * 有訪客預覽模式
   * 紅包雨需要登入
   * @param query
   * @param options
   */
  const navToActivityRulePage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    if (
      options?.state?.tab ===
      ActivityRulesContentTypes.RED_ENVELOPE_RAIN_RULES_CONTENT
    ) {
      // navToLoginPage(15);
      navigate(`${BasePagePathObj.ActivityRulePage}${query}`, options);
    } else {
      navigate(`${BasePagePathObj.ActivityRulePage}${query}`, options);
    }
  };

  const navToRecordPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage(14);
  };

  const navToChangePasswordPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(2);
  };

  const navToBindKYCPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage(13);
  };

  /**
   * 有訪客預覽模式
   * 可以進入 [Customer support,  FAQ]
   * @param query
   * @param options
   */
  const navToFeedbackPage = (query: string = '', options?: NavigateOptions) => {
    if (toFeedBackPageInBoxTab(options)) {
      navigate(`${BasePagePathObj.FeedBackPage}${query}`, options);
    } else {
      navToLoginPage(12);
    }
  };

  const navToTeamClubPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage(11);
  };

  const navToRewardsDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(10);
  };

  const navToSubordinateDataPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(9);
  };

  const navToSharePage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage(8);
  };

  const navToInviteWheelPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(7);
  };

  const navToRechargeWheelPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(6);
  };

  const navToRechargeWheelRecordsPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(5);
  };

  const navToActivityRecordPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(0);
  };
  const navToFullOrderDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(3);
  };

  const navToGiftCodeRedeemPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(4);
  };

  const navToSearchGamePage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navigate(`${BasePagePathObj.SearchGamePage}${query}`, options);
  };

  // ---- new foe v6 start ----
  const navToAccountPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToWalletGuidePage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(74);
  };

  const navToSettingPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage(75);
  };

  const navToOrderDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(76);
  };

  const navToVipPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage(77);
  };

  const navToVipBonusPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage(78);
  };

  const navToRankingPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage(95);
  };

  const navToActivityDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(95);
  };

  const navToTaskCenterPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(96);
  };

  const navToInboxDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(97);
  };

  const navToRechargeSecretPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(98);
  };

  const navToLowBalanceRescueBoxPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage(98);
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

export default useGuestNavPageClickStrategy;
