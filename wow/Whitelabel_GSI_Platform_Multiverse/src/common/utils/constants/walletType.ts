export enum Enums {
  /** 現金 */
  Cash = 1,

  /** 撲滿錢包 */
  Bonus,

  /** 贈金錢包 */
  Reward
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Cash]: "walletType.normal",
  [Enums.Bonus]: "walletType.vault",
  [Enums.Reward]: "walletType.bonus"
}
