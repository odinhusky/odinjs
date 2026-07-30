export enum PROMOTION_TYPE_ENUMS {
  /** 全部 */
  ALL = 0,

  /** 存款優惠 */
  DEPOSIT_BONUS = 1,

  /** 註冊獎金 */
  REGISTER_BONUS = 2,

  /** 投注優惠 */
  BET_BONUS = 3,

  /** 自訂優惠 */
  CUSTOMIZE_BONUS = 4,

  /** 救援金 */
  // RESCUE_BONUS
}

export const PROMOTION_TYPE_I18N_KEYS: Record<PROMOTION_TYPE_ENUMS, string> = {
  /** 未定義(全部) */
  [PROMOTION_TYPE_ENUMS.ALL]: "common.btn.all",
  [PROMOTION_TYPE_ENUMS.DEPOSIT_BONUS]: "promotion.deposit_bonus",
  [PROMOTION_TYPE_ENUMS.REGISTER_BONUS]: "promotion.register_bonus",
  [PROMOTION_TYPE_ENUMS.BET_BONUS]: "promotion.bet_bonus",
  [PROMOTION_TYPE_ENUMS.CUSTOMIZE_BONUS]: "promotion.customize_bonus"
  // [PROMOTION_TYPE_ENUMS.RESCUE_BONUS]: "event_type.rescue_bonus"
}
