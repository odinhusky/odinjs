import { handleBindKYCPageDesktopHeaderBackBtnClick } from './actionType';

import handleGlobalClick from '../handleGlobalClick';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

type ActionClickPayloadMap = {
  [handleBindKYCPageDesktopHeaderBackBtnClick]: void;
};

export interface HandleBindKYCPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useBindKYCPageActions = () => {
  const navigate = useNavigateClick();

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleBindKYCPageDesktopHeaderBackBtnClick]: () => {
      handleGlobalClick({
        target: handleBindKYCPageDesktopHeaderBackBtnClick,
        callback: () => {
          navigate(-1);
        },
      });
    },
  };

  const handleBindKYCPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleBindKYCPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleBindKYCPageClick,
  };
};

export default useBindKYCPageActions;
