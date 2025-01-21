import { handlePolicyPageDesktopHeaderBackBtnClick } from './actionType';
import { HandleClickProps } from '../common/handleClickProps';
import { ActionClickObjType } from '../common/actionClickObjetType';
import handleGlobalClick from '../handleGlobalClick';
import handleAction from '../common/handleAction';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

type ActionClickPayloadMap = {
  [handlePolicyPageDesktopHeaderBackBtnClick]: void;
};

export interface HandleRecordPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const usePolicyPageActions = () => {
  const navigate = useNavigateClick();

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handlePolicyPageDesktopHeaderBackBtnClick]: () => {
      handleGlobalClick({
        target: handlePolicyPageDesktopHeaderBackBtnClick,
        callback: () => {
          navigate(-1);
        },
      });
    },
  };

  const handlePolicyPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleRecordPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handlePolicyPageClick,
  };
};

export default usePolicyPageActions;
