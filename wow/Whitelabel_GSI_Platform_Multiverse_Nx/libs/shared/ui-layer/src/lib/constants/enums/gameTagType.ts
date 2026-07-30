export enum GAME_TAG_TYPE_ENUMS {
  // 全部
  ALL = 0,

  // 最新
  NEW = 1,

  // 熱門
  HOT = 2,

  // 收藏
  FAVORITES = 3
}

export const GAME_TAG_I18N_KEYS: Record<GAME_TAG_TYPE_ENUMS, string> = {
  [GAME_TAG_TYPE_ENUMS.ALL]: "common.btn.all",
  [GAME_TAG_TYPE_ENUMS.FAVORITES]: "common.btn.favorites",
  [GAME_TAG_TYPE_ENUMS.NEW]: "common.btn.new",
  [GAME_TAG_TYPE_ENUMS.HOT]: "common.btn.hot"
}

export const GAME_TAG_BTN_ICONS: Record<GAME_TAG_TYPE_ENUMS, string> = {
  [GAME_TAG_TYPE_ENUMS.ALL]: "fa-solid fa-clover",
  [GAME_TAG_TYPE_ENUMS.FAVORITES]: "fa-solid fa-thumbs-up",
  [GAME_TAG_TYPE_ENUMS.NEW]: "fa-solid fa-n",
  [GAME_TAG_TYPE_ENUMS.HOT]: "fa-solid fa-fire"
}

export const GAME_TAG_BTN_ICON_NAMES: Record<GAME_TAG_TYPE_ENUMS, string> = {
  [GAME_TAG_TYPE_ENUMS.ALL]: "all",
  [GAME_TAG_TYPE_ENUMS.FAVORITES]: "favorites",
  [GAME_TAG_TYPE_ENUMS.NEW]: "new",
  [GAME_TAG_TYPE_ENUMS.HOT]: "hot"
}
