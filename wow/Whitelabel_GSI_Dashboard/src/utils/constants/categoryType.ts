export enum Enums {
  /** 新人優惠 */
  NewMember = 1,

  /** 存款優惠 */
  DepositBonus,

  /** 投注優惠 */
  BetBonus,

  /** 綜合優惠 */
  MixedOffers
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.NewMember]: "category_type.new_member",
  [Enums.DepositBonus]: "event_type.deposit_bonus",
  [Enums.BetBonus]: "event_type.bet_bonus",
  [Enums.MixedOffers]: "category_type.mixed_offers"
}
