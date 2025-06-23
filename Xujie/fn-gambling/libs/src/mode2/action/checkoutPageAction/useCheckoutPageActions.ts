import {
  handleCheckoutPageSuccessOKClick,
  handleCheckoutPageUTRConfirmClick,
  handleCheckoutPageCopyClick,
  handleCheckoutPageDownLoadQRCodeClick,
  handleCheckoutPageErrorBackClick,
  handleCheckoutPageToCustomerServiceClick,
  handleCheckoutPageShowTutorialClick,
  handleCheckoutPageCloseTutorialClick,
} from '@mode2/action/actionTypes';
import handleGlobalClick from '../handleGlobalClick';

import { ActionClickObjType } from '../common/actionClickObjetType';
import { HandleClickProps } from '../common/handleClickProps';
import handleAction from '../common/handleAction';
import { useClipboard } from '@commonUtils/hooks/useClipboard';

import { usePostPayCheckoutConfirmMutation } from '@mode2API/index';
import { PayCheckoutConfirmRequest } from '@libs/mode2/external/api/endpoint/wallet/PostPayCheckoutConfirmEndpoint';
import { INV6 } from '@libs/constant/versions';

type ActionClickPayloadMap = {
  [handleCheckoutPageCopyClick]: {
    value: string;
    target: string;
  };
  [handleCheckoutPageUTRConfirmClick]: {
    data: PayCheckoutConfirmRequest;
    onFinally?: () => void;
    onSuccess?: () => void;
  };
  [handleCheckoutPageSuccessOKClick]: { callback: () => void };
  [handleCheckoutPageDownLoadQRCodeClick]: HTMLCanvasElement | undefined;
  [handleCheckoutPageErrorBackClick]: { callback: () => void };
  [handleCheckoutPageToCustomerServiceClick]: void;
  [handleCheckoutPageShowTutorialClick]: { callback: () => void };
  [handleCheckoutPageCloseTutorialClick]: { callback: () => void };
};

export interface HandleCheckoutPageClickProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useCheckoutPageActions = () => {
  const { copyToClipboard } = useClipboard();

  const [triggerPayUTRConfirm] = usePostPayCheckoutConfirmMutation();

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleCheckoutPageCopyClick]: ({ value, target }) => {
      handleGlobalClick({
        target: handleCheckoutPageCopyClick + `_${target}`,
        callback: () => {
          copyToClipboard(value, {
            successMessage:
              import.meta.env['VITE_V_VERSION'] === INV6
                ? 'spin_and_share_wheel_copied_toast'
                : '',
            resetInterval: 100,
          });
        },
        debounceTimer: 300,
      });
    },
    [handleCheckoutPageUTRConfirmClick]: ({ data, onFinally, onSuccess }) => {
      handleGlobalClick({
        target: handleCheckoutPageUTRConfirmClick,
        callback: () => {
          triggerPayUTRConfirm(data)
            .then((res) => {
              if ('data' in res && res.data) {
                onSuccess?.();
              }
            })
            .finally(onFinally);
        },
      });
    },
    [handleCheckoutPageSuccessOKClick]: ({ callback }) => {
      handleGlobalClick({
        target: handleCheckoutPageSuccessOKClick,
        callback,
      });
    },

    [handleCheckoutPageDownLoadQRCodeClick]: (canvas) => {
      handleGlobalClick({
        target: handleCheckoutPageDownLoadQRCodeClick,
        callback: () => {
          if (!canvas) return;
          const link = document.createElement('a');
          link.href = canvas.toDataURL();
          link.download = 'UPI.png';
          link.click();
        },
      });
    },
    [handleCheckoutPageErrorBackClick]: ({ callback }) => {
      handleGlobalClick({
        target: handleCheckoutPageErrorBackClick,
        callback,
      });
    },
    [handleCheckoutPageToCustomerServiceClick]: () => {
      handleGlobalClick({
        target: handleCheckoutPageToCustomerServiceClick,
        callback: () => {
          //TODO
        },
      });
    },
    [handleCheckoutPageShowTutorialClick]: ({ callback }) => {
      handleGlobalClick({
        target: handleCheckoutPageShowTutorialClick,
        callback,
      });
    },
    [handleCheckoutPageCloseTutorialClick]: ({ callback }) => {
      handleGlobalClick({
        target: handleCheckoutPageCloseTutorialClick,
        callback,
      });
    },
  };

  const handleCheckoutPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleCheckoutPageClickProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleCheckoutPageClick,
  };
};

export default useCheckoutPageActions;
