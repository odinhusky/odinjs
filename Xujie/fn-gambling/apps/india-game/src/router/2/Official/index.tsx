import { BasePagePathObj } from '@mode2/routerTypes/types';
import OfficialLayout from '@templates/OfficialLayout';
import { lazy } from 'react';
import { useFeatureFlagEnabled } from 'posthog-js/react';

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
  {
    path: BasePagePathObj.LottiePreviewPage,
    // enabled :useFeatureFlagEnabled('lottie_preview'),
    // enabled: import.meta.env.DEV, // 只在dev啟用該頁面
    element: (
      <OfficialLayout
        component={lazy(() => import('@pages/LottiePreviewPage'))}
      />
    ),
  },
];

export default OFFICIAL_ROUTES;
