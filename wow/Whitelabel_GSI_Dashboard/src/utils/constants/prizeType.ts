export enum Enums {
  CASH = 1,
  FREE_GAME
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  [Enums.CASH]: "common.cash",
  [Enums.FREE_GAME]: "menu.free_game"
}
