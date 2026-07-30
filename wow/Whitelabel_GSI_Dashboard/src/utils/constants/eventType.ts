export enum Enums {
  /** 存款優惠 */
  DepositBonus = 1,

  /** 註冊獎金 */
  RegisterBonus,

  /** 投注優惠 */
  BetBonus,

  /** 自訂優惠 */
  CustomizeBonus

  /** 救援金 */
  // RescueBonus
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.DepositBonus]: "event_type.deposit_bonus",
  [Enums.RegisterBonus]: "event_type.register_bonus",
  [Enums.BetBonus]: "event_type.bet_bonus",
  [Enums.CustomizeBonus]: "event_type.customize_bonus"
  // [Enums.RescueBonus]: "event_type.rescue_bonus"
}
