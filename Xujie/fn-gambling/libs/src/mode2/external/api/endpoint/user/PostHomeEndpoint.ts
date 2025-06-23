import { POST_HOME_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { getHtml } from '@commonUtils/index';
import {
  EnterGameType,
  fillGameListItemMissingValues,
  GameListItemResult,
  mapEnterGameType,
} from '@libs/mode2/zustand/page/hallPageStore';
import {
  AllAnnouncementsTypeMappingStrategy,
  AnnouncementOriginalData,
  ParsingAnnouncementResult,
  useParsingAnnouncementsContent,
} from '@mode2/usecase/announcement/useParsingAnnouncementsContent';
import { AnnouncementScenariosType } from '@mode2/usecase/announcement/useAnnouncementActionBase';
import { Base64 } from 'js-base64';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';
import { AnnouncementType } from '@mode2/@types/announcementType';
import dayjs from 'dayjs';

interface CarouselItemConfigResponse {
  reward?: number;
}

interface CarouselItemResponse {
  Type?: number;
  Logo?: string;
  config?: CarouselItemConfigResponse;
}

interface AnnouncementResponse extends AnnouncementOriginalData {
  Title?: string;
  Content?: string;
  Image?: string;
  DetailImg?: string;
  CreateTime?: number;
  Type?: number;
  IsMySelfShow?: number;
  IsSidebarShow?: number;
}

interface ApkInfoResponse {
  Version?: string;
  ApkUrl?: string;
  Announcement?: string;
  Id?: number;
  CarouselUrl?: string;
  BroadcastJson?: string;
}

export interface GameResponse {
  GameId?: number;
  ParentManufacturer?: string;
  Manufacturer?: string;
  PlatformId?: number;
  Platform?: string;
  Logo?: string; // https://game.ttgroup.vip/images/in/DEV/cover/xxx.png
  PcLogo?: string;
  HotLogo?: string; // https://game.ttgroup.vip/images/in/DEV/hot_cover/xxx.png
  NameLogo?: string; // https://game.ttgroup.vip/images/in/DEV/logo/xxx.png
  IsGame?: number;
  Type?: number;
  IsHot?: number;
  IsNew?: number;
  IsNotBet?: number;
  IsEnterLobby?: number;
  IsMaintain?: number;
  MaintainTime?: string; // 有可能會傳''或'0'
  Remark?: string;
  Name?: string;
}

interface ServicesMobileResponse {
  TelGram?: string;
  Type?: string;
}

interface PlatformInfoResponse {
  Hots?: GameResponse[];
  Slots?: GameResponse[];
  Lives?: GameResponse[];
  Sports?: GameResponse[];
  Games?: GameResponse[];
  Fishings?: GameResponse[];
  Originals?: GameResponse[];
}

interface PlatformNameResponse {
  Manufacturer?: string;
  Name?: string;
  Logo?: string;
  PlatformId?: number;
  IsEnterLobby?: number;
  IsSidebar?: number;
}

interface RegisterRewardResponse {
  RewardAmount?: number;
  PopupWindow?: boolean;
  RewardEnable?: boolean;
}

export interface LimitedOfferResponse {
  AnnouncementType?: number;
  ConfigJson?: string;
  EndTime?: number;
  StartTime?: number;
}

interface HomeResponse {
  ApkInfo?: ApkInfoResponse;
  ApkPcInfo?: string;
  GroupApkInfos?: ApkInfoResponse;
  OfficialServicesMobiles?: ServicesMobileResponse[];
  Announcements?: AnnouncementResponse[];
  ServicesMobiles?: ServicesMobileResponse[];
  PlatformInfo?: PlatformInfoResponse;
  PlatformNames?: PlatformNameResponse[];
  PlatformTypes?: number[];
  Email?: string;
  RegisterReward?: RegisterRewardResponse;
  LimitedOffers?: LimitedOfferResponse[];
}

/** 獲取遊戲列表(熱門除外), 首頁Banner內容, 跑馬燈資料,平台資訊 */
export const PostHomeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<HomeInfoResult, void>({
    query: () => {
      console.log(
        '@@@===> hall popup userRole',
        useUserProfileStore.getState().userRole
      );
      const reqData = {
        reqData: {},
      };

      return {
        method: 'post',
        url: POST_HOME_URL,
        data: reqData,
      };
    },

    transformResponse,
  });

export interface AnnouncementResult extends ParsingAnnouncementResult {}

/**
 * 已知定義類型 [BroadcastType]
 */
export enum BroadcastTypeResult {
  WALLET = 'WALLET', // Type == 2 nav to wallet page
  ACTIVITY = 'ACTIVITY', // Type == 9 nav to activity page
  INVITE = 'INVITE', // Type == 13 nav to invite page
  UNKNOWN = 'UNKNOWN',
  //   // Type == 3 openBrowser
  //   // Type == 6 check Login => show bonus Popup
  //   // Type == 8 download
  //   // Type == 10 EnterGame
  //   // Type == 11 EnterLobby || MoreGame  [check "IsEnterLobby" , ]
}

export type BroadcastItemResult = {
  type: BroadcastTypeResult;
  broadcastText: string;
};

// export enum CarouselActionTypeResult {
//   INVITE = 'INVITE', // 1
//   WALLET = 'WALLET', // 2
//   ACTIVITY = 'ACTIVITY', // 3
//   RED_ENVELOPE_RAIN = 'RED_ENVELOPE_RAIN', // 7
//   UNKNOWN = 'UNKNOWN',
// }

export interface CarouselItemResult extends ParsingAnnouncementResult {}

export type GameListCatagory = {
  slotsList: string;
  casinoList: string;
  sportsList: string;
  gamesList: string;
  fishingsList: string;
  originalsList: string;
};

export enum ServicesTypeResult {
  WHATS_APP = 'WHATS_APP',
  INSTAGRAM = 'INSTAGRAM',
  TELEGRAM = 'TELEGRAM',
  LIVE_CHAT = 'LIVE_CHAT',
  YOUTUBE = 'YOUTUBE',

  FACEBOOK = 'FACEBOOK',
  TIKTOK = 'TIKTOK',
  TWITTER = 'TWITTER',
  UNKNOWN = 'UNKNOWN',
}

export interface CustomerServicesResult {
  type: ServicesTypeResult;
  link: string;
}

export interface LimitedOffersResult {
  type: AnnouncementType;
  configJson: string;
  endTime: number;
  startTime: number;
  countdownTime: number;
}

export interface HomeInfoResult {
  broadcastList: BroadcastItemResult[];
  carouselItemList: ParsingAnnouncementResult[];
  // announcements: AnnouncementResult[];
  preloadBannerResources: string[];
  // hallPopupAnnouncements: AnnouncementResult[];
  platformInfo: {
    [K in keyof GameListCatagory]: GameListItemResult[];
  };
  platformGameList: GameListItemResult[];
  sidebarPlatform: GameListItemResult[];
  customerServicesList: CustomerServicesResult[];
  platformTypes: number[];
  email: string;
  apkInfoId: number;
  isDisplayRegisterReward: boolean;
  lowBalanceRechargeLimitedOffersEndTime: number;
  lowBalanceRescueBoxLimitedOffersEndTime: number;
  depositJackpotWheelLimitedOffersEndTimeForShow: number;
}

const mapCarouselItem = (raw: CarouselItemResponse[]): CarouselItemResult[] => {
  const items = raw.map((item) => ({
    Image: item.Logo || '',
    Type: item.Type || -1,
    Content: Base64.encode(`${item.config?.reward || ''}`),
  }));
  const carouselItems = useParsingAnnouncementsContent(
    AnnouncementScenariosType.POPUP,
    items
  );

  return carouselItems;
  // return carouselItems.map((item) => ({
  //   logoUrl: item.bannerUrl,
  //   actionType: item.type,
  // }));
};

const mapGameListInfo = (raw: GameResponse[] | undefined) => {
  return raw
    ? raw.map((item: GameResponse) =>
        fillGameListItemMissingValues({
          name: item.Name,
          platform: item?.Platform,
          platformId: item?.PlatformId,
          gameId: item.GameId || 0,
          isHotGame: item.IsHot === 1,
          isNewGame: item.IsNew === 1,
          isMaintain: item?.IsMaintain === 1,
          maintainTime:
            item?.MaintainTime && item?.MaintainTime !== '0'
              ? item.MaintainTime
              : '',
          coverImageSrc: item.Logo || item.NameLogo, // NameLogo是只帶有game name和黑色背景的圖
          manufacturerLogoUrl: item.NameLogo,
          manufacturer: item.Manufacturer,
          enterGameType: mapEnterGameType(
            item.IsEnterLobby || 0,
            item.IsGame || 0
          ),
          type: item.Type,
        })
      )
    : [];
};

const mapPlatformInfo = (raw: PlatformInfoResponse | undefined) => {
  if (raw === undefined) {
    return {
      slotsList: [],
      casinoList: [],
      sportsList: [],
      gamesList: [],
      fishingsList: [],
      originalsList: [],
    };
  }
  const { Slots, Lives, Sports, Games, Fishings, Originals } = raw;
  return {
    slotsList: mapGameListInfo(Slots),
    casinoList: mapGameListInfo(Lives),
    sportsList: mapGameListInfo(Sports),
    gamesList: mapGameListInfo(Games),
    fishingsList: mapGameListInfo(Fishings),
    originalsList: mapGameListInfo(Originals),
  };
};

const mapPlatformGameList = (raw: PlatformNameResponse[]) => {
  return raw.map((item: PlatformNameResponse) =>
    fillGameListItemMissingValues({
      manufacturer: item.Manufacturer || '',
      name: item.Name || '',
      coverImageSrc: item.Logo || '',
      platformId: item.PlatformId || 0,
      manufacturerLogoUrl: item.Logo || '',
      enterGameType: mapEnterGameType(item.IsEnterLobby || 0, 0),
    })
  );
};

const mapSidebarPlatformList = (raw: PlatformNameResponse[]) => {
  const platformList = raw.filter((item) => {
    return item.IsSidebar === 1;
  });
  return mapPlatformGameList(platformList).map((item) => ({
    ...item,
    enterGameType: EnterGameType.DIRECTORY,
  }));
};

/**
 * 已知定義類型 [ServicesType]
 * 1. whatsapp 2. Telegram 3. Instagram 4. livechat 5 youtube  || 前端 tiktok  == 6  facebook == 7 Twitter == 8
 */
const servicesTypeMapping: { [key: string]: ServicesTypeResult } = {
  '1': ServicesTypeResult.WHATS_APP,
  '2': ServicesTypeResult.TELEGRAM,
  '3': ServicesTypeResult.INSTAGRAM,
  '4': ServicesTypeResult.LIVE_CHAT,
  '5': ServicesTypeResult.YOUTUBE,
};

const mapServicesMobileResponse = (
  items: ServicesMobileResponse[]
): CustomerServicesResult[] => {
  return items.map((item) => {
    const type =
      servicesTypeMapping[item.Type || ''] || ServicesTypeResult.UNKNOWN;
    return {
      type: type,
      link: item.TelGram || '',
    };
  });
};

/**
 * 已知定義類型 [BroadcastType]
 */
const broadcastTypeMapping: { [key: string]: BroadcastTypeResult } = {
  '2': BroadcastTypeResult.WALLET,
  '9': BroadcastTypeResult.ACTIVITY,
  '13': BroadcastTypeResult.INVITE,
};

interface BroadcastResponse {
  Content?: string;
  Type?: number;
}

const mapBroadcastJson = (broadcastJson?: string) => {
  const jsonArr = getHtml(broadcastJson || '[]');
  try {
    const items: BroadcastResponse[] = JSON.parse(jsonArr);
    return items.map((item: BroadcastResponse) => {
      const type =
        broadcastTypeMapping[item.Type || ''] || BroadcastTypeResult.UNKNOWN;
      return {
        type: type,
        broadcastText: item.Content || '',
      };
    });
  } catch (e) {
    return [];
  }
};

export const mapLimitedOffersResult = (
  nowUnix: number,
  item: LimitedOfferResponse
) => {
  const type = AllAnnouncementsTypeMappingStrategy[item?.AnnouncementType || 0];
  const endTime = item?.EndTime || 0;
  return {
    type: type,
    configJson: item?.ConfigJson || '',
    startTime: item?.StartTime || 0,
    endTime: item?.EndTime || 0,
    countdownTime: endTime > nowUnix ? (endTime - nowUnix) * 1000 : 0,
  };
};

const transformResponse = (
  response: ResponseStructure<HomeResponse>
): HomeInfoResult => {
  const resp = response?.Body;
  const carouselData = resp?.ApkInfo?.CarouselUrl
    ? getHtml(resp?.ApkInfo?.CarouselUrl)
    : '[]';
  const carouselList: CarouselItemResponse[] = JSON.parse(carouselData);
  // 先過濾需要顯示的 popupAnnouncements，給到 zustand
  const announcementsItems = resp?.Announcements || [];

  // 濾除需要的  parameter， 如果為null，isPopup 失效
  // const showHallPopupItems =
  //   announcementsItems?.filter((item) => item.IsPopup === 1) || [];

  // 移除需要 Parameter 檢查
  // const hallPopupItemsParameterCheckAndSortResults =
  //   useAnnouncementsParameterCheckAndSortOrderId(
  //     useParsingAnnouncementsContent(
  //       AnnouncementScenariosType.ALL,
  //       showHallPopupItems
  //     )
  //   );

  // // TODO Evan 先別移除，給QA看 console
  //
  // console.log(
  //   '@@@===> hall popup (後端控制IsPopup 過濾結果)',
  //   showHallPopupItems
  // );
  // console.log(
  //   '@@@===> hall popup hallPopupItemsParameterCheckAndSortResults',
  //   hallPopupItemsParameterCheckAndSortResults
  // );
  //
  // hallPopupItemsParameterCheckAndSortResults.forEach((item) => {
  //   console.log(
  //     `@@@===> hall popup (排序結果) type:${item.type}, orderId:${item.orderId}`
  //   );
  // });

  // const announcements = useParsingAnnouncementsContent(
  //   AnnouncementScenariosType.HOME,
  //   announcementsItems
  // );

  const preloadBannerResources: string[] = announcementsItems.flatMap((item) =>
    [item?.Image, item?.LobbyImage, item?.PopupImage].filter(
      (src): src is string => Boolean(src)
    )
  );

  const nowUnix = dayjs().unix();
  const limitedOffersResult: LimitedOffersResult[] =
    resp?.LimitedOffers?.filter((item) => {
      const startTime = item?.StartTime || 0;
      const endTime = item?.EndTime || 0;
      return startTime <= nowUnix && endTime > nowUnix;
    }).map((item) => mapLimitedOffersResult(nowUnix, item)) || [];

  // const lowBalanceRechargeOffers: LimitedOffersResult | undefined =
  //   limitedOffersResult.find(
  //     (item) => item.type === AnnouncementType.LOW_BALANCE_RECHARGE
  //   );
  //
  // const lowBalanceRescueBoxOffers: LimitedOffersResult | undefined =
  //   limitedOffersResult.find(
  //     (item) => item.type === AnnouncementType.LOW_BALANCE_RESCUE_BOX
  //   );
  //
  // const doubleBonusLimitedOffers: LimitedOffersResult | undefined =
  //   limitedOffersResult.find(
  //     (item) => item.type === AnnouncementType.DEPOSIT_JACKPOT_WHEEL
  //   );

  //  支援 limitedOffers 的 AnnouncementType
  const limitTypes = [
    AnnouncementType.LOW_BALANCE_RECHARGE,
    AnnouncementType.LOW_BALANCE_RESCUE_BOX,
    AnnouncementType.DEPOSIT_JACKPOT_WHEEL,
  ];

  const limitedOffersMap: Partial<
    Record<AnnouncementType, LimitedOffersResult>
  > = limitedOffersResult.reduce((acc, item) => {
    if (limitTypes.includes(item.type)) {
      acc[item.type] = item;
    }
    return acc;
  }, {} as Partial<Record<AnnouncementType, LimitedOffersResult>>);

  return {
    broadcastList: mapBroadcastJson(resp?.ApkInfo?.BroadcastJson),
    carouselItemList: mapCarouselItem(carouselList),
    // hallPopupAnnouncements: hallPopupItemsParameterCheckAndSortResults,
    // announcements: announcements,
    preloadBannerResources: preloadBannerResources,
    platformInfo: mapPlatformInfo(resp?.PlatformInfo),
    platformGameList: mapPlatformGameList(resp?.PlatformNames || []),
    sidebarPlatform: mapSidebarPlatformList(resp?.PlatformNames || []),
    customerServicesList: mapServicesMobileResponse([
      ...(resp?.ServicesMobiles || []),
      ...(resp?.OfficialServicesMobiles || []),
    ]),
    platformTypes: resp?.PlatformTypes || [],
    email: resp?.Email || '',
    apkInfoId: resp?.ApkInfo?.Id || 0,
    isDisplayRegisterReward: (resp?.RegisterReward?.RewardAmount || 0) > 0,
    lowBalanceRechargeLimitedOffersEndTime:
      limitedOffersMap[AnnouncementType.LOW_BALANCE_RECHARGE]?.endTime || 0,
    lowBalanceRescueBoxLimitedOffersEndTime:
      limitedOffersMap[AnnouncementType.LOW_BALANCE_RESCUE_BOX]?.endTime || 0,
    depositJackpotWheelLimitedOffersEndTimeForShow: dayjs()
      .add(1, 'year')
      .unix(), // TODO Evan 充值大獎輪盤，只用於第一次顯示 先寫死好控制 HallAdModelCommand

    // doubleBonusLimitedOffersEndTime:
    //   limitedOffersMap[AnnouncementType.DEPOSIT_JACKPOT_WHEEL]?.endTime || 0, // TODO Evan 充值大獎輪盤，只用於第一次顯示
  };
};
