import { Navigate, useLocation } from 'react-router-dom';
import { BasePagePathObj } from '@mode2/routerTypes/types';
import { useRoutesInterceptor } from '@mode2/usecase/useRoutesInterceptor';

export const UndefinedRoute = () => {
  const location = useLocation();
  const { doInterceptor } = useRoutesInterceptor();
  doInterceptor(location);
  return <Navigate to={BasePagePathObj.HallPage}></Navigate>;
};
