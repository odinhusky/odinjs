import { useNavigate } from 'react-router-dom';
import useNavigateInterceptor from '@mode2/usecase/navPageClick/useNavigateInterceptor';
import { LoginFormType } from '@mode2/zustand/loginStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { NavigateOptions } from 'react-router/dist/lib/context';
import useNavToLoginPage from '@mode2/usecase/navPageClick/useNavToLoginPage';
import { To } from 'react-router';

/**
 * 已經登入的使用者，導航決策
 */
const useUserNavPageClickStrategy = () => {
  const navigate = useNavigate();
  const { toWalletPageWithdrawTab } = useNavigateInterceptor();
  const navToLoginPage = (
    show: boolean = true,
    type: LoginFormType = LoginFormType.LOGIN
  ) => {
    useNavToLoginPage(show, type, navigate);
  };

  const navToHallPage = (query: string = '', options?: NavigateOptions) => {
    navigate(`${BasePagePathObj.HallPage}${query}`, options);
  };

  const navToWalletPage = (query: string = '', options?: NavigateOptions) => {
    if (toWalletPageWithdrawTab(options)) {
      navigate(`${BasePagePathObj.WalletPage}${query}`, options);
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

export default useUserNavPageClickStrategy;
