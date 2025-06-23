import { handleTemplateLayoutCloseMyDrawerBtnClick } from '@mode2/action/actionTypes';

import handleGlobalClick from '../handleGlobalClick';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { useMyPageStore } from '@libs/mode2/zustand/page/myPageStore';

type ActionClickPayloadMap = {
  [handleTemplateLayoutCloseMyDrawerBtnClick]: void;
};

export interface HandleTemplateLayoutClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useTemplateLayoutActions = () => {
  const setOpenMyDrawer = useMyPageStore((state) => state.setOpenMyDrawer);

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleTemplateLayoutCloseMyDrawerBtnClick]: () => {
      handleGlobalClick({
        target: handleTemplateLayoutCloseMyDrawerBtnClick,
        callback: () => {
          setOpenMyDrawer(false);
        },
      });
    },
  };

  const handleTemplateLayoutClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleTemplateLayoutClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleTemplateLayoutClick,
  };
};

export default useTemplateLayoutActions;
