import { AnnouncementType } from '@mode2/@types/announcementType';
import { GameListItemResult } from '@mode2/zustand/page/hallPageStore';
import useActivityStrategy from '@mode2/usecase/announcement/strategy/useActivityStrategy';
import usePopupStrategy from '@mode2/usecase/announcement/strategy/usePopupStrategy';
import useHomeStrategy from '@mode2/usecase/announcement/strategy/useHomeStrategy';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import useGuestAllAnnouncementStrategy from '@mode2/usecase/announcement/strategy/useGuestAllAnnouncementStrategy';
import { UserRoleType } from '@mode2/@types/userRoleTypes';
import { ParsingAnnouncementResult } from '@mode2/usecase/announcement/useParsingAnnouncementsContent';

export enum AnnouncementScenariosType {
  HOME = 'HOME',
  POPUP = 'POPUP',
  ACTIVITY = 'ACTIVITY',
  ALL = 'ALL',
}

export interface ActionPayload {
  type: AnnouncementType;
  gameObj?: GameListItemResult;
  linkUrl?: string;
  mataData: ParsingAnnouncementResult;
}

/**
 * 首頁 Banner
 * 首頁 Popup Banner
 * 活動大廳 Banner
 *
 * 使用決策模式 判斷可行動的 action 及 action 邏輯切割
 * 透過 useParsingAnnouncementsContent 依照不同使用情境 解析出正確 {Type, Content}
 * 統一管理 onAction 接口 onAnnouncementAction();
 * MappingStrategy: [HomeAnnouncementsTypeMappingStrategy, PopupAnnouncementsTypeMappingStrategy, ActivityAnnouncementsTypeMappingStrategy]
 *
 */
export const useAnnouncementActionBase = () => {
  const { onAction: onHomeStrategyAction } = useHomeStrategy();
  const { onAction: onPopupStrategyAction } = usePopupStrategy();
  const { onAction: onActivityStrategyAction } = useActivityStrategy();
  const { onAction: onGuestStrategyAction } = useGuestAllAnnouncementStrategy();

  const isV6Guest = () => {
    return (
      import.meta.env['VITE_V_VERSION'] === 'v6' &&
      useUserProfileStore.getState().userRole === UserRoleType.GUEST
    );
  };

  /**
   * 依照 使用情境
   * @param type
   * @param gameObj
   */
  const onAnnouncementAction = (
    type: AnnouncementScenariosType,
    payload: ActionPayload
  ) => {
    if (isV6Guest()) {
      onGuestStrategyAction(payload);
      return;
    }

    switch (type) {
      case AnnouncementScenariosType.HOME:
        onHomeStrategyAction(payload);
        break;
      case AnnouncementScenariosType.POPUP:
        onPopupStrategyAction(payload);
        break;
      case AnnouncementScenariosType.ACTIVITY:
        onActivityStrategyAction(payload);
        break;
    }
  };

  return {
    onAnnouncementAction,
  };
};

export default useAnnouncementActionBase;
