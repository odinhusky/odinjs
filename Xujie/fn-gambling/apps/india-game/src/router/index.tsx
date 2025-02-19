import { createBrowserRouter } from 'react-router-dom';

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

console.log('!! DEFAULT_ROUTES_OBJ', DEFAULT_ROUTES_OBJ);

/**
 * 官網，PWA 引導安裝畫面
 */
// export const OFFICIAL_ROUTES = [
//   {
//     path: BasePagePathObj.OfficialWebsite,
//     element: (
//       <OfficialLayout component={lazy(() => import('@pages/OfficialPage'))} />
//     ),
//   },
//   {
//     path: BasePagePathObj.PwaInstallGuide,
//     element: (
//       <OfficialLayout
//         component={lazy(() => import('@pages/PwaInstallGuidePage'))}
//       />
//     ),
//   },
//   {
//     path: BasePagePathObj.PopPage,
//     element: (
//       <OfficialLayout component={lazy(() => import('@pages/PopPage'))} />
//     ),
//   },
// ];

const router = createBrowserRouter([...DEFAULT_ROUTES, ...OFFICIAL_ROUTES]);
export default router;
