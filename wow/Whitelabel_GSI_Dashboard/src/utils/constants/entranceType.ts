export enum Enums {
  /** 單一 */
  SINGLE = 1,

  /** 清單 */
  GAMELIST
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  [Enums.SINGLE]: "common.single_entry",
  [Enums.GAMELIST]: "common.game_list"
}
