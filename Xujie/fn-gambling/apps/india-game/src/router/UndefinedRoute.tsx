import { Navigate, useLocation } from 'react-router-dom';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useRoutesInterceptor } from '@mode2/usecase/router/useRoutesInterceptor';

export const UndefinedRoute = () => {
  const location = useLocation();
  const { doInterceptor } = useRoutesInterceptor();
  doInterceptor(location);

  const match = location.pathname.match(/\/deeplink\/(.*)/);
  const param = location.search;
  if (match && match[1]) {
    window.webDeepLink(`/${match[1]}`, param);
  }

  return <Navigate to={BasePagePathObj.HallPage}></Navigate>;
};

export default UndefinedRoute;
