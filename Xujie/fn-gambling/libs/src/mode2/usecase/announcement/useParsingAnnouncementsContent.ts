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
  Id?: number;
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

  LobbyImage?: string; // 用在活動大廳
  IsPopup?: number; // 用在首頁彈窗時機
  Parameter?: unknown; // 用在首頁彈窗參數
  PopupOrder?: number; // 用在首頁彈窗順序

  PopupImage?: string; // 用於動態活動彈窗 999
  PopupContent?: string; // 用於動態活動彈窗 999
}

export interface ParsingAnnouncementResult {
  id: number;
  orderId: number;
  type: AnnouncementType;
  bannerUrl: string;
  lobbyBannerUrl: string;
  title: string;
  gameObj?: GameListItemResult;
  linkUrl?: string;
  showInSidebar: boolean;
  showInMyPage: boolean;
  rewardAmount?: number;
  popupParameterJson?: string;
  innerHtml?: string;

  popupBannerUrl?: string; // 用於動態活動彈窗 999
  popupInnerHtml?: string; // 用於動態活動彈窗 999
}

export const AllAnnouncementsTypeMappingStrategy: {
  [key: string]: AnnouncementType;
} = {
  '999': AnnouncementType.DYNAMIC_ACTIVITY, //999
  '0': AnnouncementType.NOTHING, //  無行為
  '1': AnnouncementType.FIRST_CHARGE, // 導航到 wallet
  '2': AnnouncementType.RECHARGING, // 導航到 wallet
  '3': AnnouncementType.TELEGRAM, // open telegram
  '4': AnnouncementType.SIGN, // 簽到
  '5': AnnouncementType.INVITE_NEW_PLAYER, // 邀請新玩家
  '6': AnnouncementType.PIGGY_BANK, // 顯示獎勵  popup
  '7': AnnouncementType.RED_PACKET, // 啟動活動
  '8': AnnouncementType.DOWNLOAD, // 下載apk
  '9': AnnouncementType.MONTHLY_REBATE, // ??
  '10': AnnouncementType.ENTER_GAME, // 啟動遊戲
  '11': AnnouncementType.ENTER_DIRECTORY, // 啟動遊戲大廳
  '12': AnnouncementType.CHARGE_WHEEL, //	nav 充值轮盘
  '13': AnnouncementType.INVITE, // 導航到 invite
  '14': AnnouncementType.TEAM_CLUB, // 導航到 team_club
  '15': AnnouncementType.VIP, // nav VIP
  '16': AnnouncementType.INVITE_WHEEL, // nav 進邀请轮盘
  '17': AnnouncementType.WHATS_APP, // open whatsapp
  '18': AnnouncementType.RANKINGS, // nav 排行榜
  '19': AnnouncementType.INVITE_REWARD, // nav team_club 邀请奖励

  '20': AnnouncementType.WATCH_VIDEO, // 20 看影片拿獎勵金
  '21': AnnouncementType.WEEK_LUCKY_BONUS, //21 週儲值活動
  '22': AnnouncementType.SURPRISE_REWARD, //22 驚喜獎勵
  '23': AnnouncementType.VIP_REBATE, //23 VIP返利
  '24': AnnouncementType.WINNINGS_SHARE, //24
  '25': AnnouncementType.GIFT_CODE, //25
  '26': AnnouncementType.PUBLISH_AND_SHARE, //26
  '27': AnnouncementType.NEW_PLAYER_TASK, // 27
  '28': AnnouncementType.DAILY_TASK, // 28
  '29': AnnouncementType.LOW_BALANCE_RECHARGE, // 29
  '32': AnnouncementType.LOW_BALANCE_RESCUE_BOX, // 32
  '33': AnnouncementType.DEPOSIT_JACKPOT_WHEEL, // 33
};

export const AnnouncementsTypeMapping: Record<
  AnnouncementScenariosType,
  { [key: string]: AnnouncementType }
> = {
  [AnnouncementScenariosType.ALL]: AllAnnouncementsTypeMappingStrategy,
  [AnnouncementScenariosType.HOME]: HomeAnnouncementsTypeMappingStrategy,
  [AnnouncementScenariosType.POPUP]: PopupAnnouncementsTypeMappingStrategy,
  [AnnouncementScenariosType.ACTIVITY]:
    ActivityAnnouncementsTypeMappingStrategy,
};

const SUPPORT_INNER_HTML_CONTENTS = [
  AnnouncementType.FIRST_CHARGE,
  AnnouncementType.DYNAMIC_ACTIVITY,
];
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
        case AnnouncementScenariosType.ALL:
          return true;
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
    .map((item: AnnouncementOriginalData, index) => {
      const type = typeMapping[item.Type || ''] || AnnouncementType.UNKNOWN;
      let gameObj: GameListItemResult | undefined;
      let linkUrl: string | undefined;
      let rewardAmount: number | undefined;
      let innerHtml: string | undefined;

      const parameterJson = item.Parameter
        ? JSON.stringify(item.Parameter)
        : '';

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
        let gameId: string;
        if (import.meta.env['VITE_V_VERSION'] === 'v6') {
          try {
            const parameter: { gameId: string } = JSON.parse(
              parameterJson || '{"gameId": "0"}'
            );
            gameId = parameter.gameId;
          } catch (e) {
            gameId = '0';
          }
        } else {
          gameId = item.Content ? getHtml(item.Content) : '0';
        }

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

      if (SUPPORT_INNER_HTML_CONTENTS.includes(type)) {
        try {
          innerHtml = item.Content ? getHtml(item.Content) : item.Content;
        } catch (e) {
          innerHtml = '';
        }
      }

      return {
        id: item?.Id || index,
        orderId: item.PopupOrder || index,
        type: type,
        title: item.Title || '',
        bannerUrl:
          scenariosType === AnnouncementScenariosType.ACTIVITY
            ? item.LobbyImage || ''
            : item.Image || '',
        lobbyBannerUrl: item.LobbyImage || '',
        gameObj: gameObj,
        linkUrl: linkUrl,
        showInSidebar: item.IsSidebarShow === 1,
        showInMyPage: item.IsMySelfShow === 1,
        rewardAmount: rewardAmount,
        popupParameterJson: parameterJson,
        innerHtml: innerHtml,

        popupBannerUrl: item?.PopupImage,
        popupInnerHtml: item.PopupContent
          ? getHtml(item.PopupContent)
          : undefined,
      };
    });
};

// 首儲：[
//   {"amount":100 , "reward:10"}
//   ,.....]
// 邀請輪盤： {"withdrawRequire":500}
// 驚喜獎勵：{"reward":27 , startTime:"20250304000000" , endTime:"20250305000000"}
// 投注返水：{"betTime":1741026973 , "bets":678124 , "reward": 275.81}

export const RequiredParameterCheckTypes: AnnouncementType[] = [
  // AnnouncementType.RECHARGING,
  // AnnouncementType.INVITE_WHEEL,
  // AnnouncementType.SURPRISE_REWARD,
  // AnnouncementType.VIP_REBATE,
  // AnnouncementType.TELEGRAM,
  // AnnouncementType.RANKINGS,
];
export const useAnnouncementsParameterCheckAndSortOrderId = (
  items: ParsingAnnouncementResult[]
): ParsingAnnouncementResult[] => {
  return items
    .filter((item) => {
      const needCheck = RequiredParameterCheckTypes.includes(item.type);
      const dontPopup = needCheck
        ? item.popupParameterJson === null ||
          item.popupParameterJson === undefined ||
          item.popupParameterJson === ''
        : false;
      return !dontPopup;
    })
    .sort((a, b) => a.orderId - b.orderId);
};
