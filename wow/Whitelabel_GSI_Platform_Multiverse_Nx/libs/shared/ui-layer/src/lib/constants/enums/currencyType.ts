export enum CURRENCY_TYPE_ENUMS {
  /** 法幣 */
  FIAT = 1,

  /** 加密貨幣 */
  CRYPTO = 2
}

export const CURRENCY_TYPE_LABEL: Record<CURRENCY_TYPE_ENUMS, string> = {
  [CURRENCY_TYPE_ENUMS.FIAT]: "法幣",
  [CURRENCY_TYPE_ENUMS.CRYPTO]: "加密貨幣"
}
