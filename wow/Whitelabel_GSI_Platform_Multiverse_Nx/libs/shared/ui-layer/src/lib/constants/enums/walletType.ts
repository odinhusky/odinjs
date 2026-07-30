export enum WALLET_TYPE_ENUMS {
  /** 現金 */
  CASH = 1,

  /** 撲滿錢包 */
  BONUS = 2,

  /** 贈金錢包 */
  REWARD = 3
}

export const WALLET_TYPE_I18N_KEYS: Record<WALLET_TYPE_ENUMS, string> = {
  [WALLET_TYPE_ENUMS.CASH]: "walletType.normal",
  [WALLET_TYPE_ENUMS.BONUS]: "walletType.vault",
  [WALLET_TYPE_ENUMS.REWARD]: "walletType.bonus"
}
