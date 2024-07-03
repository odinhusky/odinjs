import React from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';

import useBreakpoint from '../../../hooks/useBreakpoint';
import { RootState } from '../../../../../reduxStore';
import { environment } from '../../../../../../environments/environment';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import { UserMoneyStatusSection } from '../../UserMoneyStatusSection';
import { RegisterButton } from '../../../../components-bs/Buttons/RegisterButton';
import { MessageCountBadge } from '../../../../components/MessageCountBadge';
import { MenuIcon } from '../../../../components-bs/Icons/MenuIcon';
import { IMobileHeader } from '../../types/IMobileHeader';
import { appSlice } from '../../../../../reduxStore/appSlice';

export const MobileHeader = (props: IMobileHeader) => {
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const messageCount = useSelector(
    (state: RootState) => state.app.messageCount
  );

  return (
    <header
      className={cx(
        'w-full h-[52.5px] px-4 z-20',
        'flex flex-row items-center justify-between',
        'bg-[var(--primary-variant)]',
        // border-bottom: 1px solid rgba(11,28,64,.77);
        {
          'fixed top-0': isMobile,
        },
        // "border-b-[1px] border-[var(--varient)]",
        'border-b-[1px] border-[#0b1c40c4]',
        props.className
      )}
    >
      <div className={'flex flex-row justify-between items-center w-full'}>
        <div
          className={'mr-4'}
          onClick={() => {
            props.clickToOpenMenuDrawer();
          }}
        >
          <MenuIcon />
        </div>

        {!isLogin && (
          <section>
            <RegisterButton
              onClick={() => {
                dispatch(appSlice.actions.showLoginDrawerOrModal(true));
                dispatch(appSlice.actions.setLoginUIStatusType('register'));
                // props.clickToOpenUserLoginStatusModal();
              }}
            >
              Registar Conta
            </RegisterButton>
          </section>
        )}

        {isLogin && (
          <div className="flex gap-4">
            <UserMoneyStatusSection />
            <div
              className="flex items-center relative"
              onClick={() => navigate(PageOrModalPathEnum.NotificationPage)}
            >
              <img
                className="w-8 h-8 object-cover"
                alt="notification"
                src={`assets/${environment.uVersion}/${environment.mVersion}/icon_notification.png`}
              />
              {messageCount !== 0 && (
                <div className="md:absolute md:top-[6px] md:right-0">
                  <MessageCountBadge className="top-[5px] right-[5px]">
                    {messageCount}
                  </MessageCountBadge>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
