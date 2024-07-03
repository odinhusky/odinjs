import styled from 'styled-components';
import cx from 'classnames';
import React from 'react';
import { ConfirmButton } from '../../../../components-bs/Buttons/ConfirmButton';
import { UserMoneyStatusSection } from '../../UserMoneyStatusSection';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { environment } from '../../../../../../environments/environment';
import { Avatar } from '../../../../components/Avatar';
import { AvatarAccountInfo } from '../../../../components/AvatarAccountInfo';
import { WebsiteLogo } from './components/WebsiteLogo';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { appSlice } from '../../../../../reduxStore/appSlice';

const Notification = styled.section`
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border: 2px solid currentColor;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
`;

export type IHeader = {
  className?: string;
  onClickUserLoginStatusDrawer: () => void;
  isLogin: boolean;
  onClickToOpenNotificationDrawer: () => void;
  openLogoutPopover: boolean;
  onClickToChangeLogoutPopover: (display: boolean) => void;
};

export const Header = (props: IHeader) => {
  const navigate = useNavigate();
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const openUserInfoStatusPopover = useSelector(
    (state: RootState) => state.ui.openUserInfoStatusPopover
  );
  const dispatch = useDispatch();

  return (
    <header
      className={cx(
        'flex flex-row justify-start items-center px-5',
        props.className
      )}
      style={{
        // backgroundImage: `url("assets/${environment.assetPrefix}/top_di.png")`, // 替换成背景图片路径
        backgroundSize: 'cover', // 调整背景图片大小以填充整个元素
        backgroundPosition: '90% 50%', // 调整背景图片位置
        backgroundRepeat: 'no-repeat', // 禁止背景图片重复
        backgroundColor: 'var(--assistant)', // 设置背景颜色
      }}
    >
      <WebsiteLogo className="w-[136px] h-[68px]" />
      {/*<CompanyButton/>*/}

      {/*[How to Align Last Flex Item to Right](https://medium.com/@iamryanyu/how-to-align-last-flex-item-to-right-73512e4e5912)*/}
      {!isLogin ? (
        <ConfirmButton
          onClick={() => {
            dispatch(appSlice.actions.showLoginDrawerOrModal(true));
            dispatch(appSlice.actions.setLoginUIStatusType('register'));
            // props.onClickUserLoginStatusDrawer();
          }}
          className={'ml-auto'}
        >
          Conecte-se
        </ConfirmButton>
      ) : (
        <section className={'flex flex-row items-center ml-auto'}>
          <div className={'mr-12 hidden lg:block'}>
            <UserMoneyStatusSection />
          </div>

          <section className={'mr-2 cursor-pointer'}>
            <Avatar
              onClickToPopupUserInfoStatusPopover={() =>
                dispatch(
                  uiSlice.actions.setUserInfoStatusPopover(
                    !openUserInfoStatusPopover
                  )
                )
              }
            />
          </section>

          <section className={'mr-8 cursor-pointer'}>
            <AvatarAccountInfo />
          </section>

          <section className="mr-4 cursor-pointer">
            <div
              onClick={() => {
                props.onClickToOpenNotificationDrawer();
              }}
            >
              <img
                className="h-[32px] w-[32px]"
                alt="notification"
                src={`assets/${environment.uVersion}/ic_notification.png`}
              />
            </div>
          </section>

          <div onClick={() => props.onClickToChangeLogoutPopover(true)}>
            <img
              className="h-[32px] w-[32px] cursor-pointer"
              alt="signOut"
              src={`assets/${environment.uVersion}/ic_sign_out.png`}
            />
          </div>

          {/*<section className={""} onClick={() => {*/}
          {/*  props.onClickToChangeLogoutPopover(!props.openLogoutPopover);*/}
          {/*}}>*/}
          {/*  <button>*/}
          {/*    <img className="w-[36px] h-[36px] min-w-[36px] min-h-[36px]" alt={"logout"} src={`assets/${environment.assetPrefix}/ic_signout.png`}/>*/}
          {/*  </button>*/}
          {/*</section>*/}
        </section>
      )}
    </header>
  );
};
