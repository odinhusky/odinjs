export enum Enums {
  /** 一般錢包(現金錢包) */
  GENERALLY = 1,

  /** 撲滿錢包 */
  BONUS = 2,

  /** 贈金錢包 */
  REWARD = 3
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.GENERALLY]: "walletType.normal",
  [Enums.BONUS]: "walletType.vault",
  [Enums.REWARD]: "walletType.bonus"
}

export const LongI18nKeys: Record<Enums, string> = {
  [Enums.GENERALLY]: "walletType.normal",
  [Enums.BONUS]: "walletType.vault",
  [Enums.REWARD]: "walletType.bonus"
}
