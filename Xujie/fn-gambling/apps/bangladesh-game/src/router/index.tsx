import { createBrowserRouter } from 'react-router-dom';
import { FunctionComponent, lazy, Suspense } from 'react';
import TemplateLayout from '@templates/TemplateLayout';
import { AuthRouter } from './AuthRouter';
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
import { UndefinedRoute } from '@/router/UndefinedRoute';
import LoginPage from '@pages/LoginPage';

const Layout: FunctionComponent<{
  component: FunctionComponent;
}> = ({ component: Component }) => {
  return (
    // <Suspense fallback={<Loading />}>
    <Suspense
      fallback={<div className={'h-full w-full bgi-[var(--bg-main)]'} />}
    >
      <AuthRouter>
        <TemplateLayout>
          <Component />
        </TemplateLayout>
      </AuthRouter>
    </Suspense>
  );
};

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
  // {
  //   path: BasePagePathObj.RecortPage,
  //   element: <Layout component={RecortPage} />,
  // },
  {
    path: BasePagePathObj.ActivityPage,
    element: <Layout component={ActivityPage} />,
  },
  {
    path: BasePagePathObj.RecordPage,
    element: <Layout component={RecordPage} />,
  },
  // {
  //   path: BasePagePathObj.ModifyPage,
  //   element: <Layout component={lazy(() => import('@pages/ModifyPage'))} />,
  // },
  {
    path: BasePagePathObj.ChangePasswordPage,
    element: <Layout component={ChangePasswordPage} />,
  },
  // {
  //   path: BasePagePathObj.BindRechargePage,
  //   element: <Layout component={BindRechargePage} />,
  // },
  // {
  //   path: BasePagePathObj.BindBankPage,
  //   element: <Layout component={lazy(() => import('@pages/BindBankPage'))} />,
  // },
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
];

const router = createBrowserRouter([...DEFAULT_ROUTES, ...OFFICIAL_ROUTES]);
export default router;
