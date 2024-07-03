import React, { useMemo } from 'react';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import cx from 'classnames';
import { useLocation } from 'react-router';
import { usePageNavigate } from '../../../../router/hooks/usePageNavigate';
import { ITabBar } from '../../type';
import { environment } from 'apps/gambling/src/environments/environment';
import useBreakpoint from '../../../hooks/useBreakpoint';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'apps/gambling/src/app/reduxStore';
import { ActivityBadge } from '../../../../components/Badge/ActivityBadge';
import { useInviteInCompatible } from '../../../../hooks/useInviteInCompatible';
import { appSlice } from 'apps/gambling/src/app/reduxStore/appSlice';

export const TabBar = (props: ITabBar) => {
  const location = useLocation();
  const showMenu = props.isShowMenu === undefined ? true : props.isShowMenu;
  const showHome = props.isShowHome === undefined ? true : props.isShowHome;
  const showInvite =
    props.isShowInvite === undefined ? true : props.isShowInvite;
  const showVIP = props.isShowVIP === undefined ? true : props.isShowVIP;
  const showProfile =
    props.isShowProfile === undefined ? true : props.isShowProfile;
  const showMenuDrawer =
    props.isShowMenuDrawer === undefined ? true : props.isShowMenuDrawer;

  const onMenuClick =
    props.onMenuClick !== undefined ? props.onMenuClick : () => {};

  const iconSize = 'w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]';

  const { isTablet } = useBreakpoint();

  const {
    onClickToIndex,
    onClickToInvite,
    onClickToVipGrade,
    onClickToProfile,
    onClickToBoxInvite,
  } = usePageNavigate();
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const { isShowBoxInvite } = useInviteInCompatible();
  const dispatch = useDispatch();
  const showLoginModal = (show: boolean) => {
    dispatch(appSlice.actions.showLoginDrawerOrModal(show));
  };

  const tabsData = useMemo(
    () => [
      {
        id: 'menu',
        name: 'menu',
        text: 'MENU',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tabber_menu_active.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tabber_menu_active.png`,
        },
        isShow: showMenu,
        isShowBadge: true,
        isActive: showMenuDrawer,
        action: () => {
          onMenuClick();
        },
      },
      {
        id: 'convidar',
        name: 'invite',
        text: 'CONVIDAR',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tabber_convidar.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tabber_convidar_active.png`,
        },
        isShow: showInvite,
        isShowBadge: false,
        isActive:
          !showMenuDrawer &&
          (isShowBoxInvite
            ? location.pathname === PageOrModalPathEnum.BoxInvitePage
            : location.pathname === PageOrModalPathEnum.InvitePage),
        action: () => {
          // 避免打開的 menu mask 影響到其他 tab 的點選
          if (showMenuDrawer) onMenuClick();
          isShowBoxInvite ? onClickToBoxInvite() : onClickToInvite();
        },
      },
      {
        id: 'jogos',
        name: 'home',
        text: 'JOGOS',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tabber_jogos.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tabber_jogos_active.png`,
        },
        isShow: showHome,
        isShowBadge: false,
        isActive:
          !showMenuDrawer &&
          (location.pathname === PageOrModalPathEnum.IndexPage ||
            location.pathname === PageOrModalPathEnum.GameSearchPage),
        action: () => {
          // 避免打開的 menu mask 影響到其他 tab 的點選
          if (showMenuDrawer) onMenuClick();
          onClickToIndex();
        },
      },
      {
        id: 'vip',
        name: 'vip',
        text: 'VIP',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tabber_vip.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tabber_vip_active.png`,
        },
        isShow: showVIP,
        isShowBadge: false,
        isActive:
          !showMenuDrawer &&
          location.pathname === PageOrModalPathEnum.VIPGradePage,
        action: () => {
          // 避免打開的 menu mask 影響到其他 tab 的點選
          if (showMenuDrawer) onMenuClick();
          onClickToVipGrade();
        },
      },
      {
        id: 'minha',
        name: 'profile',
        text: 'MINHA',
        img: {
          src: `assets/${environment.uVersion}/${environment.mVersion}/icon_tabber_minha.png`,
          active: `assets/${environment.uVersion}/${environment.mVersion}/icon_tabber_minha_active.png`,
        },
        isShow: showProfile,
        isShowBadge: false,
        isActive:
          !showMenuDrawer && location.pathname === PageOrModalPathEnum.MyPage,
        action: () => {
          // 避免打開的 menu mask 影響到其他 tab 的點選
          if (showMenuDrawer) onMenuClick();
          onClickToProfile();
        },
      },
    ],
    [
      showMenuDrawer,
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
    <footer
      className={`
        fixed bottom-3 z-[1004]
        flex flex-row justify-between
        h-[60px]
        rounded-[100px] bg-[var(--grayscale-25)]
        shadow-[0px_4px_12px_0px_rgba(0,_0,_0,_0.8)]
        p-2
      `}
      style={
        isTablet && showMenuDrawer
          ? { left: '50%', transform: 'translate(calc(-50% + 120px))' }
          : {}
      }
    >
      {tabsData.map((item) => (
        <>
          {item.isShow ? (
            <section
              key={item.id}
              className={cx(
                'flex items-center justify-center p-3 sm:py-4 sm:px-5 mr-1',
                {
                  'bg-linear-5-main rounded-[100px] px-4 sm:px-5':
                    item.isActive,
                  'mr-0': item.id === 'minha',
                }
              )}
              onClick={item.action}
            >
              <div
                className={cx('relative', iconSize, { 'mr-3': item.isActive })}
              >
                <img
                  className={cx(iconSize)}
                  src={item.isActive ? item.img.active : item.img.src}
                />
                {item.isShowBadge && !item.isActive ? (
                  <ActivityBadge
                    className={cx(
                      'absolute top-0 right-0',
                      'bg-[var(--state-error-main)]',
                      'shadow-[0px_2px_2px_0px_rgba(38,_33,_44,_0.4),_inset_0px_-2px_2px_0px_rgba(0,_0,_0,_0.4),_inset_0px_2px_2px_0px_rgba(255,_255,_255,_0.4)]',
                      '-mt-2.5 -mr-2'
                    )}
                  />
                ) : null}
              </div>

              {item.isActive ? (
                <span
                  className={cx(
                    'text-sm sm:text-base leading-5 sm:leading-6 text-white'
                  )}
                >
                  {item.text}
                </span>
              ) : null}
            </section>
          ) : null}
          {item.isShowBadge && item.isActive ? (
            <ActivityBadge
              className={cx(
                'bg-[var(--state-error-main)]',
                'shadow-[0px_2px_2px_0px_rgba(38,_33,_44,_0.4),_inset_0px_-2px_2px_0px_rgba(0,_0,_0,_0.4),_inset_0px_2px_2px_0px_rgba(255,_255,_255,_0.4)]',
                '-ml-4'
              )}
            />
          ) : null}
        </>
      ))}
    </footer>
  );
};
