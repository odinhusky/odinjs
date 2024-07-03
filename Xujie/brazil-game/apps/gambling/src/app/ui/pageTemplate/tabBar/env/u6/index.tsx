import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import cx from 'classnames';
import { useLocation } from 'react-router';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { ITabBar } from '../../type';
import { useInviteInCompatible } from '../../../../hooks/useInviteInCompatible';
import { useMemo } from 'react';
import { environment } from '../../../../../../environments/environment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { uiSlice } from '../../../../../reduxStore/uiSlice';
import { useScrollToPartPageTemplate } from '../../../hooks/useScrollToPartPageTemplate';

export const TabBar = (props: ITabBar) => {
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const location = useLocation();
  const showMenu = props.isShowMenu === undefined ? true : props.isShowMenu;
  const showInvite =
    props.isShowInvite === undefined ? true : props.isShowInvite;
  const showHome = props.isShowHome === undefined ? true : props.isShowHome;
  const showVIP = props.isShowVIP === undefined ? true : props.isShowVIP;
  const showProfile =
    props.isShowProfile === undefined ? true : props.isShowProfile;
  const openMenuDrawer = useSelector(
    (state: RootState) => state.ui.openMenuDrawer
  );
  const dispatch = useDispatch();
  const onMenuClick =
    props.onMenuClick !== undefined ? props.onMenuClick : () => {};

  const {
    onClickToIndex,
    onClickToInvite,
    onClickToVipGrade,
    onClickToProfile,
    onClickToBoxInvite,
  } = usePageNavigate();

  // 邀請寶箱互斥
  const { isShowBoxInvite } = useInviteInCompatible();
  const { scrollToWindowTop } = useScrollToPartPageTemplate();
  const tabsData = useMemo(
    () => [
      {
        id: 'menu',
        text: 'Menú',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_menu_m.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_menu_m_hold.png`,
        },
        isShow: showMenu,
        isShowBadge: true,
        isOverflow: false,
        isActive: openMenuDrawer,
        action: () => {
          onMenuClick();
        },
      },
      {
        id: 'invite',
        text: 'Recomendar',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_invite_m.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_invite_m_hold.png`,
        },
        isShow: showInvite,
        isShowBadge: false,
        isOverflow: false,
        isActive:
          !openMenuDrawer &&
          (isShowBoxInvite
            ? location.pathname === PageOrModalPathEnum.BoxInvitePage
            : location.pathname === PageOrModalPathEnum.InvitePage),
        action: () => {
          dispatch(uiSlice.actions.setOpenMenuDrawer(false));
          isShowBoxInvite ? onClickToBoxInvite() : onClickToInvite();
        },
      },
      {
        id: 'home',
        text: '',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_home_m.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_home_m_hold.png`,
        },
        isShow: showHome,
        isShowBadge: false,
        isOverflow: true,
        isActive:
          !openMenuDrawer &&
          (location.pathname === PageOrModalPathEnum.IndexPage ||
            location.pathname === PageOrModalPathEnum.GameSearchPage),
        action: () => {
          dispatch(uiSlice.actions.setOpenMenuDrawer(false));
          onClickToIndex();
          scrollToWindowTop();
        },
      },
      {
        id: 'vip',
        text: 'VIP',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_vip_m.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_vip_m_hold.png`,
        },
        isShow: showVIP,
        isShowBadge: false,
        isOverflow: false,
        isActive:
          !openMenuDrawer &&
          location.pathname === PageOrModalPathEnum.VIPGradePage,
        action: () => {
          dispatch(uiSlice.actions.setOpenMenuDrawer(false));
          onClickToVipGrade();
        },
      },
      {
        id: 'account',
        text: 'Minha',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_account_m.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tab_account_m_hold.png`,
        },
        isShow: showProfile,
        isShowBadge: false,
        isOverflow: false,
        isActive:
          !openMenuDrawer && location.pathname === PageOrModalPathEnum.MyPage,
        action: () => {
          dispatch(uiSlice.actions.setOpenMenuDrawer(false));
          onClickToProfile();
        },
      },
    ],
    [
      openMenuDrawer,
      showMenu,
      showInvite,
      showHome,
      showVIP,
      showProfile,
      location.pathname,
      isLogin,
    ]
  );

  return (
    <footer className={cx('fixed bottom-0 h-[76px] z-[1004] w-full')}>
      <div
        className={
          'w-full h-full bg-[var(--grayscale-10)] flex justify-around gap-x-2'
        }
      >
        {tabsData.map((item) => (
          <div
            className={cx(
              'flex flex-col justify-center items-center w-full cursor-pointer',
              item.isOverflow ? '' : 'active:brightness-75 hover:brightness-125'
            )}
            onClick={() => {
              item.action();
            }}
          >
            {item.isOverflow ? (
              <div
                className={cx(
                  'h-16 w-16 -mt-16 mobile:h-20 mobile:w-20 mobile:-mt-20',
                  'rounded-full ring',
                  'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.2),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.2)]',
                  'linear-3-button',
                  item.isActive
                    ? 'ring-[var(--grayscale-70)]'
                    : 'ring-[var(--grayscale-15)]'
                )}
              >
                <img
                  className={cx('h-6 w-6 mobile:h-[30px] mobile:w-[30px]')}
                  alt={item.id}
                  src={item.isActive ? item.img.active : item.img.src}
                />
              </div>
            ) : (
              <img
                className={cx('h-6 w-6 mobile:h-7 mobile:w-7')}
                alt={item.id}
                src={item.isActive ? item.img.active : item.img.src}
              />
            )}
            <div
              className={cx(
                'text-center text-sm mobile:text-base',
                item.isActive
                  ? 'text-[var(--grayscale-100)]'
                  : 'text-[var(--grayscale-70)]',
                item.isOverflow ? 'hidden' : 'visible'
              )}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
};
