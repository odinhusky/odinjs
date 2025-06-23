import { lazy } from 'react';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import Layout from '@templates/Layout';
import UndefinedRoute from '@/router/UndefinedRoute';

// 不進行 Lazy 處理
import HallPage from '@pages/HallPage';
import ActivityPage from '@pages/ActivityPage';
import InviteWheelPage from '@pages/InviteWheelPage';
import TeamClubPage from '@pages/TeamClubPage';
import MyPage from '@pages/MyPage';
import InboxDetailPage from '@pages/InboxDetailPage';
import FeedBackPage from '@pages/FeedBackPage';
import TaskCenterPage from '@pages/TaskCenterPage';
import WalletPage from '@pages/WalletPage';
import WebviewPage from '@pages/WebviewPage';
import MoreGamePage from '@pages/MoreGamePage';

// 要進行 Lazy
// import LoginPage from '@pages/LoginPage';
// import RecordPage from '@pages/RecordPage';
// import ChangePasswordPage from '@pages/ChangePasswordPage';
// import BindKYCPage from '@pages/BindKYCPage';
// import PolicyPage from '@pages/PolicyPage';
// import SubordinateDataPage from '@pages/SubordinateDataPage';
// import ActivityRulePage from '@pages/ActivityRulePage';
// import RewardsDetailPage from '@pages/RewardsDetailPage';
// import SharePage from '@pages/SharePage';
// import ActivityRecordPage from '@pages/ActivityRecordPage';
// import FullOrderDetailPage from '@pages/FullOrderDetailPage';
// import RechargeWheelPage from '@pages/RechargeWheelPage';
// import RechargeWheelRecordsPage from '@pages/RechargeWheelRecordsPage';
// import GiftCodeRedeemPage from '@pages/GiftCodeRedeemPage';
// import OrderDetailPage from '@pages/OrderDetailPage';
// import AccountPage from '@pages/AccountPage';
// import WalletGuidePage from '@pages/WalletGuidePage';
// import SettingPage from '@pages/SettingPage';
// import VipPage from '@pages/VipPage';
// import VipBonusPage from '@pages/VipBonusPage';
// import RankingPage from '@pages/RankingPage';
// import ActivityDetailPage from '@pages/ActivityDetailPage';
// import SearchGamePage from '@pages/SearchGamePage';
// import RechargeSecretPage from '@pages/RechargeSecretPage';
// import LowBalanceRescueBoxPage from '@pages/LowBalanceRescueBoxPage';

const LoginPage = lazy(() => import('@pages/LoginPage'));
const RecordPage = lazy(() => import('@pages/RecordPage'));
const ChangePasswordPage = lazy(() => import('@pages/ChangePasswordPage'));
const BindKYCPage = lazy(() => import('@pages/BindKYCPage'));
const PolicyPage = lazy(() => import('@pages/PolicyPage'));
const SubordinateDataPage = lazy(() => import('@pages/SubordinateDataPage'));
const ActivityRulePage = lazy(() => import('@pages/ActivityRulePage'));
const RewardsDetailPage = lazy(() => import('@pages/RewardsDetailPage'));
const SharePage = lazy(() => import('@pages/SharePage'));
const ActivityRecordPage = lazy(() => import('@pages/ActivityRecordPage'));
const FullOrderDetailPage = lazy(() => import('@pages/FullOrderDetailPage'));
const RechargeWheelPage = lazy(() => import('@pages/RechargeWheelPage'));
const RechargeWheelRecordsPage = lazy(
  () => import('@pages/RechargeWheelRecordsPage')
);
const GiftCodeRedeemPage = lazy(() => import('@pages/GiftCodeRedeemPage'));
const OrderDetailPage = lazy(() => import('@pages/OrderDetailPage'));
const AccountPage = lazy(() => import('@pages/AccountPage'));
const SettingPage = lazy(() => import('@pages/SettingPage'));
const VipPage = lazy(() => import('@pages/VipPage'));
const VipBonusPage = lazy(() => import('@pages/VipBonusPage'));
const RankingPage = lazy(() => import('@pages/RankingPage'));
const ActivityDetailPage = lazy(() => import('@pages/ActivityDetailPage'));
const SearchGamePage = lazy(() => import('@pages/SearchGamePage'));
const WalletGuidePage = lazy(() => import('@pages/WalletGuidePage'));
const RechargeSecretPage = lazy(() => import('@pages/RechargeSecretPage'));
const LowBalanceRescueBoxPage = lazy(
  () => import('@pages/LowBalanceRescueBoxPage')
);

export const DEFAULT_ROUTES = [
  {
    path: BasePagePathObj.WalletPage,
    component: WalletPage,
    element: (
      <Layout path={BasePagePathObj.WalletPage} component={WalletPage} />
    ),
  },
  // {
  //   path: BasePagePathObj.InvitePage,
  //   component: InvitePage,
  //   element: (
  //     <Layout path={BasePagePathObj.InvitePage} component={InvitePage} />
  //   ),
  // },
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
    path: BasePagePathObj.VipPage,
    component: VipPage,
    element: <Layout path={BasePagePathObj.VipPage} component={VipPage} />,
  },
  {
    path: BasePagePathObj.VipBonusPage,
    component: VipBonusPage,
    element: (
      <Layout path={BasePagePathObj.VipBonusPage} component={VipBonusPage} />
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

  //  ---- new for v6 start -----
  {
    path: BasePagePathObj.AccountPage,
    element: (
      <Layout path={BasePagePathObj.AccountPage} component={AccountPage} />
    ),
  },
  {
    path: BasePagePathObj.WalletGuidePage,
    element: (
      <Layout
        path={BasePagePathObj.WalletGuidePage}
        component={WalletGuidePage}
      />
    ),
  },
  {
    path: BasePagePathObj.SettingPage,
    element: (
      <Layout path={BasePagePathObj.SettingPage} component={SettingPage} />
    ),
  },
  // {
  //   path: BasePagePathObj.GameSupplierListPage,
  //   element: (
  //     <Layout
  //       path={BasePagePathObj.GameSupplierListPage}
  //       component={GameSupplierListPage}
  //     />
  //   ),
  // },
  {
    path: BasePagePathObj.OrderDetailPage,
    element: (
      <Layout
        path={BasePagePathObj.OrderDetailPage}
        component={OrderDetailPage}
      />
    ),
  },
  {
    path: BasePagePathObj.RankingPage,
    element: (
      <Layout path={BasePagePathObj.RankingPage} component={RankingPage} />
    ),
  },
  {
    path: BasePagePathObj.ActivityDetailPage,
    element: (
      <Layout
        path={BasePagePathObj.ActivityDetailPage}
        component={ActivityDetailPage}
      />
    ),
  },
  {
    path: BasePagePathObj.TaskCenterPage,
    element: (
      <Layout
        path={BasePagePathObj.TaskCenterPage}
        component={TaskCenterPage}
      />
    ),
  },
  {
    path: BasePagePathObj.SearchGamePage,
    component: SearchGamePage,
    element: (
      <Layout
        path={BasePagePathObj.SearchGamePage}
        component={SearchGamePage}
      />
    ),
  },
  {
    path: BasePagePathObj.InboxDetailPage,
    component: InboxDetailPage,
    element: (
      <Layout
        path={BasePagePathObj.InboxDetailPage}
        component={InboxDetailPage}
      />
    ),
  },
  // TODO Evan 特殊充值通道
  {
    path: BasePagePathObj.RechargeSecretPage,
    component: RechargeSecretPage,
    element: (
      <Layout
        path={BasePagePathObj.RechargeSecretPage}
        component={RechargeSecretPage}
      />
    ),
  },
  // TODO Evan 破產獎勵寶箱
  {
    path: BasePagePathObj.LowBalanceRescueBoxPage,
    component: LowBalanceRescueBoxPage,
    element: (
      <Layout
        path={BasePagePathObj.LowBalanceRescueBoxPage}
        component={LowBalanceRescueBoxPage}
      />
    ),
  },
  //  ---- new for v6 end -----

  {
    path: '*',
    component: WalletPage,
    element: <Layout path="" component={UndefinedRoute} />,
  },
];

export default DEFAULT_ROUTES;
