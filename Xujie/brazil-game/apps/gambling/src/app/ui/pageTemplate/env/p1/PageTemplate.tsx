import styled from "styled-components";
import {environment} from "../../../../../environments/environment";

import cx from "../../../utils/cx";
import {LogoutModal} from "../../../modals/LogoutModal";
import {ErrorBoundary} from "react-error-boundary";
import {TabBar} from "../../tabBar";
import {Toolbox} from "../../Toolbox/env/p1";
import {ThreeDots} from "react-loading-icons";
import React, {useEffect} from "react";
import {MenuDrawerContainer} from "../../../drawers/MenuDrawer/MenuDrawerContainer";
import {UserLoginStatusModal} from "../../../modals/UserLoginStatusModal";
import {UserLoginStatusDrawers} from "../../../drawers/UserLoginStatusDrawers";

import {MobileHeader} from "../../header/env/p1/MobileHeader";
import {MenuDrawerContent} from "../../../drawers/MenuDrawer/env/pernambucana/MenuDrawerContent";

import {TShowToolboxConfig} from "../../base/types";
import useBreakpoint from "../../hooks/useBreakpoint";
import { Header } from "../../header";
import { BaseStyledPageTemplate } from "../../base/BaseStyledPageTemplate";
import { IUseSingletonPageTemplateConfig } from "../../hooks/useSingletonPageTemplateConfig";
import { BaseErrorBoundary } from "../../base/BaseErrorBoundary";
import { MenuDrawer } from "../../../drawers/MenuDrawer";
import { Footer } from "../../footer";
import { twMerge } from "tailwind-merge";

export const BASE_TAB_HEIGHT = 60
export const BASE_DRAWER_WIDTH = 248

type IStyledPage = {
  isCurrentPageCompanyProfile: boolean;
}

export const StyledPage = styled.div.attrs((props) => ({
  className: "h-full"
}))<IStyledPage>`
  &:before {
    content: "";
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    //box-shadow: 0 0 3rem 0.5rem #306347 inset;
    //background-color:#306347;
  }

  &:after {
    content: "";
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -2;
    background: url("assets/${environment.uVersion}/${environment.mVersion}/bg_image.png") center top no-repeat;
    background-size: cover;

    @media (max-width: 768px) {
      background: url("assets/${environment.uVersion}/${environment.mVersion}/bg_image_m.png") center bottom /130% auto;
    }
  }

  ${(props) => props.isCurrentPageCompanyProfile && `
    background: url("assets/${environment.uVersion}/bg.888bcf29.png") no-repeat center center/100% auto;
    background-color:#090b0f;
  `};
  @media (min-width: 640px) {
    &:after {
      //background: url("assets/bgImg.3a85b39c.jpg") no-repeat center center/100% auto;
    }
  }
`;


type IPageTemplate = {
  children?: React.ReactNode;
  isCurrentPageCompanyProfile: boolean;
  contextHolder: any;
  isMobile: boolean;
  isShowMobileFooter: boolean;
  isShowDesktopFooter: boolean;
  isShowDesktopHeader: boolean;
  isShowDesktopMenuDrawer: boolean;
  isLogin: boolean;
  setIsLogin: (value: any) => void;
  showLoginModal: (value: any) => void;
  openDesktopNotificationDrawer: boolean;
  setOpenDesktopNotificationDrawer: (value: any) => void;
  setOpenLogoutPopover: (value: any) => void;
  isShowMobileLogoutModal: boolean;

  openMenuDrawer: boolean;
  setOpenMenuDrawer: (value: any) => void;
  isShowLoginModal: boolean;
  openNotificationWithIcon: (value: any) => void;
  openDownloadModal: boolean;
  setOpenDownloadModal: (value: any) => void;
  isShowTelegramModal: boolean;
  onClickToOpenTelegramService: () => void;
  isShowInviteBonusModal: boolean;
  setOpenInitailChargeModal: (value: any) => void;
  isShowMobileHeader: boolean;
  isShowTabbar: boolean;
  onClickToDownload: () => void;
  onClickToOpenTelegramManager: () => void;
  isUILoading: boolean;
  showToolboxConfig?: TShowToolboxConfig
} & IUseSingletonPageTemplateConfig

export const PageTemplate = ({
                                                 children,
                                                 isCurrentPageCompanyProfile,
                                                 contextHolder,
                                                 isMobile,
                                                  isShowMobileFooter,
                                                  isShowDesktopFooter,
                                                 isShowDesktopHeader,
                                                 isLogin,
                                                 setIsLogin,
                                                 showLoginModal,
                                                 openDesktopNotificationDrawer,
                                                 setOpenDesktopNotificationDrawer,
                                                 setOpenLogoutPopover,
                                                 isShowMobileLogoutModal,
                                                 isShowDesktopMenuDrawer,
                                                 openMenuDrawer,
                                                 setOpenMenuDrawer,
                                                 isShowLoginModal,
                                                 openNotificationWithIcon,
                                                 openDownloadModal,
                                                 setOpenDownloadModal,

                                                 isShowTelegramModal,
                                                 onClickToOpenTelegramService,
                                                 isShowInviteBonusModal,
                                                 setOpenInitailChargeModal,
                                                 isShowMobileHeader,
                                                 onClickToDownload,
                                                 onClickToOpenTelegramManager,
                                                 isShowTabbar,
                                                 isUILoading,
showToolboxConfig,
  header,
  menuDrawer,
  tabBar,
  footer
}: IPageTemplate) => {

  useEffect(() => {
    if(!isMobile) {
      setOpenMenuDrawer(true)
    } else {
      setOpenMenuDrawer(false);
    }
  }, [isMobile]);

  const { isDesktop, isTablet} = useBreakpoint();

  // show
  const isShowHeader = header.mobile || header.tablet || header.desktop;
  const isShowFooter = footer.mobile || footer.tablet || footer.desktop;
  const isShowMenuDrawer = menuDrawer.mobile || menuDrawer.tablet || menuDrawer.desktop;

  const isShowTabBar = tabBar.mobile || tabBar.tablet || tabBar.desktop;

  // NOTICE: refactor me
  // NOTE: Style - Header
  const HeaderHeight =  !isShowHeader ? 0 : isDesktop ? 68 :  isTablet ? 68 : 52.5;

  // NOTE: Style - MenuDrawer
  const DrawerWidth = BASE_DRAWER_WIDTH;
  const MenuDrawerTop = isDesktop ? 130 : 0;
  const MenuDrawerZIndex = "z-[1003]";

  // NOTE: Style - TabBar
  const TabHeight = (tabBar.mobile || tabBar.tablet || tabBar.desktop) ? BASE_TAB_HEIGHT : 0;

  // NOTE: Style - Toolbox (fixed)
  const ToolboxZIndex = "z-10"

  const childrenMarginLeft = (isMobile && menuDrawer.mobile && menuDrawer.mobileOverChildren ||
    isTablet && menuDrawer.tablet && menuDrawer.tabletOverChildren ||
    isDesktop && menuDrawer.desktop && menuDrawer.desktopOverChildren) ? 0 : DrawerWidth;

  return (
    <StyledPage
      isCurrentPageCompanyProfile={isCurrentPageCompanyProfile}
    >

      {/*Refactor ME*/}
      {contextHolder}

      {isDesktop && isShowDesktopHeader && (
       <Header
          onClickToDownload={onClickToDownload}
          isLogin={isLogin}
          onClickUserLoginStatusDrawer={() => {
            // setOpenNonMobileUserLoginStatusDrawer(true);
            showLoginModal(true)
          }}
          className={"fixed top-0 left-0 right-0 w-full h-[68px] z-10"}
          onClickToOpenNotificationDrawer={() => {
            setOpenDesktopNotificationDrawer(true)
          }}
          onClickToChangeLogoutPopover={(display: boolean) => {
            setOpenLogoutPopover(display);
          }}
          openLogoutPopover={isShowMobileLogoutModal}
        />
      )}

      {/*<div className={"h-full flex flex-row"}>*/}
      {/*  /!*{isShowDesktopMenuDrawer && openMenuDrawer && (*!/*/}
      {/*  /!*  <MenuDrawer*!/*/}
      {/*  /!*    className={cx("fixed left-0 bottom-0 w-[276px] min-w-[276px] h-full z-30", {*!/*/}
      {/*  /!*      "w-[0px]": !isShowDesktopMenuDrawer,*!/*/}
      {/*  /!*    })}*!/*/}
      {/*  /!*    closeMenuDrawer={ () => {*!/*/}
      {/*  /!*      setOpenMenuDrawer(false)*!/*/}
      {/*  /!*    }}/>*!/*/}
      {/*  /!*)}*!/*/}

      {/*  {*/}
      {/*    isShowMenuDrawer && (*/}
      {/*      <div*/}
      {/*        className={`fixed left-0 ${MenuDrawerZIndex}`}*/}
      {/*        style={{*/}
      {/*          top: MenuDrawerTop*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <MenuDrawer*/}
      {/*          onClickToDownload={onClickToDownload}*/}
      {/*        />*/}

      {/*      </div>*/}
      {/*    )*/}
      {/*  }*/}

      {/*  /!*{isShowMenuDrawer && (*!/*/}
      {/*  /!*  <MenuDrawerContainer className={"rounded-r-3xl"}>*!/*/}
      {/*  /!*    <MenuDrawerContent/>*!/*/}
      {/*  /!*  </MenuDrawerContainer>*!/*/}
      {/*  /!*)}*!/*/}

      {/*  <div className={cx("w-full h-full", {*/}
      {/*    "relative": !isMobile,*/}
      {/*    "top-[100px]": isShowDesktopHeader,*/}
      {/*    "left-[276px] w-[calc(100vw-276px)]": !isMobile && isShowDesktopMenuDrawer,*/}
      {/*    "bg-[]": !isCurrentPageCompanyProfile && !isMobile,//背景色*/}
      {/*  })} style={{*/}
      {/*  }}>*/}
      {/*    */}
      {/*  </div>*/}
      {/*</div>*/}

      {
        isShowMenuDrawer && (
          <div
            className={`fixed left-0 h-full ${MenuDrawerZIndex}`}
            style={{
              top: MenuDrawerTop
            }}
          >
            <MenuDrawer
              isShowMenuDrawer={isShowMenuDrawer}
              onClickToDownload={onClickToDownload}
            />

          </div>
        )
      }

      {isMobile && isShowMobileHeader && (
        <MobileHeader
          clickToOpenMenuDrawer={() => {
            setOpenMenuDrawer(!openMenuDrawer)
          }}
          clickToOpenUserLoginStatusModal={() => {
            // setShowUserLoginStatusMobileModal(true);
            showLoginModal(true)
          }}
        />
      )}

      {isMobile && isShowMobileLogoutModal && (
        <LogoutModal/>
      )}

      {/*NOTE: 佔據高度*/}
      {isMobile ? (
        isShowMobileHeader && <div className={"h-[52.5px]"}></div>
      ) : (
        isShowMobileHeader && <div className={"h-[13px]"}></div>
      )}

      <div
        style={{
          position: 'fixed',
          top: HeaderHeight,
          width: '100%',
          height: `calc(100% - ${HeaderHeight}px - ${TabHeight}px)`,
        }}
      >
        <div
          id='page-container'
          className='h-full overflow-y-auto'
          style={{
            marginLeft: isShowMenuDrawer? childrenMarginLeft: 0
          }}
        >
          <BaseErrorBoundary>
            {children}
          </BaseErrorBoundary>

          {
            isShowFooter && (
              <Footer />
            )
          }

        </div>
      </div>

      {isMobile && isShowTabBar && (
        <TabBar isShowSlot={false} isShowActivity={true} />
      )}

      {/*Toolbox*/}
      {showToolboxConfig !== false && (
        <div className={cx(ToolboxZIndex, "fixed right-[16px] bottom-[160px]")}>
          <Toolbox
            showToolboxConfig={showToolboxConfig}
            onClickToDownload={onClickToDownload}
            onClickToOpenTelegramManager={onClickToOpenTelegramManager}
            onClickToOpenTelegramService={onClickToOpenTelegramService}
          />
        </div>
      )}

      {isUILoading && (
        <div className={"z-[9999] fixed top-0 left-0 right-0 bottom-0 bg-black flex flex-col justify-center items-center"}>
          <img className={"w-[60px] mb-6"} src={`/assets/${environment.uVersion}/${environment.mvVersion}/logo_m.png`}/>
          <ThreeDots height={25} className={'inline-block'} />
        </div>
      )}

    </StyledPage>

  )
}
