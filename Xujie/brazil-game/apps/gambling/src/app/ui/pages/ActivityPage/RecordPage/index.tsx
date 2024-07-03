import { RecordPage as U1RecordPage } from './env/u1/RecordPage';
import { RecordPage as U2RecordPage } from './env/u2/RecordPage';
import { RecordPage as P1RecordPage } from './env/p1/RecordPage';
import { RecordPage as U5RecordPage } from './env/u5/RecordPage';
import { RecordPage as U6RecordPage } from './env/u6';
import { RecordPage as U7RecordPage } from './env/u7';
import React, { useEffect } from 'react';
import { renderByUVersion } from '../../../utils/renderByUVersion';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../reduxStore';
import { PageOrModalPathEnum } from '../../../PageOrModalPathEnum';
import { useNavigate } from 'react-router';

export const RecordPage = () => {
  const navigate = useNavigate();
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  useEffect(() => {
    if (!isLogin) {
      navigate(PageOrModalPathEnum.ActivityHallPage);
      return;
    }
  }, [isLogin]);

  return renderByUVersion(
    {
      u1: <U1RecordPage />,
      u2: <U2RecordPage />,
      u5: <U5RecordPage />,
      p1: <P1RecordPage />,
      u6: <U6RecordPage />,
      u7: <U7RecordPage />,
    },
    <U1RecordPage />
  );
};
