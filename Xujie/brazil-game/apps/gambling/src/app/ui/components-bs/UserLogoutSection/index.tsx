import { useDispatch } from 'react-redux';
import { appSlice } from '../../../reduxStore/appSlice';
import { useNavigate } from 'react-router';
import { PageOrModalPathEnum } from '../../PageOrModalPathEnum';
import { userLogout } from '../../../usecase/userLogout';

import P1UserLogoutSection from './env/p1/P1UserLogoutSection';
import U5UserLogoutSection from './env/u5/U5UserLogoutSection';
import U6UserLogoutSection from './env/u6/U6UserLogoutSection';

import DefaultLogoutSection from './env/default/DefaultLogoutSection';

import { renderByUVersion } from '../../utils/renderByUVersion';
import { uiSlice } from '../../../reduxStore/uiSlice';

export interface IUserLogoutSectionProps {
  onHandleCancel: () => void;
  onHandleLogout: () => void;
}

type ILogoutPopover = {
  className?: string;
};

export const LogoutSection = (props: ILogoutPopover) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onHandleCancel = () => {
    dispatch(appSlice.actions.showMobileLogoutModal(false));
  };
  const onHandleLogout = () => {
    userLogout();
    dispatch(appSlice.actions.showMobileLogoutModal(false));
    dispatch(uiSlice.actions.closeUserInfoStatusPopover());
    navigate(PageOrModalPathEnum.IndexPage);
  };

  const defaultProps = {
    onHandleCancel,
    onHandleLogout,
  };

  return renderByUVersion(
    {
      p1: <P1UserLogoutSection {...defaultProps} />,
      u5: <U5UserLogoutSection {...defaultProps} />,
      u6: <U6UserLogoutSection {...defaultProps} />,
    },
    <DefaultLogoutSection {...defaultProps} />
  );
};
