import { BasePagePaths } from '@mode2/routerTypes/types';
import { useMenuAction } from '@mode2/action/components/menu/menuAction';
import { handleMenuRouterActionClick } from '@mode2/action/components/menu/actionType';
import { NavigateOptions } from 'react-router';
import { useShowMenuStore } from '@libs/mode2/zustand/menuStore';
import { useNavigateClick } from '@libs/mode2/usecase/useNavPageClick';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

export const useMenuBase = () => {
  const navigate = useNavigateClick();
  const { handleMenuClick } = useMenuAction();
  const setIsLogoutWeakTipsModalShow = useUserProfileStore(
    (state) => state.setIsLogoutWeakTipsModalShow
  );

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
          console.log('!! handleLogout');
          useShowMenuStore.getState().closeMenu();
          useMyPageStore.getState().setOpenMyDrawer(false);
          setIsLogoutWeakTipsModalShow(true);
        },
      },
    });
  };

  return {
    handleMenuRouter,
    handleLogout,
  };
};
