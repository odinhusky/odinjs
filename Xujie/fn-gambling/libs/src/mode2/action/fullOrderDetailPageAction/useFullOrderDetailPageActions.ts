import { ActionClickObjType } from '../common/actionClickObjetType';
import handleAction from '../common/handleAction';
import { HandleClickProps } from '../common/handleClickProps';
import handleGlobalClick from '../handleGlobalClick';
import {
  handleFullOrderDetailPageConfirmClick,
  handleFullOrderDetailPageInputClick,
  handleFullOrderDetailPageUploadClick,
} from './actionType';
import { useMode2FullOrderDetailPageStore } from '@libs/mode2/zustand/page/fullOrderDetailPageStore';
import { useFullOrder } from '@mode2/usecase/useFullOrder';

type ActionClickPayloadMap = {
  [handleFullOrderDetailPageInputClick]: { value: string };
  [handleFullOrderDetailPageUploadClick]: { value: File };
  [handleFullOrderDetailPageConfirmClick]: void;
};

export interface HandleFullOrderDetailPageOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useFullOrderDetailPageActions = () => {
  const { onUpdate, onUpload } = useFullOrder();

  const defaultValues = useMode2FullOrderDetailPageStore(
    (state) => state.defaultValues
  );
  const setDefaultValues = useMode2FullOrderDetailPageStore(
    (state) => state.setDefaultValues
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleFullOrderDetailPageInputClick]: ({ value }) => {
      handleGlobalClick({
        target: handleFullOrderDetailPageInputClick,
        callback: () => {
          setDefaultValues({ ...defaultValues, confirmCode: value });
        },
      });
    },
    [handleFullOrderDetailPageUploadClick]: ({ value }) => {
      handleGlobalClick({
        target: handleFullOrderDetailPageUploadClick,
        callback: async () => {
          onUpload(value);
        },
      });
    },
    [handleFullOrderDetailPageConfirmClick]: () => {
      handleGlobalClick({
        target: handleFullOrderDetailPageConfirmClick,
        callback: () => {
          onUpdate();
        },
      });
    },
  };

  const handleFullOrderDetailPageClick = <
    T extends keyof ActionClickPayloadMap
  >({
    actionName,
    payload,
  }: HandleFullOrderDetailPageOnEventProps<T>) => {
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleFullOrderDetailPageClick,
  };
};

export default useFullOrderDetailPageActions;
