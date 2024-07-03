import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxStore';
import { useNavigate } from 'react-router';
import { PageOrModalPathEnum } from '../../PageOrModalPathEnum';
import { useEffect } from 'react';

export const useAllowLoginRouterRules = () => {
  const navigate = useNavigate();
  const isLogin = useSelector((state: RootState) => state.app.isLogin);

  useEffect(() => {
    if (!isLogin) {
      navigate(PageOrModalPathEnum.IndexPage);
    }
  }, [isLogin]);

  return {};
};
