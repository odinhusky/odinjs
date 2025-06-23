import handleGlobalClick from '@mode2/action/handleGlobalClick';
import {
  handleFooterHyperlinkActionClick,
  handleFooterSocialActionClick,
} from '@mode2/action/actionTypes';
import sdkUtils from '@mode2/utils/sdk';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleAction from '@mode2/action/common/handleAction';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';

type ActionClickPayloadMap = {
  [handleFooterHyperlinkActionClick]: {
    isLink: boolean;
    target: string;
  };
  [handleFooterSocialActionClick]: {
    isLink: boolean;
    target: string;
  };
};

export interface HandleFooterOnEventProps<T extends keyof ActionClickPayloadMap>
  extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useFooterAction = () => {
  const navigate = useNavigateClick();

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleFooterHyperlinkActionClick]: ({ isLink, target }) => {
      handleGlobalClick({
        target: handleFooterHyperlinkActionClick,
        payload: { isLink, target },
        callback: () => {
          if (isLink) {
            sdkUtils.openBrowser(target);
          } else {
            navigate(target);
          }
        },
      });
    },
    [handleFooterSocialActionClick]: ({ isLink, target }) => {
      handleGlobalClick({
        target: handleFooterSocialActionClick,
        payload: { isLink, target },
        callback: () => {
          // TODO
        },
      });
    },
  };

  const handleFooterClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleFooterOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleFooterClick,
  };
};

export default useFooterAction;
