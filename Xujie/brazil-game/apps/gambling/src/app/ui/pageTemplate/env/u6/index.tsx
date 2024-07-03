import { BaseStyledPageTemplate } from '../../base/BaseStyledPageTemplate';
import { IUseSingletonPageTemplateConfig } from '../../hooks/useSingletonPageTemplateConfig';
import React, { useMemo } from 'react';
import { Footer } from '../../footer';
import { BaseLoadingOverlay } from '../../base/BaseLoadingOverlay';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../reduxStore';
import { BaseErrorBoundary } from '../../base/BaseErrorBoundary';
import { TShowToolboxConfig } from '../../base/types';
import useBreakpoint from '../../hooks/useBreakpoint';
import { MenuDrawer } from '../../../drawers/MenuDrawer';
import { Header } from '../../header';
import { TabBar } from '../../tabBar';
import { Toolbox } from '../../Toolbox/env/u6';
import { AddToMobileShortcut } from '../../../popovers/AddToMobileShortcut';
import { useLocalStorage } from 'usehooks-ts';
import { AppLocalStorageKey } from '../../../../persistant/AppLocalStorageKey';
import { PageOrModalPathEnum } from '../../../PageOrModalPathEnum';
import { useLocation } from 'react-router';
import cx from '../../../utils/cx';
import { uiSlice } from '../../../../reduxStore/uiSlice';

type IPageTemplate = {
  children: React.ReactNode;
  showToolboxConfig?: TShowToolboxConfig;
  onClickToDownload: () => void;
  onClickToOpenTelegramManager: () => void;
  onClickToOpenTelegramService: () => void;
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
  openDownloadModal: boolean;
  setOpenDownloadModal: (value: any) => void;
  isShowTelegramModal: boolean;
  isShowInviteBonusModal: boolean;
  setOpenInitailChargeModal: (value: any) => void;
} & IUseSingletonPageTemplateConfig;

export const PageTemplate = (props: IPageTemplate) => {
  const {
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
  } = props;

  const isLogin = useSelector((state: RootState) => state.app.isLogin);
  const uILoading = useSelector((state: RootState) => state.app.uILoading);
  const inNativeApp = useSelector((state: RootState) => state.app.inNativeApp);
  const openMenuDrawer = useSelector(
    (state: RootState) => state.ui.openMenuDrawer
  );

  const { isMobile, isDesktop, isTablet } = useBreakpoint();

  // NOTE: show
  const isShowHeader = header.mobile || header.tablet || header.desktop;
  const isShowFooter = footer.mobile || footer.tablet || footer.desktop;
  const isShowMenuDrawer =
    menuDrawer.mobile || menuDrawer.tablet || menuDrawer.desktop;
  const isShowTabBar = tabBar.mobile || tabBar.tablet || tabBar.desktop;

  // NOTE: Style - Header
  const HeaderHeight = !isShowHeader ? 0 : isDesktop ? 56 : isTablet ? 72 : 64;
  const HeaderZIndex = isDesktop ? 'z-[1004]' : 'z-[1002]';

  // NOTE: Style - MenuDrawer
  const DrawerWidth = 240;
  const MenuDrawerTop = isDesktop ? 56 : 0;
  const MenudrawerZIndex = 'z-[1003]';

  // NOTE: Style - AddShortCut (fixed)
  const AddShortCutZIndex = 'z-[1005]';

  // NOTE: Style - TabBar
  const TabHeight = tabBar.mobile || tabBar.tablet || tabBar.desktop ? 76 : 0;
  const TabZIndex = 'z-[1004]';

  // NOTE: Style - Toolbox (fixed)
  const ToolboxZIndex = 'z-10';

  const [hideAddToMobileShortcut] = useLocalStorage(
    AppLocalStorageKey.hideAddToMobileShortcut,
    false
  );
  const location = useLocation();

  // 是否在遊戲中 如果在遊戲中(/game) 需要隱藏MobileShortCut 且不影響 前面三者功能的判斷
  let isIngameRoute = location.pathname === PageOrModalPathEnum.GamePage;
  const isShowAddToMobileShortCut = useMemo(() => {
    return (
      !inNativeApp &&
      !hideAddToMobileShortcut &&
      !isIngameRoute &&
      location.pathname === PageOrModalPathEnum.IndexPage
    );
  }, [location, isTablet, isMobile, hideAddToMobileShortcut]);

  const dispatch = useDispatch();

  const childrenMarginLeft =
    (isMobile && menuDrawer.mobile && menuDrawer.mobileOverChildren) ||
    (isTablet && menuDrawer.tablet && menuDrawer.tabletOverChildren) ||
    (isDesktop && menuDrawer.desktop && menuDrawer.desktopOverChildren)
      ? 0
      : DrawerWidth;

  return (
    <BaseStyledPageTemplate
      bgType={'color'}
      isCurrentPageCompanyProfile={
        location.pathname === PageOrModalPathEnum.CompanyProfilePage
      }
    >
      {uILoading.isLoading && (
        <BaseLoadingOverlay
          className={'z-[9999] fixed top-0 left-0 right-0 bottom-0 bg-main'}
          isInGameRoute={isIngameRoute}
          loadingIcon={uILoading.loadingIcon}
        />
      )}

      {isShowHeader && (
        <div className={cx(HeaderZIndex, 'fixed top-0 left-0 right-0 w-full')}>
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

      {isShowMenuDrawer && (
        <div
          className={cx(
            MenudrawerZIndex,
            'h-full fixed left-0',
            { 'w-full': isMobile || isTablet },
            { animate__fadeInLeft: isShowMenuDrawer && (isMobile || isTablet) }
          )}
          style={{
            top: MenuDrawerTop,
          }}
        >
          <MenuDrawer
            className={'animate__animated animate__faster'}
            onClickToDownload={onClickToDownload}
          />
        </div>
      )}

      <div
        className={cx(
          'flex flex-col',
          isShowMenuDrawer && !isDesktop ? 'blur-sm' : ''
        )}
        style={{
          // position: 'fixed',
          paddingTop: HeaderHeight,
          marginLeft: isShowMenuDrawer ? childrenMarginLeft : 0,
          paddingBottom: TabHeight,
          height: '100%',
          // height: `calc(100vh - ${TabHeight}px)`,
          // top: HeaderHeight,
          // width: '100%',
          // height: `calc(100% - ${HeaderHeight}px - ${TabHeight}px)`,
        }}
      >
        {/*NOTE: AddToMobileShortcut*/}
        {isShowAddToMobileShortCut && (
          <div
            className={cx(
              'w-full flex justify-center',
              isMobile ? 'pt-3' : 'pt-2.5',
              'px-4 mobile:px-8 tablet:px-24'
            )}
          >
            <div
              className={
                'w-full flex justify-center tablet:box-content tablet:max-w-[1200px] tablet:mx-auto'
              }
            >
              <AddToMobileShortcut
                setOpenDownloadModal={props.setOpenDownloadModal}
                isShowTabbar={isShowTabBar}
              />
            </div>
          </div>
        )}

        <BaseErrorBoundary>{children}</BaseErrorBoundary>

        {isShowFooter && <Footer />}
      </div>

      {isShowTabBar && (
        <TabBar
          className={TabZIndex}
          isShowSlot={false}
          size={'big'}
          isShowMenuDrawer={showMenuDrawer}
          onMenuClick={() => {
            dispatch(uiSlice.actions.setOpenMenuDrawer(!openMenuDrawer));
          }}
        />
      )}

      {showToolboxConfig !== false && (
        <div
          className={cx(
            ToolboxZIndex,
            'fixed',
            { 'right-7 bottom-[200px]': isDesktop },
            { 'right-4 bottom-[144px]': isTablet },
            { 'right-[7px] bottom-[96px]': isMobile }
          )}
        >
          <Toolbox
            className={''}
            showToolboxConfig={showToolboxConfig}
            onClickToDownload={onClickToDownload}
            onClickToOpenTelegramManager={onClickToOpenTelegramManager}
            onClickToOpenTelegramService={onClickToOpenTelegramService}
          />
        </div>
      )}
    </BaseStyledPageTemplate>
  );
};
