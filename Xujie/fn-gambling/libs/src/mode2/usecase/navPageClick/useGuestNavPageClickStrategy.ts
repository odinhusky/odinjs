import { useNavigate } from 'react-router-dom';
import useNavigateInterceptor from '@mode2/usecase/navPageClick/useNavigateInterceptor';
import { LoginFormType } from '@mode2/zustand/loginStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { NavigateOptions } from 'react-router/dist/lib/context';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import useNavToLoginPage from '@mode2/usecase/navPageClick/useNavToLoginPage';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { ActivityRulesContentTypes } from '@mode2/zustand/page/activityRulesPageStore';
import { To } from 'react-router';

/**
 * 未登入的訪客，導航決策
 */
export const useGuestNavPageClickStrategy = () => {
  const navigate = useNavigate();

  const { toFeedBackPageInBoxTab } = useNavigateInterceptor();
  const navToLoginPage = (
    show: boolean = true,
    type: LoginFormType = LoginFormType.LOGIN
  ) => {
    useNavToLoginPage(show, type, navigate);
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
    if (options?.state?.tab === WalletPageTabType.WITHDRAW) {
      navToLoginPage();
    } else {
      navigate(`${BasePagePathObj.WalletPage}${query}`, options);
    }
  };

  const navToInvitePage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage();
  };

  const navToMyPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage();
  };

  /**
   * 有訪客預覽模式
   * @param query
   * @param options
   */
  const navToActivityPage = (query: string = '', options?: NavigateOptions) => {
    if (options?.state?.tab === ActivityPageTabType.VIP) {
      navToLoginPage();
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
      navToLoginPage();
    } else {
      navigate(`${BasePagePathObj.ActivityRulePage}${query}`, options);
    }
  };

  const navToRecordPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage();
  };

  const navToChangePasswordPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage();
  };

  const navToBindKYCPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage();
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
      navToLoginPage();
    }
  };

  const navToTeamClubPage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage();
  };

  const navToRewardsDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage();
  };

  const navToSubordinateDataPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage();
  };

  const navToSharePage = (query: string = '', options?: NavigateOptions) => {
    navToLoginPage();
  };

  const navToInviteWheelPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage();
  };

  const navToRechargeWheelPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage();
  };

  const navToRechargeWheelRecordsPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage();
  };

  const navToActivityRecordPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage();
  };
  const navToFullOrderDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {
    navToLoginPage();
  };

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
  };
};

export default useGuestNavPageClickStrategy;
