import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { appSlice, QueueModalEnum } from '../../reduxStore/appSlice';

import { NotificationDrawer } from '../drawers/NotificationDrawer';

import { DepositAdvertisementModal } from '../modals/DepositAdvertisementModal';
import { TelegramContactModal } from '../modals/TelegramContactModal';
import { InviteBonusModal } from '../modals/InviteBonusModal';
import { DownloadModal } from '../modals/DownloadModal';
import { MaintenanceModal } from '../modals/MaintenanceModal';

import { UserInfoStatusPopover } from '../popovers/UserInfoStatusPopover';

import { PageOrModalPathEnum } from '../PageOrModalPathEnum';
import {
  IQueryStringProps,
  usePageNavigate,
} from '../router/hooks/usePageNavigate';
import { UserLoginStatusModal } from '../modals/UserLoginStatusModal';
import BoxModal from '../modals/BoxModal';
import DailyCashBackModal from '../modals/DailyCashBackModal';
import LossReliefModal from '../modals/LossReliefModal';
import { IOpenNotificationWithIcon } from '../pageTemplate';
import { RootState } from '../../reduxStore';
import { uiSlice } from '../../reduxStore/uiSlice';
import { GameSearchModal } from '../modals/GameSearchModal';
import { useClickFavoriteGameItem } from '../hooks/useClickFavoriteGameItem';
import { TelegramDetailContactModal } from '../modals/TelegramDetailContactModal';
import { IOSDownloadModal } from '../modals/IOSDownloadModal';
import useBreakpoint from '../pageTemplate/hooks/useBreakpoint';

import { MenuDrawerCollapseButton } from '../../ui/pageTemplate/env/u5/MenuDrawerCollapseButton';
import { AppLocalStorage } from '../../persistant/localstorage';
import { AppLocalStorageKey } from '../../persistant/AppLocalStorageKey';
import { ActivityPageRouter } from '../pages/ActivityPage';
import { removeRedirectLocalStorage } from '../utils/loginRedirect';
import { environment } from 'apps/gambling/src/environments/environment';
import cx from '../utils/cx';
import { useQueueModalShow } from '../hooks/useQueueModalShow';
import LuckyWheelDetailModal from '../modals/LuckyWheelDetailModal';
import LuckyWheelLuckyValueInsufficientModal from '../modals/LuckyWheelLuckyValueInsufficientModal';
import LogoutConfirmModal from '../modals/LogoutModal/LogoutConfirmModal';

type IModalOpen = {
  isOpen: boolean;
  open: (open: boolean) => void;
};
export type IPageTemplateLayers = {
  isShowLoginModal: boolean;
  showLoginModal: IModalOpen['open'];
  isLogin: boolean;
  setIsLogin: (login: boolean) => void;
  openNotificationWithIcon: (props: IOpenNotificationWithIcon) => void;
  isShowMobileLogoutModal: IModalOpen['isOpen'];
  setOpenLogoutPopover: IModalOpen['open'];

  openDesktopNotificationDrawer: IModalOpen['isOpen'];
  setOpenDesktopNotificationDrawer: IModalOpen['open'];

  isShowDepositModal: boolean;
  isShowInviteBonusModal: boolean;

  onClickToWallet: (queryString?: IQueryStringProps) => void;
  onClickToOpenTelegramGroup: () => void;
  onClickToOpenTelegramService: () => void;

  isShowTelegramModal: IModalOpen['isOpen'];
  setOpenInitailChargeModal: IModalOpen['open'];

  openDownloadModal: IModalOpen['isOpen'];
  setOpenDownloadModal: IModalOpen['open'];

  isShowMaintenanceModal: IModalOpen['isOpen'];
};

export const PageTemplateLayers = ({
  isShowLoginModal,
  showLoginModal,
  isLogin,
  setIsLogin,
  openNotificationWithIcon,
  isShowMobileLogoutModal,
  setOpenLogoutPopover,
  openDesktopNotificationDrawer,
  setOpenDesktopNotificationDrawer,
  isShowDepositModal,
  isShowInviteBonusModal,
  onClickToWallet,
  isShowTelegramModal,
  onClickToOpenTelegramGroup,
  setOpenInitailChargeModal,
  openDownloadModal,
  setOpenDownloadModal,
  isShowMaintenanceModal,
  onClickToOpenTelegramService,
}: IPageTemplateLayers) => {
  // - Redux
  const openUserInfoStatusPopover = useSelector(
    (state: RootState) => state.ui.openUserInfoStatusPopover
  );
  const isShowDailyCashBackModal = useSelector(
    (state: RootState) => state.app.isShowDailyCashBackModal
  );
  const isShowLossReliefModal = useSelector(
    (state: RootState) => state.app.isShowLossReliefModal
  );
  const isShowBoxModal = useSelector(
    (state: RootState) => state.app.isShowBoxModal
  );
  const isShowGameSearchModal = useSelector(
    (state: RootState) => state.app.isShowGameSearchModal
  );
  const isShowTelegramDetailContactModal = useSelector(
    (state: RootState) => state.app.isShowTelegramDetailContactModal
  );
  const isShowLuckyWheelLuckyValueDetailModal = useSelector(
    (state: RootState) => state.app.isShowLuckyWheelLuckyValueDetailModal
  );
  const isShowLuckyWheelLuckyValueInsufficientModal = useSelector(
    (state: RootState) => state.app.isShowLuckyWheelLuckyValueInsufficientModal
  );

  const { isMobile, isDesktop, isTablet } = useBreakpoint();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { onClickFavoriteGameItem } = useClickFavoriteGameItem();

  const location = useLocation();
  const { onClickToOpenTelegramManager, onClickToActivity } = usePageNavigate();

  const { closeQueueModal } = useQueueModalShow({
    readyCallback: (bool) => {
      dispatch(appSlice.actions.setIsReadyToShowDepositIntervalModal(bool));
    },
  });

  // NOTE: iOSDownloadPopover
  const isShowiOSDownloadPopover = useSelector(
    (state: RootState) => state.app.isShowiOSDownloadPopover
  );
  // 連平板都支援下載
  const isShowIOSDOwnloadModal =
    isShowiOSDownloadPopover && (isMobile || isTablet);

  const isInGameRoute =
    location.pathname === PageOrModalPathEnum.GamePage ? true : false;

  const [isCloseAnimation, setIsCloseAnimation] = useState(false);
  const [shouldDispatchClose, setShouldDispatchClose] = useState(false);

  useEffect(() => {
    if (openUserInfoStatusPopover && !isCloseAnimation) {
      setShouldDispatchClose(true);
    }
  }, [openUserInfoStatusPopover]);

  useEffect(() => {
    if (openUserInfoStatusPopover && isCloseAnimation && shouldDispatchClose) {
      let timeout = setTimeout(() => {
        dispatch(uiSlice.actions.closeUserInfoStatusPopover());
        setIsCloseAnimation(false);
      }, 600);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isCloseAnimation, openUserInfoStatusPopover, shouldDispatchClose]);

  // 為了避免 Modal 打開的時候後面還可以繼續滑動
  useEffect(() => {
    if (
      isShowMaintenanceModal ||
      openDownloadModal ||
      isShowIOSDOwnloadModal ||
      isShowTelegramModal ||
      isShowInviteBonusModal ||
      (isShowDepositModal && !isShowInviteBonusModal) ||
      isShowTelegramDetailContactModal ||
      isShowMobileLogoutModal ||
      isShowLuckyWheelLuckyValueDetailModal ||
      isShowLuckyWheelLuckyValueInsufficientModal
    ) {
      document.querySelector('body')?.classList.add('overflow-hidden');
    } else {
      document.querySelector('body')?.classList.remove('overflow-hidden');
    }

    return () => {
      document.querySelector('body')?.classList.remove('overflow-hidden');
    };
  }, [
    isShowMaintenanceModal,
    openDownloadModal,
    isShowIOSDOwnloadModal,
    isShowTelegramModal,
    isShowInviteBonusModal,
    isShowDepositModal,
    isShowTelegramDetailContactModal,
    isShowMobileLogoutModal,
    isShowLuckyWheelLuckyValueDetailModal,
    isShowLuckyWheelLuckyValueInsufficientModal,
  ]);

  return (
    <>
      {/*Login*/}
      {isShowLoginModal && (
        <UserLoginStatusModal
          showCloseButton={true}
          openNotificationWithIcon={openNotificationWithIcon}
          close={() => {
            showLoginModal(false);
            removeRedirectLocalStorage();
          }}
          setIsLogin={(login: boolean) => setIsLogin(login)}
        />
      )}

      {/* LogoutModal */}
      {isShowMobileLogoutModal ? (
        <LogoutConfirmModal isShow={isShowMobileLogoutModal} />
      ) : null}

      {/*UserInfoStatusPopover*/}
      <>
        {/* 開合的按鈕 */}
        {isDesktop &&
        isLogin &&
        !isInGameRoute &&
        environment.uVersion === 'u5' ? (
          <div
            className="fixed right-0 top-[48px] z-[1001] w-5 h-full flex items-center"
            style={openUserInfoStatusPopover ? { right: 480 } : undefined}
          >
            <MenuDrawerCollapseButton
              type="right"
              isOpenMenuDrawer={openUserInfoStatusPopover}
              onClick={() =>
                dispatch(
                  uiSlice.actions.setUserInfoStatusPopover(
                    !openUserInfoStatusPopover
                  )
                )
              }
            />
          </div>
        ) : null}
        {/* UserInfoStatusPopover 個人資訊的 popover openUserInfoStatusPopover */}
        {openUserInfoStatusPopover && (
          <UserInfoStatusPopover
            close={
              environment.uVersion === 'u2'
                ? () => {
                    setIsCloseAnimation(true);
                  }
                : () => {
                    dispatch(uiSlice.actions.closeUserInfoStatusPopover());
                  }
            }
            className={cx({ animate__slideOutRight: isCloseAnimation })}
          />
        )}
      </>

      {/*NotificationDrawer*/}
      {openDesktopNotificationDrawer && (
        <NotificationDrawer
          closeDrawer={() => {
            setOpenDesktopNotificationDrawer(false);
          }}
        />
      )}

      {/*DepositAdvertisementModal 餘額不足 */}
      {/* isShowDepositModal && !isShowInviteBonusModal && */}
      {/* DepositModal 一定要給 key，因為不是只有 useQueueModalShow 會控制他打開的時機點 */}
      {isShowDepositModal && !isShowInviteBonusModal && (
        <DepositAdvertisementModal
          close={() => {
            closeQueueModal(`${QueueModalEnum.DEPOSIT}`);
          }}
          onConfirm={() => {
            closeQueueModal(`${QueueModalEnum.DEPOSIT}`);
            onClickToWallet({ panelType: 'deposit' });
          }}
        />
      )}

      {/*TelegramContactModal isShowTelegramModal 加入電報群Modal */}
      {isShowTelegramModal && (
        <TelegramContactModal
          close={() => {
            dispatch(appSlice.actions.setShowTelegramModal(false));
          }}
          toTelegramGroup={() => {
            dispatch(appSlice.actions.setShowTelegramModal(false));
            onClickToOpenTelegramGroup();
          }}
        />
      )}

      {/*比 TelegramContactModal 還上層*/}
      {/*InviteBonusModal isShowInviteBonusModal*/}
      {isShowInviteBonusModal && (
        <InviteBonusModal
          close={() => {
            setOpenInitailChargeModal(false);
            closeQueueModal();
          }}
          onConfirm={() => {
            closeQueueModal();
            dispatch(appSlice.actions.setShowTelegramModal(false));
            navigate(PageOrModalPathEnum.InvitePage);
          }}
        />
      )}

      {/* 活動 - 救援金 Modal */}
      {isShowLossReliefModal ? (
        <LossReliefModal
          isOpen={isShowLossReliefModal}
          onClose={() => {
            closeQueueModal();
          }}
          onConfirm={() => {
            closeQueueModal();
            if (isLogin) {
              onClickToActivity({ category: ActivityPageRouter.LOSS_RELIEF });
            } else {
              showLoginModal(true);
              AppLocalStorage.setItem(
                AppLocalStorageKey.loginRedirect,
                PageOrModalPathEnum.ActivityHallPage
              );
              AppLocalStorage.setItem(
                AppLocalStorageKey.loginRedirectParam,
                `category=${ActivityPageRouter.LOSS_RELIEF}`
              );
            }
          }}
        />
      ) : null}

      {/* 活動 - 每日反水 Modal */}
      {isShowDailyCashBackModal ? (
        <DailyCashBackModal
          isOpen={isShowDailyCashBackModal}
          onClose={() => {
            closeQueueModal();
          }}
          onConfirm={() => {
            closeQueueModal();
            if (isLogin) {
              onClickToActivity({
                category: ActivityPageRouter.DAILY_CASHBACK,
              });
            } else {
              showLoginModal(true);
              AppLocalStorage.setItem(
                AppLocalStorageKey.loginRedirect,
                PageOrModalPathEnum.ActivityHallPage
              );
              AppLocalStorage.setItem(
                AppLocalStorageKey.loginRedirectParam,
                `category=${ActivityPageRouter.DAILY_CASHBACK}`
              );
            }
          }}
        />
      ) : null}

      {/* 活動 - 寶箱 Modal */}
      {isShowBoxModal ? (
        <BoxModal
          isOpen={isShowBoxModal}
          onClose={() => {
            closeQueueModal();
          }}
          onConfirm={() => {
            closeQueueModal();
            if (isLogin) {
              onClickToActivity({
                category: ActivityPageRouter.BOX_INVITE_REWARD,
              });
            } else {
              showLoginModal(true);
              AppLocalStorage.setItem(
                AppLocalStorageKey.loginRedirect,
                PageOrModalPathEnum.ActivityHallPage
              );
              AppLocalStorage.setItem(
                AppLocalStorageKey.loginRedirectParam,
                `category=${ActivityPageRouter.BOX_INVITE_REWARD}`
              );
            }
          }}
        />
      ) : null}

      {/*DownloadModal openDownloadModal*/}
      {openDownloadModal && (
        <DownloadModal
          close={() => {
            setOpenDownloadModal(false);
          }}
        />
      )}

      {/*NOTE: IOSDownloadModal isShowIOSDOwnloadModal*/}
      {isShowIOSDOwnloadModal && (
        <div className={cx('fixed inset-0 z-[1100]')}>
          {
            <IOSDownloadModal
              onClose={() => {
                dispatch(appSlice.actions.setShowiOSDownloadPopover(false));
              }}
            />
          }
        </div>
      )}

      {/*MaintenanceModal*/}
      {isShowMaintenanceModal && (
        <MaintenanceModal
          onClickToOpenTelegramService={onClickToOpenTelegramService}
        />
      )}

      {/*NOTICE: GameSearchModal*/}
      {isShowGameSearchModal && (
        <GameSearchModal
          onClickFavoriteGameItem={onClickFavoriteGameItem}
          onClose={() =>
            dispatch(appSlice.actions.setShowGameSearchModal(false))
          }
        />
      )}

      {/* TelegramDetailContactModal 客服 Modal isShowTelegramDetailContactModal */}
      {isShowTelegramDetailContactModal && (
        <TelegramDetailContactModal
          onClickToOpenTelegramService={onClickToOpenTelegramService}
          onClickToOpenTelegramManager={onClickToOpenTelegramManager}
          onClose={() => {
            dispatch(appSlice.actions.setShowTelegramDetailContactModal(false));
          }}
        />
      )}

      {/* 轉盤幸運值詳情 Modal isShowLuckyWheelLuckyValueDetailModal */}
      {isShowLuckyWheelLuckyValueDetailModal ? (
        <LuckyWheelDetailModal
          onClose={() => {
            dispatch(
              appSlice.actions.setIsShowLuckyWheelLuckyValueDetailModal(false)
            );
          }}
        />
      ) : null}

      {/* 轉盤幸運值不夠 Modal isShowLuckyWheelLuckyValueInsufficientModal */}
      <LuckyWheelLuckyValueInsufficientModal
        isShow={isShowLuckyWheelLuckyValueInsufficientModal}
        onClose={() => {
          dispatch(
            appSlice.actions.setIsShowLuckyWheelLuckyValueInsufficientModal(
              false
            )
          );
        }}
      />
    </>
  );
};
