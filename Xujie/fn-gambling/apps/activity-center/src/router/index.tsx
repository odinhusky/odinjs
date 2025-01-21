import { createBrowserRouter, Navigate } from 'react-router-dom';
import { FunctionComponent, lazy } from 'react';
import { AuthRouter } from './AuthRouter';
export enum BasePagePathObj {
  RedEnvelopeRainPage = 'red_envelope_rain',
}
const Layout: FunctionComponent<{
  component: FunctionComponent;
}> = ({ component: Component }) => {
  return (
    <AuthRouter>
      <Component />
    </AuthRouter>
  );
};

export const DEFAULT_ROUTES = [
  {
    path: '/',
    element: <Navigate to={BasePagePathObj.RedEnvelopeRainPage} />,
  },
  {
    path: BasePagePathObj.RedEnvelopeRainPage,
    element: (
      <Layout component={lazy(() => import('@pages/RedEnvelopeRain'))} />
    ),
  },
];

const router = createBrowserRouter(DEFAULT_ROUTES);
export default router;
