import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import {
  handleFABDrawerActionClick,
  handleFloatActionButtonActionClick,
  handleFloatActionInboxButtonActionClick,
} from '@mode2/action/components/floatActionButton/acitonType';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleGlobalClick from '@mode2/action/handleGlobalClick';
import sdkUtils from '@mode2/utils/sdk';
import handleAction from '@mode2/action/common/handleAction';
import { useFloatActionButtonListStore } from '@mode2/zustand/components/floatActionButtonStore';
import { isEmpty } from 'lodash';
import { useToastStore } from '@libs/mode2/zustand/components/toastStore';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';
import { useMode2FeedBackPageTabStore } from '@mode2/zustand/page/feedbackPageStore';
import { feedBackPageTabIdObj } from '@mode2/@types/feedBackPageTab';
import { BasePagePathObj } from '@mode2/routerTypes/types';

type ActionClickPayloadMap = {
  [handleFABDrawerActionClick]: void;
  [handleFloatActionButtonActionClick]: {
    isLink: boolean;
    target: string;
  };
  [handleFloatActionInboxButtonActionClick]: void;
};

export interface HandleFloatActionButtonOnEventProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

const useFloatActionButtonAction = () => {
  const navigate = useNavigateClick();
  const showToast = useToastStore((state) => state.showToast);
  const toggleFABDrawer = useFloatActionButtonListStore(
    (state) => state.toggleFABDrawer
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleFABDrawerActionClick]: () => {
      handleGlobalClick({
        target: handleFABDrawerActionClick,
        callback: () => {
          toggleFABDrawer();
        },
      });
    },
    [handleFloatActionInboxButtonActionClick]: () => {
      handleGlobalClick({
        target: handleFloatActionInboxButtonActionClick,
        callback: () => {
          navigate(BasePagePathObj.FeedBackPage, {
            state: { tab: feedBackPageTabIdObj.INBOX },
          });
        },
      });
    },

    [handleFloatActionButtonActionClick]: ({ isLink, target }) => {
      handleGlobalClick({
        target: handleFloatActionButtonActionClick,
        callback: () => {
          if (isLink) {
            if (isEmpty(target)) {
              // TODO Evan i18n 尚未支援功能
              showToast('This feature is not enabled yet');
            } else {
              sdkUtils.openBrowser(target);
            }
          } else {
            useMode2FeedBackPageTabStore
              .getState()
              .setActiveTabId(feedBackPageTabIdObj.INBOX);
            navigate(target);
          }
        },
      });
    },
  };

  const handleFloatActionButtonClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleFloatActionButtonOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleFloatActionButtonClick,
  };
};

export default useFloatActionButtonAction;
