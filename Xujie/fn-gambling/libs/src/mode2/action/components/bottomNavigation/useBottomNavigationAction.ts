import { handleBottomNavigationButtonClick } from '@mode2/action/components/bottomNavigation/acitonType';
import { handleFeedBackPageTabClick } from '@mode2/action/feedBackPageAction/acitonType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import handleAction from '@mode2/action/common/handleAction';
import { useNavPageClick } from '@mode2/usecase/useNavPageClick';
import { BasePagePathObj, BasePagePaths } from '@mode2/routerTypes/types';
import { useDeviceStore } from '@mode2/zustand/deviceStore';
import { useMyPageStore } from '@mode2/zustand/page/myPageStore';
import sdkUtils from '@mode2/utils/sdk';
import { NavigateOptions } from 'react-router/dist/lib/context';

type ActionClickPayloadMap = {
  [handleBottomNavigationButtonClick]: {
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

export const useBottomNavigationActions = () => {
  const { navToLoginPage, mapRoutesNavTo } = useNavPageClick();
  const setOpenMyDrawer = useMyPageStore((state) => state.setOpenMyDrawer);

  const actionClickObj: ActionClickObjType = {
    [handleBottomNavigationButtonClick]: ({ navigateTarget, options }) => {
      handleGlobalClick({
        target: handleFeedBackPageTabClick,
        callback: () => {
          const isMobile = useDeviceStore.getState().isMobile;
          if (!isMobile && navigateTarget === BasePagePathObj.MyPage) {
            if (sdkUtils.isCurrentLogin()) {
              setOpenMyDrawer(true);
            } else {
              navToLoginPage();
            }
          } else {
            mapRoutesNavTo(navigateTarget, '', options);
          }
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
