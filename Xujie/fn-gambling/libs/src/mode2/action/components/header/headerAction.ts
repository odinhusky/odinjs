import handleGlobalClick from '@mode2/action/handleGlobalClick';
import {
  handleHomeActionClick,
  handleBackActionClick,
  handleVIPActionClick,
  handleWalletActionClick,
  handleMenuActionClick,
  handleLoginActionClick,
  handleForgotPasswordActionClick,
  handleMyDrawerActionClick,
  handlePrivacyPolicyLinkActionClick,
  handleMyPageActionClick,
} from '@mode2/action/components/header/actionType';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';

import {
  LoginFormType,
  useIsShowLoginModalStore,
} from '@mode2/zustand/loginStore';
import { useShowMenuStore } from '@mode2/zustand/menuStore';
import handleAction from '@mode2/action/common/handleAction';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useMyPageStore } from '@libs/mode2/zustand/page/myPageStore';
import { useMode2WebviewPageStore } from '@libs/mode2/zustand/page/webviewPageStore';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';
import {
  useNavigateClick,
  useNavPageClick,
} from '@mode2/usecase/useNavPageClick';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';

export type ActionClickPayloadMap = {
  [handleLoginActionClick]: { type: LoginFormType };
  [handleForgotPasswordActionClick]: void;
  [handleHomeActionClick]: void;
  [handleBackActionClick]: { callback?: () => void };
  [handleVIPActionClick]: void;
  [handleWalletActionClick]: void;
  [handleMenuActionClick]: void;
  [handleMyDrawerActionClick]: void;
  [handlePrivacyPolicyLinkActionClick]: void;
  [handleMyPageActionClick]: void;
};

export interface HandleHeaderOnEventProps<T extends keyof ActionClickPayloadMap>
  extends HandleClickProps<T, ActionClickPayloadMap> {}

const inGamePages: string[] = [
  BasePagePathObj.GamePage,
  BasePagePathObj.GameLobbyPage,
];
export const useHeaderAction = () => {
  const navigate = useNavigateClick();
  const { navToLoginPage, navToMyPage } = useNavPageClick();
  const setIsShowForgotPasswordModal = useIsShowLoginModalStore(
    (state) => state.setIsShowForgotPasswordModal
  );
  const toggleMenu = useShowMenuStore((state) => state.toggleMenu);
  const toggleMyDrawer = useMyPageStore((state) => state.toggleMyDrawer);

  const setIsShowRechargeContent = useMode2WebviewPageStore(
    (state) => state.setIsShowRechargeContent
  );
  const setCurSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.setCurSwitchContentTabId
  );
  const { isShowLoginModal } = useIsShowLoginModalStore();

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleLoginActionClick]: ({ type }) => {
      handleGlobalClick({
        target: handleLoginActionClick,
        callback: () => navToLoginPage(true, type),
      });
    },
    [handleForgotPasswordActionClick]: () => {
      handleGlobalClick({
        target: handleForgotPasswordActionClick,
        callback: () => setIsShowForgotPasswordModal(true),
      });
    },
    [handleHomeActionClick]: () => {
      handleGlobalClick({
        target: handleHomeActionClick,
        callback: () => {
          if (isShowLoginModal) {
            navToLoginPage(false);
          }
          navigate(BasePagePathObj.HallPage);
        },
      });
    },
    [handleBackActionClick]: ({ callback }) => {
      handleGlobalClick({
        target: handleBackActionClick,
        callback: () => {
          if (callback) callback();
          else navigate(-1);
        },
      });
    },
    [handleVIPActionClick]: () => {
      handleGlobalClick({
        target: handleVIPActionClick,
        callback: () => {
          navigate(BasePagePathObj.ActivityPage, {
            state: { tab: ActivityPageTabType.VIP },
          });
        },
      });
    },
    [handleWalletActionClick]: () => {
      handleGlobalClick({
        target: handleWalletActionClick,
        callback: () => {
          setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
          if (location.pathname !== BasePagePathObj.WalletPage) {
            navigate(BasePagePathObj.WalletPage, {
              state: { tab: WalletPageTabType.DEPOSIT },
            });
          }

          // if (inGamePages.includes(location.pathname)) {
          //   setIsShowRechargeContent(true);
          // } else {
          //   setCurSwitchContentTabId(WalletPageTabType.DEPOSIT);
          //   if (location.pathname !== BasePagePathObj.WalletPage) {
          //     navigate(BasePagePathObj.WalletPage, {
          //       state: { tab: WalletPageTabType.DEPOSIT }
          //     });
          //   }
          // }
        },
      });
    },
    [handleMenuActionClick]: () => {
      handleGlobalClick({
        target: handleWalletActionClick,
        callback: toggleMenu,
      });
    },
    [handleMyDrawerActionClick]: () => {
      handleGlobalClick({
        target: handleMyDrawerActionClick,
        callback: toggleMyDrawer,
      });
    },
    [handlePrivacyPolicyLinkActionClick]: () => {
      handleGlobalClick({
        target: handlePrivacyPolicyLinkActionClick,
        callback: () => {
          navToLoginPage(false);
          navigate(BasePagePathObj.PolicyPage);
        },
      });
    },
    [handleMyPageActionClick]: () => {
      handleGlobalClick({
        target: handlePrivacyPolicyLinkActionClick,
        callback: () => {
          navToMyPage();
        },
      });
    },
  };
  const handleHeaderClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleHeaderOnEventProps<T>) => {
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleHeaderClick,
  };
};

export default useHeaderAction;
