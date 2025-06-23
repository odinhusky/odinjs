import React, { FunctionComponent, Suspense } from 'react';
import { BasePagePaths } from '@mode2/routerTypes/types';
import TemplateLayout from '@templates/TemplateLayout';
import useObserverDeviceBreakPoint from '@mode2/usecase/device/useObserverDeviceBreakPoint';
import useAuthRouterGuard from '@mode2/usecase/router/useAuthRouterGuard';
import { useObserverLocation } from '@mode2/usecase/location/useObserverLocation';
import ROUTE_WHITE_LIST from '@router/WhiteList';
import { formatMoneyAbbrev4Digits } from '@libs/mode2/utils';

export const Layout: FunctionComponent<{
  component: FunctionComponent;
  path: BasePagePaths | string;
  hasTemp?: boolean;
}> = ({ component: Component, hasTemp = true }) => {
  const TemplateWrapper = hasTemp ? TemplateLayout : React.Fragment;

  // TODO Evan 已降低剩3次,
  // TODO Evan const { refreshUserState } = useUserState() 還是需要再優化
  // 移動到 [in][mode4] TemplateLayout
  // const { refreshUserState } = useUserState(); // TODO Evan +3 渲染次數，需重構
  useObserverLocation(); // 無增加
  useObserverDeviceBreakPoint(); // 無增加渲染次數
  // TODO Evan useAuthRouterGuard 已降低剩2次,
  useAuthRouterGuard(ROUTE_WHITE_LIST); // TODO Evan +5 渲染次數，需要重構
  // 移動到 [in][mode4] TemplateLayout
  // usePlayerRegister({
  //   refreshUserState,
  // }); // TODO Evan + 2~3渲染次數

  // console.log('!! Render Layout', formatMoneyAbbrev4Digits({ num: 2000000 }));

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
