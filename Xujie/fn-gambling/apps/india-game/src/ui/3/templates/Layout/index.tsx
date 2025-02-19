import React, { FunctionComponent, Suspense } from 'react';
import { BasePagePaths } from '@mode2/routerTypes/types';
import TemplateLayout from '@templates/TemplateLayout';
import useObserverDeviceBreakPoint from '@mode2/usecase/device/useObserverDeviceBreakPoint';
import useAuthRouterGuard from '@mode2/usecase/router/useAuthRouterGuard';
import { useObserverLocation } from '@mode2/usecase/location/useObserverLocation';
import usePlayerRegister from '@libs/mode2/usecase/playerMode/usePlayerRegister';
import { useUserState } from '@/usecase/useUserState';
import ROUTE_WHITE_LIST from '@router/WhiteList';

export const Layout: FunctionComponent<{
  component: FunctionComponent;
  path: BasePagePaths | string;
  hasTemp?: boolean;
}> = ({ component: Component, hasTemp = true }) => {
  const TemplateWrapper = hasTemp ? TemplateLayout : React.Fragment;
  const { refreshUserState } = useUserState();
  useObserverLocation();
  useObserverDeviceBreakPoint();
  useAuthRouterGuard(ROUTE_WHITE_LIST);
  usePlayerRegister({
    refreshUserState,
  });

  return (
    // <Suspense fallback={<Loading />}>
    <Suspense
      fallback={<div className={'h-full w-full bgi-[var(--bg-main)]'} />}
    >
      <TemplateWrapper>
        <Component />
      </TemplateWrapper>
    </Suspense>
  );
};

export default Layout;
