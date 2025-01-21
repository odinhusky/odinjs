import handleGlobalClick from '@mode2/action/handleGlobalClick';
import { HandleClickProps } from '@mode2/action/common/handleClickProps';
import { ActionClickObjType } from '@mode2/action/common/actionClickObjetType';
import handleAction from '@mode2/action/common/handleAction';
import {
  handleMenuAnnouncementsActionClick,
  handleMenuPlatformItemActionClick,
  handleMenuRouterActionClick,
} from './actionType';
import { GameListItemResult } from '@mode2/zustand/page/hallPageStore';
import { useGameItemBase } from '@mode2/usecase/useGameItemBase';
import { useShowMenuStore } from '@mode2/zustand/menuStore';
import { AnnouncementResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import sdkUtils from '@mode2/utils/sdk';
import { AdjustEventKey } from '@mode2/utils/sdk/persistant/adjust/AdjustEventKey';
import useAnnouncementActionBase, {
  AnnouncementScenariosType,
} from '@mode2/usecase/announcement/useAnnouncementActionBase';

type ActionClickPayloadMap = {
  [handleMenuRouterActionClick]: {
    callback: () => void;
  };
  [handleMenuPlatformItemActionClick]: { item: GameListItemResult };
  [handleMenuAnnouncementsActionClick]: { item: AnnouncementResult };
};

export interface HandleMenuOnEventProps<T extends keyof ActionClickPayloadMap>
  extends HandleClickProps<T, ActionClickPayloadMap> {}

const mappingAdjustEventKey: Record<string, AdjustEventKey> = {
  ['EVOLUTION']: AdjustEventKey.CLICK_EVO,
  ['JDB']: AdjustEventKey.CLICK_JDB,
  ['JILI']: AdjustEventKey.CLICK_JL,
  ['WINDY']: AdjustEventKey.CLICK_ATG,
};

export const useMenuAction = () => {
  const { onEnterGame } = useGameItemBase();
  const { onAnnouncementAction } = useAnnouncementActionBase();
  const closeMenu = useShowMenuStore((state) => state.closeMenu);
  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleMenuRouterActionClick]: ({ callback }) => {
      handleGlobalClick({
        target: handleMenuRouterActionClick,
        callback,
      });
    },
    [handleMenuPlatformItemActionClick]: ({ item }) => {
      handleGlobalClick({
        target: handleMenuPlatformItemActionClick,
        callback: () => {
          onEnterGame(item);
          closeMenu();
          const eventKey = mappingAdjustEventKey[item.manufacturer] || null;
          if (eventKey != null) {
            sdkUtils.sendEvent(eventKey);
          }
        },
      });
    },
    [handleMenuAnnouncementsActionClick]: ({ item }) => {
      handleGlobalClick({
        target: handleMenuAnnouncementsActionClick,
        callback: () => {
          onAnnouncementAction(AnnouncementScenariosType.HOME, {
            type: item.type,
            gameObj: item.gameObj,
          });
          closeMenu();
        },
      });
    },
  };

  const handleMenuClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleMenuOnEventProps<T>) => {
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };
  return {
    actionClickObj,
    handleMenuClick,
  };
};

export default useMenuAction;
