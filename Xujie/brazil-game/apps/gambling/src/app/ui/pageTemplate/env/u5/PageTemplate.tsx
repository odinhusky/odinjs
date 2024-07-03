import { BaseStyledPageTemplate } from '../../base/BaseStyledPageTemplate';
import { IUseSingletonPageTemplateConfig } from '../../hooks/useSingletonPageTemplateConfig';

import React, { SyntheticEvent } from 'react';

import { Footer } from '../../footer';

import { BaseLoadingOverlay } from '../../base/BaseLoadingOverlay';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../reduxStore';
import { BaseErrorBoundary } from '../../base/BaseErrorBoundary';
import { TShowToolboxConfig } from '../../base/types';
import useBreakpoint from '../../hooks/useBreakpoint';
import { MenuDrawer } from '../../../drawers/MenuDrawer';

import { Header } from '../../header';
import { twMerge } from 'tailwind-merge';

import { TabBar } from '../../tabBar';
import { Toolbox } from '../../Toolbox/env/u2/index';
import { AddToMobileShortcut } from '../../../popovers/AddToMobileShortcut';
import { useLocalStorage } from 'usehooks-ts';
import { AppLocalStorageKey } from '../../../../persistant/AppLocalStorageKey';
import cx from 'classnames';
import { PageOrModalPathEnum } from '../../../PageOrModalPathEnum';
import { useLocation } from 'react-router';
import { uiSlice } from '../../../../reduxStore/uiSlice';
import { CacheImage } from '../../../components/image/CacheImage';
import { environment } from '../../../../../environments/environment';
import { MenuDrawerCollapseButton } from './MenuDrawerCollapseButton';
import { useActivityFontConfig } from '../../../pages/ActivityPage/hooks/useActivityFontConfig';
import queryString from 'query-string';

export const BASE_TAB_HEIGHT = 84;

type IPageTemplate = {
  children: React.ReactNode;
  showToolboxConfig?: TShowToolboxConfig;
  onClickToDownload: () => void;
  onClickToOpenTelegramManager: () => void;
  onClickToOpenTelegramService: () => void;
} & {
  isCurrentPageCompanyProfile: boolean;
  contextHolder: any;
  isLogin: boolean;
  setIsLogin: (value: any) => void;
  showLoginModal: (value: any) => void;
  openDesktopNotificationDrawer: boolean;
  setOpenDesktopNotificationDrawer: (value: any) => void;
  setOpenLogoutPopover: (value: any) => void;
  isShowMobileLogoutModal: boolean;

  openNotificationWithIcon: (value: any) => void;
  // openDownloadModal: boolean;
  // setOpenDownloadModal: (value: any) => void;
  isShowTelegramModal: boolean;
  isShowInviteBonusModal: boolean;
  setOpenInitailChargeModal: (value: any) => void;

  isUILoading: boolean;
} & IUseSingletonPageTemplateConfig;

export const PageTemplate = ({
  children,
  showLoginModal,
  setOpenDesktopNotificationDrawer,
  setOpenLogoutPopover,
  isShowMobileLogoutModal,
  onClickToOpenTelegramService,
  onClickToDownload,
  onClickToOpenTelegramManager,
  showToolboxConfig,

  // NOTICE:
  header,
  footer,
  tabBar,
  menuDrawer,
  showMenuDrawer,
}: IPageTemplate) => {
  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const uILoading = useSelector((state: RootState) => state.app.uILoading);
  const openMenuDrawer = useSelector(
    (state: RootState) => state.ui.openMenuDrawer
  );

  const { fontConfig } = useActivityFontConfig();
  const { isMobile, isDesktop, isTablet } = useBreakpoint();

  // NOTE: show
  const isShowHeader = header.mobile || header.tablet || header.desktop;
  const isShowFooter = footer.mobile || footer.tablet || footer.desktop;
  const isShowMenuDrawer =
    menuDrawer.mobile || menuDrawer.tablet || menuDrawer.desktop;
  // console.log("menuDrawer", menuDrawer);

  const isShowTabBar = tabBar.mobile || tabBar.tablet || tabBar.desktop;

  // NOTICE: refactor me
  // NOTE: Style - Header
  const HeaderHeight = !isShowHeader ? 0 : isDesktop ? 72 : isTablet ? 72 : 56;
  const HeaderZIndex = isDesktop ? 'z-[1004]' : 'z-[1002]';

  // NOTE: Style - MenuDrawer
  const DrawerWidth = 240;
  const MenuDrawerTop = isDesktop ? 80 : 0;
  const MenudrawerZIndex = 'z-[1003]';

  // NOTE: Style - AddShortCut (fixed)
  const AddShortCutZIndex = 'z-[1005]';

  // NOTE: Style - TabBar
  const TabHeight = tabBar.mobile || tabBar.tablet || tabBar.desktop ? 72 : 0;
  const TabZIndex = 'z-[1004]';

  // NOTE: Style - Toolbox (fixed)
  const ToolboxZIndex = 'z-10';

  // NOTE: AddToMobileShortCut
  const inNativeApp = useSelector(
    (rootState: RootState) => rootState.app.inNativeApp
  );
  const [hideAddToMobileShortcut] = useLocalStorage(
    AppLocalStorageKey.hideAddToMobileShortcut,
    false
  );
  const location = useLocation();
  // 是否在遊戲中 如果在遊戲中(/game) 需要隱藏MobileShortCut 且不影響 前面三者功能的判斷
  const isInGameRoute =
    location.pathname === PageOrModalPathEnum.GamePage ? true : false;
  const isInMyRoute =
    location.pathname === PageOrModalPathEnum.MyPage ? true : false;

  // // fix: 沒抓到 gameId 問題
  // const getGameId = (): string| undefined => {
  //     const fromUrl = isInGameRoute ? queryString.parse(location.search)?.fromUrl : 'false';
  //     const {gameId}: { gameId?: string } = isInGameRoute && fromUrl === 'true'
  //         ? queryString.parse(location.search) as {
  //             gameId?: string
  //         }
  //         : isInGameRoute ? location.state : {};
  //     return gameId ;
  // }

  const isShowAddToMobileShortCut =
    (isMobile || isTablet) &&
    !inNativeApp &&
    !hideAddToMobileShortcut &&
    !isInGameRoute;

  const childrenMarginLeft =
    (isMobile && menuDrawer.mobile && menuDrawer.mobileOverChildren) ||
    (isTablet && menuDrawer.tablet && menuDrawer.tabletOverChildren) ||
    (isDesktop && menuDrawer.desktop && menuDrawer.desktopOverChildren)
      ? 0
      : DrawerWidth;

  const dispatch = useDispatch();

  return (
    <BaseStyledPageTemplate
      bgType={'color'}
      isCurrentPageCompanyProfile={
        location.pathname === PageOrModalPathEnum.CompanyProfilePage
      }
    >
      {uILoading.isLoading && (
        <BaseLoadingOverlay
          className={
            'z-[9999] fixed top-0 left-0 right-0 bottom-0 bg-[var(--grayscale-15)]'
          }
          isInGameRoute={isInGameRoute}
          loadingIcon={uILoading.loadingIcon}
        />
      )}

      {isShowHeader && (
        <div
          className={twMerge(HeaderZIndex, 'fixed top-0 left-0 right-0 w-full')}
        >
          <Header
            className={''}
            // NOTE: Login
            isLogin={isLogin}
            onClickUserLoginStatusDrawer={() => {
              // setOpenNonMobileUserLoginStatusDrawer(true);
              showLoginModal(true);
            }}
            onClickToChangeLogoutPopover={(display: boolean) => {
              setOpenLogoutPopover(display);
            }}
            openLogoutPopover={isShowMobileLogoutModal}
            // NOTE: Notification
            onClickToOpenNotificationDrawer={() => {
              setOpenDesktopNotificationDrawer(true);
            }}
            // NOTE: Download
            onClickToDownload={onClickToDownload}
          />
        </div>
      )}

      <div
        className={twMerge(
          MenudrawerZIndex,
          'h-full fixed left-0 flex',
          `${isShowMenuDrawer && !isDesktop ? 'w-full' : ''}`
        )}
        style={{
          top: MenuDrawerTop,
        }}
      >
        {isShowMenuDrawer ? (
          <MenuDrawer
            className={cx('shrink')}
            onClickToDownload={onClickToDownload}
          />
        ) : null}

        {isDesktop && !isInGameRoute ? (
          <MenuDrawerCollapseButton
            isOpenMenuDrawer={openMenuDrawer}
            containerClassName="justify-start"
            onClick={() => {
              dispatch(uiSlice.actions.setOpenMenuDrawer(!openMenuDrawer));
            }}
          />
        ) : null}

        {isShowMenuDrawer && !isDesktop ? (
          <div
            id="menuMask"
            className="fixed right-0 top-0 h-full flex-1"
            style={{
              width: 'calc(100% - 240px)',
            }}
            onClick={() => {
              dispatch(uiSlice.actions.setOpenMenuDrawer(false));
            }}
          ></div>
        ) : null}
      </div>

      <div
        style={{
          position: 'fixed',
          top: HeaderHeight,
          width: '100%',
          height: `calc(100% - ${HeaderHeight}px)`,
        }}
      >
        <div
          id={'page-container'}
          className={twMerge(
            'h-full overflow-auto',
            `${isInMyRoute ? 'bg-[var(--grayscale-25)]' : ''}`
          )}
          style={{
            scrollbarWidth: 'none',
            marginLeft: isShowMenuDrawer ? childrenMarginLeft : 0,
          }}
        >
          <BaseErrorBoundary>{children}</BaseErrorBoundary>

          {isShowFooter && <Footer />}
        </div>
      </div>

      {/*NOTE: AddToMobileShortcut*/}
      {isShowAddToMobileShortCut && (
        <div
          className={twMerge(
            'fixed top-2/4 left-2/4 -translate-y-1/2 -translate-x-2/4 w-full flex justify-center',
            AddShortCutZIndex
          )}
        >
          <AddToMobileShortcut isShowTabbar={isShowTabBar} />
        </div>
      )}

      {isShowTabBar && (
        <div className={cx('w-full', 'flex justify-center items-center')}>
          <TabBar
            className={TabZIndex}
            isShowMenuDrawer={isShowMenuDrawer}
            onMenuClick={() => {
              dispatch(uiSlice.actions.setOpenMenuDrawer(!openMenuDrawer));
            }}
          />
        </div>
      )}

      {showToolboxConfig !== false && environment.uVersion !== 'u5' ? (
        <div className={cx(ToolboxZIndex, 'fixed right-[16px] bottom-[160px]')}>
          <Toolbox
            className={''}
            showToolboxConfig={showToolboxConfig}
            onClickToDownload={onClickToDownload}
            onClickToOpenTelegramManager={onClickToOpenTelegramManager}
            onClickToOpenTelegramService={onClickToOpenTelegramService}
          />
        </div>
      ) : null}
    </BaseStyledPageTemplate>
  );
};
