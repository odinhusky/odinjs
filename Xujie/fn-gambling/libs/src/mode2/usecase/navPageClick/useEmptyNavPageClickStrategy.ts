import { LoginFormType } from '@mode2/zustand/loginStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { NavigateOptions } from 'react-router/dist/lib/context';
import { To } from 'react-router';
import useShouldNavigate from '@mode2/usecase/navPageClick/useShouldNavigate';

/**
 * 未登入的訪客，導航決策
 */
export const useEmptyNavPageClickStrategy = () => {
  const navigate = useShouldNavigate();

  const navToLoginPage = (
    flag: number,
    show: boolean = true,
    type: LoginFormType = LoginFormType.LOGIN
  ) => {
    console.log(
      '@@@===> navToLoginPage',
      JSON.stringify({ flag, show, type }, null, 2)
    );
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
  const navToWalletPage = (query: string = '', options?: NavigateOptions) => {};

  const navToInvitePage = (query: string = '', options?: NavigateOptions) => {};

  const navToMyPage = (query: string = '', options?: NavigateOptions) => {};

  /**
   * 有訪客預覽模式
   * @param query
   * @param options
   */
  const navToActivityPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  /**
   * 有訪客預覽模式
   * 紅包雨需要登入
   * @param query
   * @param options
   */
  const navToActivityRulePage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToRecordPage = (query: string = '', options?: NavigateOptions) => {};

  const navToChangePasswordPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToBindKYCPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  /**
   * 有訪客預覽模式
   * 可以進入 [Customer support,  FAQ]
   * @param query
   * @param options
   */
  const navToFeedbackPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToTeamClubPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToRewardsDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToSubordinateDataPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToSharePage = (query: string = '', options?: NavigateOptions) => {};

  const navToInviteWheelPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToRechargeWheelPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToRechargeWheelRecordsPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToActivityRecordPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};
  const navToFullOrderDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToGiftCodeRedeemPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  // ---- new foe v6 start ----
  const navToAccountPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToWalletGuidePage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToSettingPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToGameSupplierListPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};

  const navToOrderDetailPage = (
    query: string = '',
    options?: NavigateOptions
  ) => {};
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
      case BasePagePathObj.GameSupplierListPage:
        navToGameSupplierListPage(query, options);
        break;
      case BasePagePathObj.OrderDetailPage:
        navToOrderDetailPage(query, options);
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
    navToGameSupplierListPage,
    navToOrderDetailPage,
  };
};

export default useEmptyNavPageClickStrategy;
