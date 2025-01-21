import sdkUtils from '@mode2/utils/sdk';
import { Navigate, useLocation } from 'react-router-dom';

import { useEffect, useRef } from 'react';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { ROUTE_WHITE_LIST } from '@mode2/routerTypes/const';
import { useElementScroll } from '@commonUtils/useElementScroll';
import { useRoutesInterceptor } from '@mode2/usecase/useRoutesInterceptor';

/**
 * @description 路由守卫组件
 * */
export const AuthRouter = (props: { children: JSX.Element }) => {
  const { doInterceptor } = useRoutesInterceptor();
  const { scrollToTop } = useElementScroll();
  const location = useLocation();
  const isNeedLogin = !ROUTE_WHITE_LIST.find((v) => v === location.pathname);
  const isLoginPage = BasePagePathObj.LoginPage === location.pathname;
  const redirect = location.state?.redirect; //拦截路由 & 登录后重定向路由
  const from = useRef(BasePagePathObj.HallPage as string);

  //监听路由变化
  useEffect(() => {
    doInterceptor(location); //邀請碼攔截
    // 每次 route 切換都讓畫面置頂
    scrollToTop('');
  }, [location]);

  if (isLoginPage) {
    // * 優先判斷 login page，並且判斷是否已經登入
    return sdkUtils.isCurrentLogin() ? (
      <Navigate to={BasePagePathObj.HallPage} replace />
    ) : (
      props.children
    );
  } else if (sdkUtils.isCurrentLogin()) {
    // * 判断是否登录
    return redirect ? <Navigate to={redirect} replace /> : props.children;
  } else {
    if (isNeedLogin) {
      // 重定向到上一页路由，记录redirect，登录成功后跳转redirect指定的路由
      return (
        <Navigate
          to={from.current}
          state={{
            redirect: `${location.pathname}${location.search}`,
          }}
          replace
        />
      );
    } else {
      // 判断当前路由是否需要访问权限(不需要权限直接放行) & 记录当前路由
      from.current = `${location.pathname}${location.search}`;
      return props.children;
    }
  }
};
