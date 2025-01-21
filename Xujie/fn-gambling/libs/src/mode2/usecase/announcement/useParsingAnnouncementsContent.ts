import {
  EnterGameType,
  fillGameListItemMissingValues,
  GameListItemResult,
  mapEnterGameType,
} from '@mode2/zustand/page/hallPageStore';
import { getHtml } from '@libs/commonUtils';
import { AnnouncementType } from '@mode2/@types/announcementType';
import { AnnouncementScenariosType } from '@mode2/usecase/announcement/useAnnouncementActionBase';
import { ActivityAnnouncementsTypeMappingStrategy } from '@mode2/usecase/announcement/strategy/useActivityStrategy';
import { PopupAnnouncementsTypeMappingStrategy } from '@mode2/usecase/announcement/strategy/usePopupStrategy';
import { HomeAnnouncementsTypeMappingStrategy } from '@mode2/usecase/announcement/strategy/useHomeStrategy';

export interface AnnouncementOriginalData {
  Title?: string;
  Content?: string;
  Image?: string;
  DetailImg?: string;
  CreateTime?: number;
  Type?: number;
  IsMySelfShow?: number;
  IsSidebarShow?: number;
  IsHomeShow?: number;
  IsActivityShow?: number;
}

export interface ParsingAnnouncementResult {
  type: AnnouncementType;
  bannerUrl: string;
  title: string;
  gameObj?: GameListItemResult;
  linkUrl?: string;
  showInSidebar: boolean;
  showInMyPage: boolean;
  rewardAmount?: number;
}

const AnnouncementsTypeMapping: Record<
  AnnouncementScenariosType,
  { [key: string]: AnnouncementType }
> = {
  [AnnouncementScenariosType.HOME]: HomeAnnouncementsTypeMappingStrategy,
  [AnnouncementScenariosType.POPUP]: PopupAnnouncementsTypeMappingStrategy,
  [AnnouncementScenariosType.ACTIVITY]:
    ActivityAnnouncementsTypeMappingStrategy,
};

/**
 * 解析[Announcements] 共用邏輯
 * 首頁 Banner
 * 首頁 Popup Banner
 * 活動大廳 Banner
 * @param type
 * @param items
 */
export const useParsingAnnouncementsContent = (
  scenariosType: AnnouncementScenariosType,
  items: AnnouncementOriginalData[]
): ParsingAnnouncementResult[] => {
  const typeMapping =
    AnnouncementsTypeMapping[scenariosType] ||
    HomeAnnouncementsTypeMappingStrategy;
  return items
    .filter((item) => {
      // 過濾使用場景
      switch (scenariosType) {
        case AnnouncementScenariosType.HOME:
          return item.IsHomeShow === undefined || item.IsHomeShow === 1;
        case AnnouncementScenariosType.POPUP:
          return true;
        case AnnouncementScenariosType.ACTIVITY:
          return item.IsActivityShow === undefined || item.IsActivityShow === 1;
      }
    })
    .filter((item) => {
      const type = typeMapping[item.Type || ''] || AnnouncementType.UNKNOWN;
      return type !== AnnouncementType.UNKNOWN;
    })
    .map((item: AnnouncementOriginalData) => {
      const type = typeMapping[item.Type || ''] || AnnouncementType.UNKNOWN;

      let gameObj: GameListItemResult | undefined;
      let linkUrl: string | undefined;
      let rewardAmount: number | undefined;

      if (scenariosType === AnnouncementScenariosType.POPUP) {
        const reward = getHtml(item?.Content || '');
        rewardAmount = reward ? Number(reward || '') : undefined;
      }

      if (type === AnnouncementType.WHATS_APP) {
        linkUrl = getHtml(item?.Content || '');
      }
      if (type === AnnouncementType.TELEGRAM) {
        linkUrl = getHtml(item?.Content || '');
      }
      if (type === AnnouncementType.ENTER_GAME) {
        const gameId = item.Content ? getHtml(item.Content) : '0';
        gameObj = fillGameListItemMissingValues({
          gameId: Number(gameId),
          enterGameType: EnterGameType.DIRECT,
        });
      }

      if (type === AnnouncementType.ENTER_DIRECTORY) {
        const hots = item.Content ? JSON.parse(getHtml(item.Content)) : null;
        gameObj = fillGameListItemMissingValues({
          name: hots?.Name || '',
          platform: hots?.Platform || '',
          platformId: hots?.PlatformId || 0,
          gameId: hots?.GameId || 0,
          isHotGame: hots?.IsHot === 1,
          coverImageSrc: hots?.Logo || hots?.NameLogo || '', // NameLogo是只帶有game name和黑色背景的圖
          manufacturer: hots?.Manufacturer || '',
          enterGameType: mapEnterGameType(
            hots?.IsEnterLobby || 0,
            hots?.IsGame || 0
          ),
        });
      }

      return {
        type: type,
        title: item.Title || '',
        bannerUrl: item.Image || '',
        gameObj: gameObj,
        linkUrl: linkUrl,
        showInSidebar: item.IsSidebarShow === 1,
        showInMyPage: item.IsMySelfShow === 1,
        rewardAmount: rewardAmount,
      };
    });
};
