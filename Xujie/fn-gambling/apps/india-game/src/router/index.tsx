import { createBrowserRouter } from 'react-router-dom';
import { FunctionComponent, lazy } from 'react';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { OfficialRoute } from '@/router/OfficialRoute';
import WalletPage from '@pages/WalletPage';
import InvitePage from '@pages/InvitePage';
import ActivityPage from '@pages/ActivityPage';
import RecordPage from '@pages/RecordPage';
import ChangePasswordPage from '@pages/ChangePasswordPage';
import BindKYCPage from '@pages/BindKYCPage';
import HallPage from '@pages/HallPage';
import WebviewPage from '@pages/WebviewPage';
import PolicyPage from '@pages/PolicyPage';
import MoreGamePage from '@pages/MoreGamePage';
import FeedBackPage from '@pages/FeedBackPage';
import MyPage from '@pages/MyPage';
import LoginPage from '@pages/LoginPage';
import { UndefinedRoute } from '@/router/UndefinedRoute';
import TeamClubPage from '@pages/TeamClubPage';
import RewardsDetailPage from '@pages/RewardsDetailPage';
import SharePage from '@pages/SharePage';
import SubordinateDataPage from '@pages/SubordinateDataPage';
import ActivityRecordPage from '@pages/ActivityRecordPage';
import InviteWheelPage from '@pages/InviteWheelPage';
import RechargeWheelPage from '@pages/RechargeWheelPage';
import RechargeWheelRecordsPage from '@pages/RechargeWheelRecordsPage';
import ActivityRulePage from '@pages/ActivityRulePage';
import FullOrderDetailPage from '@pages/FullOrderDetailPage';
import { Layout } from './Layout';

const OfficialLayout: FunctionComponent<{
  component: FunctionComponent;
}> = ({ component: Component }) => {
  return (
    <OfficialRoute>
      <Component />
    </OfficialRoute>
  );
};

export const DEFAULT_ROUTES = [
  {
    path: BasePagePathObj.WalletPage,
    element: <Layout component={WalletPage} />,
  },
  {
    path: BasePagePathObj.InvitePage,
    element: <Layout component={InvitePage} />,
  },
  {
    path: BasePagePathObj.MyPage,
    element: <Layout component={MyPage} />,
  },
  {
    path: BasePagePathObj.LoginPage,
    element: <Layout component={LoginPage} />,
  },
  {
    path: BasePagePathObj.ActivityPage,
    element: <Layout component={ActivityPage} />,
  },
  {
    path: BasePagePathObj.RecordPage,
    element: <Layout component={RecordPage} />,
  },
  {
    path: BasePagePathObj.ChangePasswordPage,
    element: <Layout component={ChangePasswordPage} />,
  },
  {
    path: BasePagePathObj.BindKYCPage,
    element: <Layout component={BindKYCPage} />,
  },
  //UNAUTH_ROUTES
  {
    path: BasePagePathObj.HallPage,
    element: <Layout component={HallPage} />,
  },
  {
    path: BasePagePathObj.GamePage,
    element: <Layout component={WebviewPage} />,
  },
  {
    path: BasePagePathObj.GameLobbyPage,
    element: <Layout component={WebviewPage} />,
  },
  {
    path: BasePagePathObj.PolicyPage,
    element: <Layout component={PolicyPage} />,
  },
  {
    path: BasePagePathObj.FeedBackPage,
    element: <Layout component={FeedBackPage} />,
  },
  {
    path: BasePagePathObj.MoreGamePage,
    element: <Layout component={MoreGamePage} />,
  },
  {
    path: BasePagePathObj.SubordinateDataPage,
    element: <Layout component={SubordinateDataPage} />,
  },
  {
    path: BasePagePathObj.TeamClubPage,
    element: <Layout component={TeamClubPage} />,
  },
  {
    path: BasePagePathObj.ActivityRulePage,
    element: <Layout component={ActivityRulePage} />,
  },
  {
    path: BasePagePathObj.RewardsDetail,
    element: <Layout component={RewardsDetailPage} />,
  },
  {
    path: BasePagePathObj.SharePage,
    element: <Layout component={SharePage} />,
  },
  {
    path: BasePagePathObj.ActivityRecordPage,
    element: <Layout component={ActivityRecordPage} />,
  },
  {
    path: BasePagePathObj.InviteWheelPage,
    element: <Layout component={InviteWheelPage} />,
  },
  {
    path: BasePagePathObj.FullOrderDetailPage,
    element: <Layout component={FullOrderDetailPage} />,
  },
  {
    path: BasePagePathObj.RechargeWheelPage,
    element: <Layout component={RechargeWheelPage} />,
  },
  {
    path: BasePagePathObj.RechargeWheelRecordsPage,
    element: <Layout component={RechargeWheelRecordsPage} />,
  },
  {
    path: BasePagePathObj.CustomizeCheckoutPage,
    element: (
      <Layout component={lazy(() => import('@pages/CustomizeCheckoutPage'))} />
    ),
  },
  {
    path: '*',
    element: <Layout component={UndefinedRoute} />,
  },
];

/**
 * 官網，PWA 引導安裝畫面
 */
export const OFFICIAL_ROUTES = [
  {
    path: BasePagePathObj.OfficialWebsite,
    element: (
      <OfficialLayout component={lazy(() => import('@pages/OfficialPage'))} />
    ),
  },
  {
    path: BasePagePathObj.PwaInstallGuide,
    element: (
      <OfficialLayout
        component={lazy(() => import('@pages/PwaInstallGuidePage'))}
      />
    ),
  },
  {
    path: BasePagePathObj.PopPage,
    element: (
      <OfficialLayout component={lazy(() => import('@pages/PopPage'))} />
    ),
  },
];

const router = createBrowserRouter([...DEFAULT_ROUTES, ...OFFICIAL_ROUTES]);
export default router;
