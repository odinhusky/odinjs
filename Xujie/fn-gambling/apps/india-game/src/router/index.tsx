import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { FunctionComponent } from 'react';
import DEFAULT_ROUTES from '@router/Default';
import OFFICIAL_ROUTES from '@router/Official';

export const DEFAULT_ROUTES_OBJ: Record<string, FunctionComponent> =
  DEFAULT_ROUTES.reduce((acc, cur) => {
    if (cur.path === '*') return acc;

    return {
      ...acc,
      [cur.path]: cur.component,
    };
  }, {});

// 過濾啟用的路由
const getEnabledRoutes = (
  routes: Array<{ path: string; enabled?: boolean; element: React.ReactNode }>
) => routes.filter((route) => route.enabled ?? true);

const routes: RouteObject[] = [
  ...DEFAULT_ROUTES,
  ...getEnabledRoutes(OFFICIAL_ROUTES),
];

const router = createBrowserRouter(routes);
export default router;
