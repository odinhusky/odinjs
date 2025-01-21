import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import handleAction from '@mode2/action/common/handleAction';
import { handleBackTopButtonActionClick } from '@mode2/action/components/backTopButton/acitonType';
import { useElementScroll } from '@commonUtils/useElementScroll';

type ActionClickPayloadMap = {
  [handleBackTopButtonActionClick]: {
    targetElementId: string;
  };
};

export interface HandleBackTopButtonOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

const useBackTopButtonAction = () => {
  const { scrollToTop } = useElementScroll();
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleBackTopButtonActionClick]: ({ targetElementId }) => {
      handleGlobalClick({
        target: handleBackTopButtonActionClick,
        callback: () => {
          scrollToTop(targetElementId);
        },
      });
    },
  };

  const handleBackTopButtonClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleBackTopButtonOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleBackTopButtonClick,
  };
};

export default useBackTopButtonAction;
