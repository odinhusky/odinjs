import handleGlobalClick from '@mode2/action/handleGlobalClick';
import sdkUtils from '@mode2/utils/sdk';
import { handleSocialActionClick } from '@mode2/action/actionTypes';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleAction from '@mode2/action/common/handleAction';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { SchemeData } from '@constant/AppSchemeData';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';

export enum ActionType {
  LINK,
  POST,
  NAVIGATE,
  NONE,
}

type ActionClickPayloadMap = {
  [handleSocialActionClick]: {
    type: ActionType;
    appScheme?: SchemeData | null;
    target: string;
  };
};

export interface HandleSocialOnEventProps<T extends keyof ActionClickPayloadMap>
  extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useSocialAction = () => {
  const navigate = useNavigateClick();

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleSocialActionClick]: ({ type, appScheme, target }) => {
      handleGlobalClick({
        target: handleSocialActionClick,
        payload: { type, appScheme, target },
        callback: () => {
          switch (type) {
            case ActionType.LINK:
              try {
                if (appScheme) {
                  sdkUtils.tryOpenAppFromSchema(
                    appScheme.scheme,
                    appScheme.url
                  );
                }
              } catch (e) {
                console.log('@@@===>handleSocialActionClick', e);
              }
              break;
            case ActionType.POST:
              if (appScheme) {
                const link = useUserProfileStore.getState().referralLink; // 當前邀請連結碼
                const postLink = appScheme.postShareLink(
                  encodeURIComponent(link),
                  ''
                );
                sdkUtils.openBrowser(postLink);
              }
              break;
            case ActionType.NAVIGATE:
              navigate(target);
              break;
            case ActionType.NONE:
              break;
          }
        },
      });
    },
  };

  const handleSocialClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleSocialOnEventProps<T>) => {
    // 共同邏輯抽出
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleSocialClick,
  };
};

export default useSocialAction;
