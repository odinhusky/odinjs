import { useNavigate } from 'react-router-dom';
import { useElementScroll } from '@commonUtils/useElementScroll';
import { DEFAULT_ROUTE_WHITE_LIST } from '@mode2/routerTypes/const';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useEffect, useRef } from 'react';
import sdkUtils from '@mode2/utils/sdk';
import { useRoutesInterceptor } from '@mode2/usecase/router/useRoutesInterceptor';
import { useLocationStore } from '@mode2/zustand/locationStore';

export const useAuthRouterGuard = (
  whiteList: string[] = DEFAULT_ROUTE_WHITE_LIST
) => {
  const navigate = useNavigate();
  const { doInterceptor } = useRoutesInterceptor();
  const { scrollToTop } = useElementScroll();
  // const { navToLoginPage } = useNavPageClick();
  const location = useLocationStore((state) => state.location);
  // const location = useLocation();
  // const isNeedLogin = location
  //   ? !whiteList.find((v) => v === location.pathname)
  //   : false;

  // const isLoginPage = useMemo(() => {
  //   const state = location
  //     ? BasePagePathObj.LoginPage === location.pathname
  //     : false;
  //   return state;
  // }, [location]);

  // const isLoginPage = location
  //   ? BasePagePathObj.LoginPage === location.pathname
  //   : false;
  // const redirect = location?.state?.redirect; //拦截路由 & 登录后重定向路由
  const from = useRef(BasePagePathObj.HallPage as string);

  useEffect(() => {
    if (!location) return;
    location && doInterceptor(location); //邀請碼攔截
    // 每次 route 切換都讓畫面置頂
    scrollToTop('');
    const isLoginPage = location
      ? BasePagePathObj.LoginPage === location.pathname
      : false;
    if (isLoginPage) {
      // * 優先判斷 login page，並且判斷是否已經登入
      if (sdkUtils.isCurrentLogin()) {
        navigate(BasePagePathObj.HallPage, { replace: true });
      }
      return;
    }
    const isNeedLogin = location
      ? !whiteList.find((v) => v === location.pathname)
      : false;
    if (!sdkUtils.isCurrentLogin() && isNeedLogin) {
      if (location?.pathname != BasePagePathObj.HallPage) {
        navigate(BasePagePathObj.HallPage, { replace: true });
      }
    } else {
      from.current = `${location?.pathname}${location?.search}`;
    }
  }, [location]);

  // if (isLoginPage) {
  //   // navigate(BasePagePathObj.HallPage, { replace: true });
  //   // * 優先判斷 login page，並且判斷是否已經登入
  //   if (sdkUtils.isCurrentLogin()) {
  //     navigate(BasePagePathObj.HallPage, { replace: true });
  //   }
  //   //   return sdkUtils.isCurrentLogin() ? (
  //   //     <Navigate to={BasePagePathObj.HallPage} replace />
  //   // ) : (
  //   //     props.children
  //   //   );
  // } else if (sdkUtils.isCurrentLogin()) {
  //   // * 判断是否登录
  //
  //   if (redirect) {
  //     navigate(redirect, { replace: true });
  //   }
  //   // return redirect ? <Navigate to={redirect} replace /> : props.children;
  // } else {
  //   if (isNeedLogin) {
  //     // 不是在首頁先導航到首頁
  //     if (location?.pathname != BasePagePathObj.HallPage) {
  //       navigate(BasePagePathObj.HallPage, { replace: true });
  //     }
  //     // navToLoginPage(1);
  //   } else {
  //     // 判断当前路由是否需要访问权限(不需要权限直接放行) & 记录当前路由
  //     from.current = `${location?.pathname}${location?.search}`;
  //     // return props.children;
  //   }
  // }
};

export default useAuthRouterGuard;
