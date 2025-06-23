import {
  handleModifyPageFormConfirm,
  handleModifyPageFormConfirmFail,
  handleModifyPageCopyIDClick,
  handleModifyPageFormSubmitClick,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '../handleGlobalClick';
import {
  ModifyPageFormData,
  useModifyPageRefsStore,
} from '@libs/mode2/zustand/page/modifyPageStore';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';

type ActionClickPayloadMap = {
  [handleModifyPageFormConfirm]: { values: ModifyPageFormData };
  [handleModifyPageFormConfirmFail]: { errors: Error[] };
  [handleModifyPageCopyIDClick]: void;
  [handleModifyPageFormSubmitClick]: void;
};

export interface HandleModifyPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useModifyPageActions = () => {
  const modifyPageFormRef = useModifyPageRefsStore(
    (state) => state.modifyPageFormRef
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleModifyPageFormConfirm]: ({ values }) => {
      handleGlobalClick({
        target: handleModifyPageFormConfirm,
        payload: { values },
        callback: () => {
          console.log('@@', handleModifyPageFormConfirm, values);
        },
      });
    },
    [handleModifyPageFormConfirmFail]: ({ errors }) => {
      handleGlobalClick({
        target: handleModifyPageFormConfirmFail,
        callback: () => {
          console.log('@@', handleModifyPageFormConfirmFail, errors);
        },
      });
    },
    [handleModifyPageCopyIDClick]: () => {
      handleGlobalClick({
        target: handleModifyPageCopyIDClick,
        callback: () => {
          console.log('@@', handleModifyPageCopyIDClick);
        },
      });
    },
    [handleModifyPageFormSubmitClick]: () => {
      handleGlobalClick({
        target: handleModifyPageFormSubmitClick,
        callback: () => {
          modifyPageFormRef?.current?.handleSubmit();
        },
      });
    },
  };

  const handleModifyPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleModifyPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  // onConfirm 可以 export 出去給 Form 使用
  const onConfirm = (values: ModifyPageFormData) => {
    handleModifyPageClick({
      actionName: handleModifyPageFormConfirm,
      payload: {
        values,
      },
    });
  };

  const onConfirmFail = (errors: Error[]) => {
    handleModifyPageClick({
      actionName: handleModifyPageFormConfirmFail,
      payload: {
        errors,
      },
    });
  };

  return {
    actionClickObj,
    handleModifyPageClick,
    onConfirm,
    onConfirmFail,
  };
};

export default useModifyPageActions;
