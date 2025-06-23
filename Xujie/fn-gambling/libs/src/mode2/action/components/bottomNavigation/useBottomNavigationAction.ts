import {
  handleBottomNavigationButtonClick,
  handleMobileExclusiveNavButtonClick,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import handleAction from '@mode2/action/common/handleAction';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { BasePagePathObj, BasePagePaths } from '@mode2/routerTypes/types';
import { useDeviceStore } from '@mode2/zustand/deviceStore';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import sdkUtils from '@mode2/utils/sdk';
import { NavigateOptions } from 'react-router/dist/lib/context';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { useRouterPenddingDataStore } from '@libs/mode2/zustand/routerPenddingDataStore';

type ActionClickPayloadMap = {
  [handleBottomNavigationButtonClick]: {
    // label: string;
    navigateTarget: BasePagePaths;
    options?: NavigateOptions;
  };
  [handleMobileExclusiveNavButtonClick]: {
    // label: string;
    navigateTarget: BasePagePaths;
    options?: NavigateOptions;
  };
};

export type ActionClickObjType = {
  [K in keyof ActionClickPayloadMap]: ActionClickPayloadMap[K] extends void
    ? () => void // 如果參數是 void 或 undefined，函數不需要參數
    : (arg: ActionClickPayloadMap[K]) => void;
};

export interface HandleBottomNavigationOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

const refreshUserDataPages = new Set<BasePagePaths>([
  BasePagePathObj.HallPage,
  BasePagePathObj.MyPage,
]);
export const useBottomNavigationActions = () => {
  const { navToLoginPage, mapRoutesNavTo } = useNavPageClick();
  const setOpenMyDrawer = useMyPageStore((state) => state.setOpenMyDrawer);
  const refreshUserData = useUserProfileStore((state) => state.refreshUserData);
  const clearAllPaths = useRouterPenddingDataStore(
    (state) => state.clearAllPaths
  );

  const actionClickObj: ActionClickObjType = {
    [handleBottomNavigationButtonClick]: ({ navigateTarget, options }) => {
      handleGlobalClick({
        target: handleBottomNavigationButtonClick,
        payload: { navigateTarget, options },
        callback: () => {
          const isMobile = useDeviceStore.getState().isMobile;
          if (!isMobile && navigateTarget === BasePagePathObj.MyPage) {
            if (sdkUtils.isCurrentLogin()) {
              setOpenMyDrawer(true);
            } else {
              navToLoginPage(36);
            }
          } else {
            mapRoutesNavTo(navigateTarget, '', options);
          }

          // 清除所有路由(Tab)數據
          clearAllPaths();
        },
      });
    },
    [handleMobileExclusiveNavButtonClick]: ({ navigateTarget, options }) => {
      handleGlobalClick({
        target: handleMobileExclusiveNavButtonClick,
        payload: { navigateTarget, options },
        callback: () => {
          if (navigateTarget === BasePagePathObj.MyPage) {
            if (sdkUtils.isCurrentLogin()) {
              mapRoutesNavTo(navigateTarget, '', options);
            } else {
              navToLoginPage(77);
            }
          } else {
            mapRoutesNavTo(navigateTarget, '', options);
          }
          if (refreshUserDataPages.has(navigateTarget)) {
            refreshUserData();
          }

          // 清除所有路由(Tab)數據
          clearAllPaths();
        },
      });
    },
  };

  const handleBottomNavigationClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleBottomNavigationOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleBottomNavigationClick,
  };
};

export default useBottomNavigationActions;
