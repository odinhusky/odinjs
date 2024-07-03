// import { space, layout, typography, color } from 'styled-system'
import React, { useEffect, useState, useMemo } from 'react';
import { notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import useBreakpoint from './hooks/useBreakpoint';
import { useAutoUpdateBalance } from '../hooks/useAutoUpdateBalance';

import { RootState } from '../../reduxStore';
import { QueueModalEnum, appSlice } from '../../reduxStore/appSlice';
import { uiSlice } from '../../reduxStore/uiSlice';

import { PageOrModalPathEnum } from '../PageOrModalPathEnum';
import { environment } from '../../../environments/environment';

import { usePageNavigate } from '../router/hooks/usePageNavigate';
import { useLocalStorage } from 'usehooks-ts';

import { renderByUVersion } from '../utils/renderByUVersion';
import { PageTemplate as PernaPageTemplate } from './env/pernambucana/PageTemplate';
import { PageTemplate as WPageTemplate } from './env/wild/PageTemplate';
import { PageTemplate as CPageTemplate } from './env/u1/PageTemplate';
import {
  PageTemplate as PPageTemplate,
  BASE_TAB_HEIGHT as P_BASE_TAB_HEIGHT,
  BASE_DRAWER_WIDTH as P_BASE_DRAWER_WIDTH,
} from './env/p1/PageTemplate';
import { PageTemplate as RiojunglePageTemplate } from './env/u2/PageTemplate';
import {
  PageTemplate as U5PageTemplate,
  BASE_TAB_HEIGHT as U5_BASE_TAB_HEIGHT,
} from './env/u5/PageTemplate';
import { useSingletonPageTemplateConfig } from './hooks/useSingletonPageTemplateConfig';
import { PageTemplateLayers } from '../pageTemplateLayers';
import { IPage } from './types/IPage';
import { useScrollToPartPageTemplate } from './hooks/useScrollToPartPageTemplate';
import { AppLocalStorageKey } from '../../persistant/AppLocalStorageKey';
import { AppLocalStorage } from '../../persistant/localstorage';
import { removeRedirectLocalStorage } from '../utils/loginRedirect';
import { PageTemplate as U6PageTemplate } from './env/u6/index';
import { PageTemplate as U7PageTemplate } from './env/u7/index';
import { PageTemplate as U9PageTemplate } from './env/u9/index';

console.log('[APP] environment', environment);

export const BASE_TAB_HEIGHT = renderByUVersion(
  {
    p1: P_BASE_TAB_HEIGHT,
    u5: U5_BASE_TAB_HEIGHT,
  },
  P_BASE_TAB_HEIGHT
);

export const BASE_DRAWER_WIDTH = renderByUVersion(
  {
    p1: P_BASE_DRAWER_WIDTH,
  },
  P_BASE_DRAWER_WIDTH
);

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type IOpenNotificationWithIcon = {
  type?: NotificationType;
  message?: string;
  description: string;
};

export const PageTemplate = (props: IPage) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { openMenuDrawer, openUserInfoStatusPopover } = useSelector(
    (state: RootState) => state.ui
  );
  const setOpenMenuDrawer = (show: boolean) => {
    dispatch(uiSlice.actions.setOpenMenuDrawer(show));
  };
  const { isMobile, isDesktop } = useBreakpoint();

  // useEffect(() => {
  //   if(!isMobile) {
  //     setOpenMenuDrawer(true)
  //   } else {
  //     setOpenMenuDrawer(false);
  //   }
  // }, [isMobile]);

  const isShowLoginModal = useSelector(
    (state: RootState) => state.app.isShowLoginModal
  );

  const showLoginModal = (show: boolean) => {
    if (isMobile) {
      // setShowUserLoginStatusMobileModal(show);
      dispatch(appSlice.actions.showLoginDrawerOrModal(show));
    } else {
      // setOpenNonMobileUserLoginStatusDrawer(show);
      dispatch(appSlice.actions.showLoginDrawerOrModal(show));
    }
  };

  // NOTE: isLogin
  const isLogin = useSelector((state: RootState) => state.app.isLogin);

  const checkRedirectOrNot = () => {
    const url = AppLocalStorage.getItem(AppLocalStorageKey.loginRedirect);
    const param = AppLocalStorage.getItem(
      AppLocalStorageKey.loginRedirectParam
    );
    if (url) {
      if (param) navigate(`${url}?${param}`);
      else navigate(`${url}`);
      removeRedirectLocalStorage();
    }
  };

  const setIsLogin = (login: boolean) => {
    dispatch(appSlice.actions.setIsLogin(login));
    if (login) checkRedirectOrNot();
  };

  const { update } = useAutoUpdateBalance({
    autoWindowFocusRefresh: false,
  });

  useEffect(() => {
    if (!isDesktop && openUserInfoStatusPopover) {
      dispatch(uiSlice.actions.closeUserInfoStatusPopover());
    }
  }, [isDesktop]);

  useEffect(() => {
    if (openUserInfoStatusPopover) update();
  }, [openUserInfoStatusPopover]);

  const { isLoading } = useSelector((state: RootState) => state.app.uILoading);

  const {
    isShowMobileLogoutModal,
    isShowTelegramModal,
    isShowDepositModal,
    isShowInviteBonusModal,
    isShowMaintenanceModal,
  } = useSelector((state: RootState) => state.app);

  // NOTE: NotificationDrawer
  const [openDesktopNotificationDrawer, setOpenDesktopNotificationDrawer] =
    useState(false);

  // NOTE: InitialChargeModal (沒有被用到應該被移除)
  const setOpenInitailChargeModal = (show: boolean) => {
    dispatch(appSlice.actions.setIsShowInviteBonusModal(show));
  };
  const location = useLocation();

  const {
    isShowMobileHeader,
    isShowTabletHeader,
    isShowDesktopHeader,

    // NOTE: Footer
    isShowMobileFooter,
    isShowTabletFooter,
    isShowDesktopFooter,

    // NOTE: MenuDrawer
    isShowMobileMenuDrawer,
    isShowTabletMenuDrawer,
    // NOTE: deprecated
    isShowDesktopMenuDrawer,

    // NOTE: TabBar
    isShowMobileTabBar,
    isShowTabletTabBar,
    isShowDesktopTabBar,
    // NOTE: deprecated
    isShowTabbar,
    mobileOverChildren,
    tabletOverChildren,
    desktopOverChildren,
  } = useSingletonPageTemplateConfig({
    header: props.header,
    footer: props.footer,
    tabBar: props.tabBar,
    menuDrawer: props.menuDrawer,
    // NOTE: deprecated
    showTabbar: props.showTabbar,
    showMenuDrawer: props.showMenuDrawer && openMenuDrawer,
  });

  // NOTE: LogoutPopover
  const setOpenLogoutPopover = (show: boolean) => {
    dispatch(appSlice.actions.showMobileLogoutModal(show));
  };
  const [openDownloadModal, setOpenDownloadModal] = useState(false);

  const [api, contextHolder] = notification.useNotification();
  const [_, setHideAddToMobileShortcut] = useLocalStorage(
    AppLocalStorageKey.hideAddToMobileShortcut,
    false
  );
  const inNativeApp = useSelector(
    (rootState: RootState) => rootState.app.inNativeApp
  );

  const onClickToDownload = () => {
    setOpenDownloadModal(!openDownloadModal);
  };

  const onClickToDownloadU5 = () => {
    if (isDesktop || inNativeApp) {
      setOpenDownloadModal((prev) => !prev);
    } else {
      setHideAddToMobileShortcut(false);
    }
  };

  const openNotificationWithIcon = (props: IOpenNotificationWithIcon) => {
    const type = props.type || 'error';
    const msg = props.message || 'Message';
    api[type]({
      message: msg,
      description: props.description,
    });
  };

  const {
    onClickToWallet,
    onClickToOpenTelegramService,
    onClickToOpenTelegramManager,
    onClickToOpenTelegramGroup,
  } = usePageNavigate();

  const isCurrentPageCompanyProfile =
    location.pathname === PageOrModalPathEnum.CompanyProfilePage;
  const isIndexPage = location.pathname === PageOrModalPathEnum.IndexPage;
  const showVideoBackground = isIndexPage && environment.backgroundVideoUrl;
  const videoElement = useMemo(() => {
    return (
      <div className="fixed z-[-1] right-0 bottom-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={environment.backgroundVideoUrl} type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      </div>
    );
  }, []);
  useEffect(() => {
    const handleStorage = () => {
      // Place for a function responsible for
      // pulling and displaying local storage data
      console.log('debug');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const { scrollToWindowTop } = useScrollToPartPageTemplate();
  useEffect(() => {
    if (window.location.href.includes('?gfs')) {
      AppLocalStorage.setItem(
        AppLocalStorageKey.inviteUrl,
        window.location.href
      );
    }
  }, []);
  useEffect(() => {
    scrollToWindowTop();
  }, [location.pathname, location.search]);

  return (
    <>
      {showVideoBackground ? videoElement : null}
      {renderByUVersion(
        {
          wild777bet: (
            <WPageTemplate
              isCurrentPageCompanyProfile={isCurrentPageCompanyProfile}
              contextHolder={contextHolder}
              isMobile={isMobile}
              isShowMobileFooter={isShowMobileFooter}
              isShowDesktopFooter={isShowMobileFooter}
              isShowDesktopHeader={isShowDesktopHeader}
              isShowDesktopMenuDrawer={isShowDesktopMenuDrawer}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              showLoginModal={showLoginModal}
              openDesktopNotificationDrawer={openDesktopNotificationDrawer}
              setOpenDesktopNotificationDrawer={
                setOpenDesktopNotificationDrawer
              }
              setOpenLogoutPopover={setOpenLogoutPopover}
              isShowMobileLogoutModal={isShowMobileLogoutModal}
              openMenuDrawer={openMenuDrawer}
              setOpenMenuDrawer={setOpenMenuDrawer}
              isShowLoginModal={isShowLoginModal}
              openNotificationWithIcon={openNotificationWithIcon}
              openDownloadModal={openDownloadModal}
              setOpenDownloadModal={setOpenDownloadModal}
              isShowTelegramModal={isShowTelegramModal}
              onClickToOpenTelegramService={onClickToOpenTelegramService}
              isShowInviteBonusModal={isShowInviteBonusModal}
              setOpenInitailChargeModal={setOpenInitailChargeModal}
              isShowMobileHeader={isShowMobileHeader}
              isShowTabbar={isShowTabbar}
              onClickToDownload={onClickToDownload}
              onClickToOpenTelegramManager={onClickToOpenTelegramManager}
              isUILoading={isLoading}
              showToolboxConfig={props.showToolboxConfig}
            >
              {props.children}
            </WPageTemplate>
          ),
          p1: (
            <PPageTemplate
              isCurrentPageCompanyProfile={isCurrentPageCompanyProfile}
              contextHolder={contextHolder}
              isMobile={isMobile}
              isShowMobileFooter={isShowMobileFooter}
              isShowDesktopFooter={isShowMobileFooter}
              isShowDesktopHeader={isShowDesktopHeader}
              isShowDesktopMenuDrawer={isShowDesktopMenuDrawer}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              showLoginModal={showLoginModal}
              openDesktopNotificationDrawer={openDesktopNotificationDrawer}
              setOpenDesktopNotificationDrawer={
                setOpenDesktopNotificationDrawer
              }
              setOpenLogoutPopover={setOpenLogoutPopover}
              isShowMobileLogoutModal={isShowMobileLogoutModal}
              openMenuDrawer={openMenuDrawer}
              setOpenMenuDrawer={setOpenMenuDrawer}
              isShowLoginModal={isShowLoginModal}
              openNotificationWithIcon={openNotificationWithIcon}
              openDownloadModal={openDownloadModal}
              setOpenDownloadModal={setOpenDownloadModal}
              isShowTelegramModal={isShowTelegramModal}
              onClickToOpenTelegramService={onClickToOpenTelegramService}
              isShowInviteBonusModal={isShowInviteBonusModal}
              setOpenInitailChargeModal={setOpenInitailChargeModal}
              isShowMobileHeader={isShowMobileHeader}
              // Deprecated
              isShowTabbar={isShowTabbar}
              onClickToDownload={onClickToDownload}
              onClickToOpenTelegramManager={onClickToOpenTelegramManager}
              isUILoading={isLoading}
              showToolboxConfig={props.showToolboxConfig}
              header={{
                mobile: isShowMobileHeader,
                tablet: isShowTabletHeader,
                desktop: isShowDesktopHeader,
              }}
              footer={{
                mobile: isShowMobileFooter,
                tablet: isShowTabletFooter,
                desktop: isShowDesktopFooter,
              }}
              tabBar={{
                mobile: isShowMobileTabBar,
                tablet: isShowTabletTabBar,
                desktop: isShowDesktopTabBar,
              }}
              menuDrawer={{
                mobile: isShowMobileMenuDrawer,
                tablet: isShowTabletMenuDrawer,
                desktop: isShowDesktopMenuDrawer,
                mobileOverChildren,
                tabletOverChildren,
                desktopOverChildren,
              }}
            >
              {props.children}
            </PPageTemplate>
          ),
          u1: (
            <CPageTemplate
              isCurrentPageCompanyProfile={isCurrentPageCompanyProfile}
              contextHolder={contextHolder}
              isMobile={isMobile}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              showLoginModal={showLoginModal}
              openDesktopNotificationDrawer={openDesktopNotificationDrawer}
              setOpenDesktopNotificationDrawer={
                setOpenDesktopNotificationDrawer
              }
              setOpenLogoutPopover={setOpenLogoutPopover}
              isShowMobileLogoutModal={isShowMobileLogoutModal}
              openMenuDrawer={openMenuDrawer}
              setOpenMenuDrawer={setOpenMenuDrawer}
              isShowLoginModal={isShowLoginModal}
              openNotificationWithIcon={openNotificationWithIcon}
              openDownloadModal={openDownloadModal}
              setOpenDownloadModal={setOpenDownloadModal}
              isShowTelegramModal={isShowTelegramModal}
              onClickToOpenTelegramService={onClickToOpenTelegramService}
              isShowInviteBonusModal={isShowInviteBonusModal}
              setOpenInitailChargeModal={setOpenInitailChargeModal}
              onClickToDownload={onClickToDownload}
              onClickToOpenTelegramManager={onClickToOpenTelegramManager}
              isUILoading={isLoading}
              // NOTICE: refactor
              isShowMobileFooter={isShowMobileFooter}
              isShowDesktopFooter={isShowDesktopFooter}
              isShowDesktopHeader={isShowDesktopHeader}
              isShowDesktopMenuDrawer={isShowDesktopMenuDrawer}
              isShowMobileHeader={isShowMobileHeader}
              isShowTabbar={isShowTabbar}
              showToolboxConfig={props.showToolboxConfig}
              header={{
                mobile: isShowMobileHeader,
                tablet: isShowTabletHeader,
                desktop: isShowDesktopHeader,
              }}
              footer={{
                mobile: isShowMobileFooter,
                tablet: isShowTabletFooter,
                desktop: isShowDesktopFooter,
              }}
              tabBar={{
                mobile: isShowMobileTabBar,
                tablet: isShowTabletTabBar,
                desktop: isShowDesktopTabBar,
              }}
              menuDrawer={{
                mobile: isShowMobileMenuDrawer,
                tablet: isShowTabletMenuDrawer,
                desktop: isShowDesktopMenuDrawer,
                mobileOverChildren,
                tabletOverChildren,
                desktopOverChildren,
              }}
            >
              {props.children}
            </CPageTemplate>
          ),
          u2: (
            <RiojunglePageTemplate
              showToolboxConfig={props.showToolboxConfig}
              onClickToDownload={onClickToDownload}
              onClickToOpenTelegramManager={onClickToOpenTelegramManager}
              onClickToOpenTelegramService={onClickToOpenTelegramService}
              isCurrentPageCompanyProfile={isCurrentPageCompanyProfile}
              contextHolder={contextHolder}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              showLoginModal={showLoginModal}
              openDesktopNotificationDrawer={openDesktopNotificationDrawer}
              setOpenDesktopNotificationDrawer={
                setOpenDesktopNotificationDrawer
              }
              setOpenLogoutPopover={setOpenLogoutPopover}
              isShowMobileLogoutModal={isShowMobileLogoutModal}
              openNotificationWithIcon={openNotificationWithIcon}
              openDownloadModal={openDownloadModal}
              setOpenDownloadModal={setOpenDownloadModal}
              isShowTelegramModal={isShowTelegramModal}
              isShowInviteBonusModal={isShowInviteBonusModal}
              setOpenInitailChargeModal={setOpenInitailChargeModal}
              isUILoading={isLoading}
              header={{
                mobile: isShowMobileHeader,
                tablet: isShowTabletHeader,
                desktop: isShowDesktopHeader,
              }}
              footer={{
                mobile: isShowMobileFooter,
                tablet: isShowTabletFooter,
                desktop: isShowDesktopFooter,
              }}
              tabBar={{
                mobile: isShowMobileTabBar,
                tablet: isShowTabletTabBar,
                desktop: isShowDesktopTabBar,
              }}
              menuDrawer={{
                mobile: isShowMobileMenuDrawer,
                tablet: isShowTabletMenuDrawer,
                desktop: isShowDesktopMenuDrawer,
                mobileOverChildren,
                tabletOverChildren,
                desktopOverChildren,
              }}
            >
              {props.children}
            </RiojunglePageTemplate>
          ),
          u5: (
            <U5PageTemplate
              showToolboxConfig={props.showToolboxConfig}
              onClickToDownload={onClickToDownloadU5}
              onClickToOpenTelegramManager={onClickToOpenTelegramManager}
              onClickToOpenTelegramService={onClickToOpenTelegramService}
              isCurrentPageCompanyProfile={isCurrentPageCompanyProfile}
              contextHolder={contextHolder}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              showLoginModal={showLoginModal}
              openDesktopNotificationDrawer={openDesktopNotificationDrawer}
              setOpenDesktopNotificationDrawer={
                setOpenDesktopNotificationDrawer
              }
              setOpenLogoutPopover={setOpenLogoutPopover}
              isShowMobileLogoutModal={isShowMobileLogoutModal}
              openNotificationWithIcon={openNotificationWithIcon}
              // openDownloadModal={openDownloadModal}
              // setOpenDownloadModal={setOpenDownloadModal}
              isShowTelegramModal={isShowTelegramModal}
              isShowInviteBonusModal={isShowInviteBonusModal}
              setOpenInitailChargeModal={setOpenInitailChargeModal}
              isUILoading={isLoading}
              header={{
                mobile: isShowMobileHeader,
                tablet: isShowTabletHeader,
                desktop: isShowDesktopHeader,
              }}
              footer={{
                mobile: isShowMobileFooter,
                tablet: isShowTabletFooter,
                desktop: isShowDesktopFooter,
              }}
              tabBar={{
                mobile: isShowMobileTabBar,
                tablet: isShowTabletTabBar,
                desktop: isShowDesktopTabBar,
              }}
              menuDrawer={{
                mobile: isShowMobileMenuDrawer,
                tablet: isShowTabletMenuDrawer,
                desktop: isShowDesktopMenuDrawer,
                mobileOverChildren,
                tabletOverChildren,
                desktopOverChildren,
              }}
            >
              {props.children}
            </U5PageTemplate>
          ),
          u6: (
            <U6PageTemplate
              isCurrentPageCompanyProfile={isCurrentPageCompanyProfile}
              contextHolder={contextHolder}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              showLoginModal={showLoginModal}
              openDesktopNotificationDrawer={openDesktopNotificationDrawer}
              setOpenDesktopNotificationDrawer={
                setOpenDesktopNotificationDrawer
              }
              setOpenLogoutPopover={setOpenLogoutPopover}
              isShowMobileLogoutModal={isShowMobileLogoutModal}
              openNotificationWithIcon={openNotificationWithIcon}
              openDownloadModal={openDownloadModal}
              setOpenDownloadModal={setOpenDownloadModal}
              isShowTelegramModal={isShowTelegramModal}
              onClickToOpenTelegramService={onClickToOpenTelegramService}
              isShowInviteBonusModal={isShowInviteBonusModal}
              setOpenInitailChargeModal={setOpenInitailChargeModal}
              onClickToDownload={onClickToDownload}
              onClickToOpenTelegramManager={onClickToOpenTelegramManager}
              // NOTICE: refactor
              showToolboxConfig={props.showToolboxConfig}
              header={{
                mobile: isShowMobileHeader,
                tablet: isShowTabletHeader,
                desktop: isShowDesktopHeader,
              }}
              footer={{
                mobile: isShowMobileFooter,
                tablet: isShowTabletFooter,
                desktop: isShowDesktopFooter,
              }}
              tabBar={{
                mobile: isShowMobileTabBar,
                tablet: isShowTabletTabBar,
                desktop: isShowDesktopTabBar,
              }}
              menuDrawer={{
                mobile: isShowMobileMenuDrawer,
                tablet: isShowTabletMenuDrawer,
                desktop: isShowDesktopMenuDrawer,
                mobileOverChildren,
                tabletOverChildren,
                desktopOverChildren,
              }}
            >
              {props.children}
            </U6PageTemplate>
          ),
          u7: (
            <U7PageTemplate
              isCurrentPageCompanyProfile={isCurrentPageCompanyProfile}
              contextHolder={contextHolder}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              showLoginModal={showLoginModal}
              openDesktopNotificationDrawer={openDesktopNotificationDrawer}
              setOpenDesktopNotificationDrawer={
                setOpenDesktopNotificationDrawer
              }
              setOpenLogoutPopover={setOpenLogoutPopover}
              isShowMobileLogoutModal={isShowMobileLogoutModal}
              openNotificationWithIcon={openNotificationWithIcon}
              isShowTelegramModal={isShowTelegramModal}
              onClickToOpenTelegramService={onClickToOpenTelegramService}
              isShowInviteBonusModal={isShowInviteBonusModal}
              setOpenInitailChargeModal={setOpenInitailChargeModal}
              onClickToDownload={onClickToDownload}
              onClickToOpenTelegramManager={onClickToOpenTelegramManager}
              // NOTICE: refactor
              showToolboxConfig={props.showToolboxConfig}
              header={{
                mobile: isShowMobileHeader,
                tablet: isShowTabletHeader,
                desktop: isShowDesktopHeader,
              }}
              footer={{
                mobile: isShowMobileFooter,
                tablet: isShowTabletFooter,
                desktop: isShowDesktopFooter,
              }}
              tabBar={{
                mobile: isShowMobileTabBar,
                tablet: isShowTabletTabBar,
                desktop: isShowDesktopTabBar,
              }}
              menuDrawer={{
                mobile: isShowMobileMenuDrawer,
                tablet: isShowTabletMenuDrawer,
                desktop: isShowDesktopMenuDrawer,
                mobileOverChildren,
                tabletOverChildren,
                desktopOverChildren,
              }}
            >
              {props.children}
            </U7PageTemplate>
          ),
          u9: (
            <U9PageTemplate
              isCurrentPageCompanyProfile={isCurrentPageCompanyProfile}
              contextHolder={contextHolder}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              showLoginModal={showLoginModal}
              openDesktopNotificationDrawer={openDesktopNotificationDrawer}
              setOpenDesktopNotificationDrawer={
                setOpenDesktopNotificationDrawer
              }
              setOpenLogoutPopover={setOpenLogoutPopover}
              isShowMobileLogoutModal={isShowMobileLogoutModal}
              openNotificationWithIcon={openNotificationWithIcon}
              openDownloadModal={openDownloadModal}
              setOpenDownloadModal={setOpenDownloadModal}
              isShowTelegramModal={isShowTelegramModal}
              onClickToOpenTelegramService={onClickToOpenTelegramService}
              isShowInviteBonusModal={isShowInviteBonusModal}
              setOpenInitailChargeModal={setOpenInitailChargeModal}
              onClickToDownload={onClickToDownload}
              onClickToOpenTelegramManager={onClickToOpenTelegramManager}
              // NOTICE: refactor
              showToolboxConfig={props.showToolboxConfig}
              header={{
                mobile: isShowMobileHeader,
                tablet: isShowTabletHeader,
                desktop: isShowDesktopHeader,
              }}
              footer={{
                mobile: isShowMobileFooter,
                tablet: isShowTabletFooter,
                desktop: isShowDesktopFooter,
              }}
              tabBar={{
                mobile: isShowMobileTabBar,
                tablet: isShowTabletTabBar,
                desktop: isShowDesktopTabBar,
              }}
              menuDrawer={{
                mobile: isShowMobileMenuDrawer,
                tablet: isShowTabletMenuDrawer,
                desktop: isShowDesktopMenuDrawer,
                mobileOverChildren,
                tabletOverChildren,
                desktopOverChildren,
              }}
            >
              {props.children}
            </U9PageTemplate>
          ),
        },
        <PernaPageTemplate
          isCurrentPageCompanyProfile={isCurrentPageCompanyProfile}
          contextHolder={contextHolder}
          isMobile={isMobile}
          isShowMobileFooter={isShowMobileFooter}
          isShowDesktopFooter={isShowMobileFooter}
          isShowDesktopHeader={isShowDesktopHeader}
          isShowDesktopMenuDrawer={isShowDesktopMenuDrawer}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          showLoginModal={showLoginModal}
          openDesktopNotificationDrawer={openDesktopNotificationDrawer}
          setOpenDesktopNotificationDrawer={setOpenDesktopNotificationDrawer}
          setOpenLogoutPopover={setOpenLogoutPopover}
          isShowMobileLogoutModal={isShowMobileLogoutModal}
          openMenuDrawer={openMenuDrawer}
          setOpenMenuDrawer={setOpenMenuDrawer}
          isShowLoginModal={isShowLoginModal}
          openNotificationWithIcon={openNotificationWithIcon}
          openDownloadModal={openDownloadModal}
          setOpenDownloadModal={setOpenDownloadModal}
          isShowTelegramModal={isShowTelegramModal}
          onClickToOpenTelegramService={onClickToOpenTelegramService}
          isShowInviteBonusModal={isShowInviteBonusModal}
          setOpenInitailChargeModal={setOpenInitailChargeModal}
          isShowMobileHeader={isShowMobileHeader}
          // Deprecated
          isShowTabbar={isShowTabbar}
          onClickToDownload={onClickToDownload}
          onClickToOpenTelegramManager={onClickToOpenTelegramManager}
          isUILoading={isLoading}
          showToolboxConfig={props.showToolboxConfig}
        >
          {props.children}
        </PernaPageTemplate>
      )}

      <PageTemplateLayers
        isShowLoginModal={isShowLoginModal}
        showLoginModal={showLoginModal}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        openNotificationWithIcon={openNotificationWithIcon}
        isShowMobileLogoutModal={isShowMobileLogoutModal}
        setOpenLogoutPopover={setOpenLogoutPopover}
        openDesktopNotificationDrawer={openDesktopNotificationDrawer}
        setOpenDesktopNotificationDrawer={setOpenDesktopNotificationDrawer}
        isShowDepositModal={isShowDepositModal}
        isShowInviteBonusModal={isShowInviteBonusModal}
        onClickToWallet={onClickToWallet}
        isShowTelegramModal={isShowTelegramModal}
        onClickToOpenTelegramGroup={onClickToOpenTelegramGroup}
        setOpenInitailChargeModal={setOpenInitailChargeModal}
        openDownloadModal={openDownloadModal}
        setOpenDownloadModal={setOpenDownloadModal}
        isShowMaintenanceModal={isShowMaintenanceModal}
        onClickToOpenTelegramService={onClickToOpenTelegramService}
      />

      {contextHolder}
    </>
  );
};
