import { renderByUVersion } from '../utils/renderByUVersion';
import { AppRouter as U1AppRouter } from './env/u1/Router';
import { AppRouter as U2AppRouter } from './env/u2/Router';
import { AppRouter as P1AppRouter } from './env/p1/Router';
import { useEffect } from 'react';
import { PageOrModalPathEnum } from '../PageOrModalPathEnum';
import { useLocation, useNavigate } from 'react-router';
import useBreakpoint from '../pageTemplate/hooks/useBreakpoint';
import { AppRouter as U5AppRouter } from './env/u5/Router';
import { AppRouter as U6AppRouter } from './env/u6/Router';
import { AppRouter as U7AppRouter } from './env/u7/Router';
import { AppRouter as U9AppRouter } from './env/u9/Router';

export const AppRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDesktop } = useBreakpoint();

  useEffect(() => {
    if (isDesktop) {
      if (
        location.pathname === PageOrModalPathEnum.MyPage ||
        location.pathname === PageOrModalPathEnum.NotificationPage
      ) {
        navigate(PageOrModalPathEnum.IndexPage);
      }
    }
  }, [isDesktop, location.pathname]);

  return renderByUVersion(
    {
      p1: <P1AppRouter />,
      u1: <U1AppRouter />,
      u2: <U2AppRouter />,
      u5: <U5AppRouter />,
      u6: <U6AppRouter />,
      u7: <U7AppRouter />,
      u9: <U9AppRouter />,
    },
    <U1AppRouter />
  );
};
