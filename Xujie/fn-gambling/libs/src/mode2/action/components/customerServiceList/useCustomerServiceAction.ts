import handleGlobalClick from '@mode2/action/handleGlobalClick';
import sdkUtils from '@mode2/utils/sdk';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import {
  handleCustomerServiceAction,
  handleFeedbackCustomerServiceAction,
  handleFooterCustomerServiceAction,
} from '@mode2/action/components/customerServiceList/acitonType';
import { isEmpty } from 'lodash';
import { useToastStore } from '@libs/mode2/zustand/components/toastStore';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

type ActionClickPayloadMap = {
  [handleCustomerServiceAction]: {
    isLink: boolean;
    target: string;
  };
  [handleFeedbackCustomerServiceAction]: {
    isLink: boolean;
    target: string;
  };
  [handleFooterCustomerServiceAction]: {
    isLink: boolean;
    target: string;
  };
};

export interface HandleCustomerServiceOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useCustomerServiceAction = () => {
  const navigate = useNavigateClick();
  const showToast = useToastStore((state) => state.showToast);
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleCustomerServiceAction]: ({ isLink, target }) => {
      handleGlobalClick({
        target: handleCustomerServiceAction,
        callback: () => {
          if (isLink) {
            if (isEmpty(target)) {
              // TODO Evan i18n 尚未支援功能
              showToast('This feature is not enabled yet');
            } else {
              sdkUtils.openBrowser(target);
            }
          } else {
            navigate(target);
          }
        },
      });
    },
    [handleFeedbackCustomerServiceAction]: ({ isLink, target }) => {
      handleGlobalClick({
        target: handleFeedbackCustomerServiceAction,
        callback: () => {
          if (isLink) {
            if (isEmpty(target)) {
              // TODO Evan i18n 尚未支援功能
              showToast('This feature is not enabled yet');
            } else {
              sdkUtils.openBrowser(target);
            }
          } else {
            navigate(target);
          }
        },
      });
    },
    [handleFooterCustomerServiceAction]: ({ isLink, target }) => {
      handleGlobalClick({
        target: handleFooterCustomerServiceAction,
        callback: () => {
          if (isLink) {
            if (isEmpty(target)) {
              // TODO Evan i18n 尚未支援功能
              showToast('This feature is not enabled yet');
            } else {
              sdkUtils.openBrowser(target);
            }
          } else {
            navigate(target);
          }
        },
      });
    },
  };

  const handleCustomerServiceClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleCustomerServiceOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleCustomerServiceClick,
  };
};

export default useCustomerServiceAction;
