import cx from '../../../../utils/cx';
import { useDispatch } from 'react-redux';
import { appSlice } from '../../../../../reduxStore/appSlice';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { userLogout } from '../../../../../usecase/userLogout';
import { useNavigate } from 'react-router';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import createNotification from '../../../../components-bs/ProgressBarNotification';
import { useState } from 'react';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { U7Modal } from '../../../UModal/u7/U7Modal';
import t from 'apps/gambling/src/assets/constant/lang';
import {
  FLEX_COL,
  FLEX_ITEMS_CENTER,
} from 'apps/gambling/src/assets/constant/style';
import U7OutlinedBtn from '../../../../components-bs/Buttons/env/u7/U7OutlinedBtn';
import U7Linear1Btn from '../../../../components-bs/Buttons/env/u7/U7Linear1Btn';

export const U2LogoutModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isDesktop } = useBreakpoint();
  const [notify, setNotify] = useState(false);

  const onClose = () => {
    dispatch(appSlice.actions.showMobileLogoutModal(false));
  };
  const onHandleLogout = () => {
    createNotification({
      message: 'Desconectado com sucesso',
      isOpen: notify,
      onClose() {
        setNotify(!notify);
      },
      isDesktop: isDesktop,
    });
    setTimeout(() => {
      userLogout();
      dispatch(appSlice.actions.showMobileLogoutModal(false));
      dispatch(uiSlice.actions.closeUserInfoStatusPopover());
      navigate(PageOrModalPathEnum.IndexPage);
    }, 1000);
  };

  const btnClass = cx('tablet:h-[28px]', 'text-sm leading-[18px]');

  return (
    <U7Modal 
      baseModalClass={cx('tablet:block tablet:bg-transparent')}
      containerClass={cx('tablet:absolute tablet:left-1 tablet:bottom-16')}
      modalClass={cx('tablet:py-2 tablet:px-4 tablet:max-w-[244px]')}
      isShowClose={false}
      onClose={onClose}
    >
      <div className={cx(FLEX_COL, 'gap-4 tablet:gap-2')}>
        <h6
          className={cx(
            'font-medium text-[var(--grayscale-100)] text-center',
            'text-lg leading-6',
            'tablet:text-base tablet:leading-5'
          )}
        >
          {t['confirmLogoutU7']}
        </h6>

        <div className={cx(FLEX_ITEMS_CENTER, 'gap-4')}>
          <U7OutlinedBtn className={cx(btnClass)} onClick={onClose}>
            {t['Cancel']}
          </U7OutlinedBtn>

          <U7Linear1Btn className={cx(btnClass)} onClick={onHandleLogout}>
            {t['Confirm']}
          </U7Linear1Btn>
        </div>
      </div>
    </U7Modal>
  );
};

export default U2LogoutModal;
