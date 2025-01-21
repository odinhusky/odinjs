import { BasePagePaths } from '@mode2/routerTypes/types';
import { useMenuAction } from '@mode2/action/components/menu/menuAction';
import { handleMenuRouterActionClick } from '@mode2/action/components/menu/actionType';
import { NavigateOptions } from 'react-router';
import { logout } from '@libs/mode2/usecase/useLogout';
import { useShowMenuStore } from '@libs/mode2/zustand/menuStore';
import { useNavigateClick } from '@libs/mode2/usecase/useNavPageClick';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';

export const useMenuBase = () => {
  const navigate = useNavigateClick();
  const { handleMenuClick } = useMenuAction();

  const handleMenuRouter = (path: BasePagePaths, options?: NavigateOptions) => {
    handleMenuClick({
      actionName: handleMenuRouterActionClick,
      payload: {
        callback: () => {
          navigate(path, options);
          useShowMenuStore.getState().closeMenu();
        },
      },
    });
  };
  const handleLogout = () => {
    handleMenuClick({
      actionName: handleMenuRouterActionClick,
      payload: {
        callback: () => {
          useShowMenuStore.getState().closeMenu();
          useMyPageStore.getState().setOpenMyDrawer(false);
          logout();
        },
      },
    });
  };

  return {
    handleMenuRouter,
    handleLogout,
  };
};
