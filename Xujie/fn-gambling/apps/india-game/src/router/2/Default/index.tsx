import { BasePagePathObj } from '@mode2/routerTypes/types';
import WalletPage from '@pages/WalletPage';
import InvitePage from '@pages/InvitePage';
import MyPage from '@pages/MyPage';
import LoginPage from '@pages/LoginPage';
import ActivityPage from '@pages/ActivityPage';
import RecordPage from '@pages/RecordPage';
import ChangePasswordPage from '@pages/ChangePasswordPage';
import BindKYCPage from '@pages/BindKYCPage';
import HallPage from '@pages/HallPage';
import WebviewPage from '@pages/WebviewPage';
import PolicyPage from '@pages/PolicyPage';
import FeedBackPage from '@pages/FeedBackPage';
import MoreGamePage from '@pages/MoreGamePage';
import SubordinateDataPage from '@pages/SubordinateDataPage';
import TeamClubPage from '@pages/TeamClubPage';
import ActivityRulePage from '@pages/ActivityRulePage';
import RewardsDetailPage from '@pages/RewardsDetailPage';
import SharePage from '@pages/SharePage';
import ActivityRecordPage from '@pages/ActivityRecordPage';
import InviteWheelPage from '@pages/InviteWheelPage';
import FullOrderDetailPage from '@pages/FullOrderDetailPage';
import RechargeWheelPage from '@pages/RechargeWheelPage';
import RechargeWheelRecordsPage from '@pages/RechargeWheelRecordsPage';
import { lazy } from 'react';
import GiftCodeRedeemPage from '@pages/GiftCodeRedeemPage';
import UndefinedRoute from '@/router/UndefinedRoute';
import Layout from '@templates/Layout';

export const DEFAULT_ROUTES = [
  {
    path: BasePagePathObj.WalletPage,
    component: WalletPage,
    element: (
      <Layout path={BasePagePathObj.WalletPage} component={WalletPage} />
    ),
  },
  {
    path: BasePagePathObj.InvitePage,
    component: InvitePage,
    element: (
      <Layout path={BasePagePathObj.InvitePage} component={InvitePage} />
    ),
  },
  {
    path: BasePagePathObj.MyPage,
    component: MyPage,
    element: <Layout path={BasePagePathObj.MyPage} component={MyPage} />,
  },
  {
    path: BasePagePathObj.LoginPage,
    component: LoginPage,
    element: <Layout path={BasePagePathObj.LoginPage} component={LoginPage} />,
  },
  {
    path: BasePagePathObj.ActivityPage,
    component: ActivityPage,
    element: (
      <Layout path={BasePagePathObj.ActivityPage} component={ActivityPage} />
    ),
  },
  {
    path: BasePagePathObj.RecordPage,
    component: RecordPage,
    element: (
      <Layout path={BasePagePathObj.RecordPage} component={RecordPage} />
    ),
  },
  {
    path: BasePagePathObj.ChangePasswordPage,
    component: ChangePasswordPage,
    element: (
      <Layout
        path={BasePagePathObj.ChangePasswordPage}
        component={ChangePasswordPage}
      />
    ),
  },
  {
    path: BasePagePathObj.BindKYCPage,
    component: BindKYCPage,
    element: (
      <Layout path={BasePagePathObj.BindKYCPage} component={BindKYCPage} />
    ),
  },
  //UNAUTH_ROUTES
  {
    path: BasePagePathObj.HallPage,
    component: HallPage,
    element: <Layout path={BasePagePathObj.HallPage} component={HallPage} />,
  },
  {
    path: BasePagePathObj.GamePage,
    component: WebviewPage,
    element: <Layout path={BasePagePathObj.GamePage} component={WebviewPage} />,
  },
  {
    path: BasePagePathObj.GameLobbyPage,
    component: WebviewPage,
    element: (
      <Layout path={BasePagePathObj.GameLobbyPage} component={WebviewPage} />
    ),
  },
  {
    path: BasePagePathObj.PolicyPage,
    component: PolicyPage,
    element: (
      <Layout path={BasePagePathObj.PolicyPage} component={PolicyPage} />
    ),
  },
  {
    path: BasePagePathObj.FeedBackPage,
    component: FeedBackPage,
    element: (
      <Layout path={BasePagePathObj.FeedBackPage} component={FeedBackPage} />
    ),
  },
  {
    path: BasePagePathObj.MoreGamePage,
    component: MoreGamePage,
    element: (
      <Layout path={BasePagePathObj.MoreGamePage} component={MoreGamePage} />
    ),
  },
  {
    path: BasePagePathObj.SubordinateDataPage,
    component: SubordinateDataPage,
    element: (
      <Layout
        path={BasePagePathObj.SubordinateDataPage}
        component={SubordinateDataPage}
      />
    ),
  },
  {
    path: BasePagePathObj.TeamClubPage,
    component: TeamClubPage,
    element: (
      <Layout path={BasePagePathObj.TeamClubPage} component={TeamClubPage} />
    ),
  },
  {
    path: BasePagePathObj.ActivityRulePage,
    component: ActivityRulePage,
    element: (
      <Layout
        path={BasePagePathObj.ActivityRulePage}
        component={ActivityRulePage}
      />
    ),
  },
  {
    path: BasePagePathObj.RewardsDetail,
    component: RewardsDetailPage,
    element: (
      <Layout
        path={BasePagePathObj.RewardsDetail}
        component={RewardsDetailPage}
      />
    ),
  },
  {
    path: BasePagePathObj.SharePage,
    component: SharePage,
    element: <Layout path={BasePagePathObj.SharePage} component={SharePage} />,
  },
  {
    path: BasePagePathObj.ActivityRecordPage,
    component: ActivityRecordPage,
    element: (
      <Layout
        path={BasePagePathObj.ActivityRecordPage}
        component={ActivityRecordPage}
      />
    ),
  },
  {
    path: BasePagePathObj.InviteWheelPage,
    component: InviteWheelPage,
    element: (
      <Layout
        path={BasePagePathObj.InviteWheelPage}
        component={InviteWheelPage}
      />
    ),
  },
  {
    path: BasePagePathObj.FullOrderDetailPage,
    component: FullOrderDetailPage,
    element: (
      <Layout
        path={BasePagePathObj.FullOrderDetailPage}
        component={FullOrderDetailPage}
      />
    ),
  },
  {
    path: BasePagePathObj.RechargeWheelPage,
    component: RechargeWheelPage,
    element: (
      <Layout
        path={BasePagePathObj.RechargeWheelPage}
        component={RechargeWheelPage}
      />
    ),
  },
  {
    path: BasePagePathObj.RechargeWheelRecordsPage,
    component: undefined,
    element: (
      <Layout
        path={BasePagePathObj.RechargeWheelRecordsPage}
        component={RechargeWheelRecordsPage}
      />
    ),
  },
  {
    path: BasePagePathObj.CustomizeCheckoutPage,
    component: WalletPage,
    element: (
      <Layout
        path={BasePagePathObj.CustomizeCheckoutPage}
        component={lazy(() => import('@pages/CustomizeCheckoutPage'))}
      />
    ),
  },
  {
    path: BasePagePathObj.GiftCodeRedeemPage,
    element: (
      <Layout
        path={BasePagePathObj.CustomizeCheckoutPage}
        component={GiftCodeRedeemPage}
      />
    ),
  },
  {
    path: '*',
    component: WalletPage,
    element: <Layout path="" component={UndefinedRoute} />,
  },
];

export default DEFAULT_ROUTES;
