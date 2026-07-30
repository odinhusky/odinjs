/**
 * DailyReportPromoType - 報表優惠類型
 * 對應後端的 DailyReportPromoType
 */
export const enum Enums {
  /** 存入優惠 */
  Deposit = 1,

  /** 註冊優惠 */
  Register = 2,

  /** 投注優惠 */
  Betting = 3,

  /** 邀請禮金 (推薦註冊) */
  ReferralSignup = 4,

  /** 返水 */
  Rebate = 5,

  /** VIP 晉級禮金 */
  PromotionBonus = 6,

  /** 生日禮金 */
  BirthdayBonus = 7,

  /** 禮金明細 (手動派發) */
  ManualGift = 8,

  /** 上級返佣 */
  ReferralRebate = 9,

  /** 代理佣金 */
  Commission = 10
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Deposit]: "daily_report_promo_type.deposit",
  [Enums.Register]: "daily_report_promo_type.register",
  [Enums.Betting]: "daily_report_promo_type.betting",
  [Enums.ReferralSignup]: "daily_report_promo_type.referral_signup",
  [Enums.Rebate]: "daily_report_promo_type.rebate",
  [Enums.PromotionBonus]: "daily_report_promo_type.promotion_bonus",
  [Enums.BirthdayBonus]: "daily_report_promo_type.birthday_bonus",
  [Enums.ManualGift]: "daily_report_promo_type.manual_gift",
  [Enums.ReferralRebate]: "daily_report_promo_type.referral_rebate",
  [Enums.Commission]: "daily_report_promo_type.commission"
}
