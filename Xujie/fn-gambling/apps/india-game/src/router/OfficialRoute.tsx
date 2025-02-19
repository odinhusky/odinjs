import { Navigate, useLocation } from 'react-router-dom';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import sdkUtils from '@mode2/utils/sdk';
import { useEffect } from 'react';
import { useRoutesInterceptor } from '@mode2/usecase/router/useRoutesInterceptor';
import useAvoidApkRecycling from '@mode2/usecase/useAvoidApkRecycling';

export const OfficialRoute = (props: { children: JSX.Element }) => {
  // 避免 apk GC
  useAvoidApkRecycling();
  const location = useLocation();
  const { doInterceptor } = useRoutesInterceptor();
  /**
   * 官網 ＆ PWA 引導安裝畫面
   */
  const blockList = [
    `${BasePagePathObj.OfficialWebsite}`,
    `${BasePagePathObj.PwaInstallGuide}`,
  ];

  /**
   * 是否重定向邏輯，
   * 如果在android apk 內 sdkUtils.isInNative()
   * 如果在 PWA 內 sdkUtils.isPwaInstalled()
   */
  const isRedirect =
    blockList.includes(location.pathname) &&
    (sdkUtils.isInNative() || sdkUtils.isPwaInstalled());

  useEffect(() => {
    console.log('location===>', location);
    doInterceptor(location); //邀請碼攔截
  }, [location]);

  return isRedirect ? (
    <Navigate to={BasePagePathObj.HallPage} replace />
  ) : (
    props.children
  );
};
