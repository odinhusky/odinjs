import React, { FunctionComponent } from 'react';
import { BasePagePaths } from '@mode2/routerTypes/types';

export const Layout: FunctionComponent<{
  component: FunctionComponent;
  path: BasePagePaths | string;
  hasTemp?: boolean;
}> = ({ component: Component, hasTemp = true }) => {
  return <Component />;
};

export default Layout;
