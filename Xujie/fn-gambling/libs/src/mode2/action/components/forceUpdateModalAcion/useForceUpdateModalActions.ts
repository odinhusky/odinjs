import { handleCloseForceUpdateModalBtnClick } from './actionType';

import handleGlobalClick from '../../handleGlobalClick';

import { ActionClickObjType } from '../../common/actionClickObjetType';
import { HandleClickProps } from '../../common/handleClickProps';
import handleAction from '../../common/handleAction';
import sdkUtils from '@libs/mode2/utils/sdk';
import { ActivityPageTabType } from '@mode2/@types/activityPageTabType';

type ActionClickPayloadMap = {
  [handleCloseForceUpdateModalBtnClick]: { idx: ActivityPageTabType };
};

export interface HandleForceUpdateModalClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useForceUpdateModalActions = () => {
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleCloseForceUpdateModalBtnClick]: () => {
      handleGlobalClick({
        target: handleCloseForceUpdateModalBtnClick,
        callback: () => {
          // 下載 dmg 更新
          const url = import.meta.env['VITE_DOWNLOAD_APK_URL'];
          sdkUtils.openBrowser(url);
        },
      });
    },
  };

  const handleForceUpdateModalClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleForceUpdateModalClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleForceUpdateModalClick,
  };
};

export default useForceUpdateModalActions;
