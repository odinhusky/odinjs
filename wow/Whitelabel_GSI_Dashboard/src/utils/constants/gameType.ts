export enum Enums {
  /** 老虎機 */
  SLOT = 1,
  /** 真人 */
  LIVECASINO = 2,
  /** 體育 */
  SPORTBOOK = 3,
  VIRTUALSPORT = 4,
  // 彩票
  LOTTERY = 5,
  CARDBOARD = 6,
  P2P = 7,
  // 捕魚
  FISHING = 8,
  // 其他
  OTHER = 9,
  // 鬥雞
  COCKFIGHTHING = 10,
  // 電競
  ESPORT = 11,
  // 撲克
  POKER = 12,
  // 尊荣视讯
  CASINOPREMIUM = 13
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.SLOT]: "common.slot",
  [Enums.LIVECASINO]: "common.casino",
  [Enums.SPORTBOOK]: "common.sport",
  [Enums.VIRTUALSPORT]: "common.virtualSport",
  [Enums.LOTTERY]: "common.lottery",
  [Enums.CARDBOARD]: "common.cardboard",
  [Enums.P2P]: "common.p2p",
  [Enums.FISHING]: "common.fishing",
  [Enums.OTHER]: "common.other",
  [Enums.COCKFIGHTHING]: "common.cockFighthing",
  [Enums.ESPORT]: "common.esport",
  [Enums.POKER]: "common.poker",
  [Enums.CASINOPREMIUM]: "common.casino_premium"
}

export enum ENTRANCE_TYPE {
  SINGLE_ENTRY = 1, // 單一入口
  GAME_LIST = 2 // 遊戲清單
}

export const EntranceTypeI18nKeys: Record<ENTRANCE_TYPE, string> = {
  [ENTRANCE_TYPE.SINGLE_ENTRY]: "cms.supplier_entrance",
  [ENTRANCE_TYPE.GAME_LIST]: "cms.game_entrance"
}

// 暫時由前端寫死，等產品重構後移除
export const Category: Record<Enums, number> = {
  [Enums.SLOT]: ENTRANCE_TYPE.GAME_LIST,
  [Enums.LIVECASINO]: ENTRANCE_TYPE.SINGLE_ENTRY,
  [Enums.SPORTBOOK]: ENTRANCE_TYPE.SINGLE_ENTRY,
  [Enums.VIRTUALSPORT]: ENTRANCE_TYPE.SINGLE_ENTRY,
  [Enums.LOTTERY]: ENTRANCE_TYPE.SINGLE_ENTRY,
  [Enums.CARDBOARD]: ENTRANCE_TYPE.GAME_LIST,
  [Enums.P2P]: ENTRANCE_TYPE.SINGLE_ENTRY,
  [Enums.FISHING]: ENTRANCE_TYPE.GAME_LIST,
  [Enums.OTHER]: ENTRANCE_TYPE.SINGLE_ENTRY,
  [Enums.COCKFIGHTHING]: ENTRANCE_TYPE.SINGLE_ENTRY,
  [Enums.ESPORT]: ENTRANCE_TYPE.SINGLE_ENTRY,
  [Enums.POKER]: ENTRANCE_TYPE.GAME_LIST,
  [Enums.CASINOPREMIUM]: ENTRANCE_TYPE.SINGLE_ENTRY
}
