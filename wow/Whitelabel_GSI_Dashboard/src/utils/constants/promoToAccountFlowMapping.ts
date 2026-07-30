import * as ACCOUNT_FLOW_TYPE from "./accountFlowType"
import * as DAILY_REPORT_PROMO_TYPE from "./dailyReportPromoType"

/**
 * 將 DailyReportPromoType 映射到 ACCOUNT_FLOW_TYPE
 *
 * 映射關係：
 * DailyReportPromoTypeDeposit (1) -> PROMOTON_BONUS (7) - 存入優惠
 * DailyReportPromoTypeRegister (2) -> PROMOTON_BONUS (7) - 註冊優惠
 * DailyReportPromoTypeBetting (3) -> PROMOTON_BONUS (7) - 投注優惠
 * DailyReportPromoTypeReferralSignup (4) -> REFERRAL_SIGNUP_BONUS (18) - 邀請禮金 (推薦註冊)
 * DailyReportPromoTypeRebate (5) -> REBATE (8) - 返水
 * DailyReportPromoTypePromotionBonus (6) -> VIP_BONUS (10) - VIP 晉級禮金
 * DailyReportPromoTypeBirthdayBonus (7) -> BIRTHDAY_BONUS (11) - 生日禮金
 * DailyReportPromoTypeManualGift (8) -> BONUS_GIFT (15) - 禮金明細 (手動派發)
 * DailyReportPromoTypeReferralRebate (9) -> REFERRAL_REBATE (14) - 上級返佣
 * DailyReportPromoTypeCommission (10) -> COMMISSION (12) - 代理佣金
 */
export const PROMO_TO_ACCOUNT_FLOW_MAPPING: Record<
  DAILY_REPORT_PROMO_TYPE.Enums,
  ACCOUNT_FLOW_TYPE.Enums
> = {
  [DAILY_REPORT_PROMO_TYPE.Enums.Deposit]: ACCOUNT_FLOW_TYPE.Enums.PROMOTON_BONUS,
  [DAILY_REPORT_PROMO_TYPE.Enums.Register]: ACCOUNT_FLOW_TYPE.Enums.PROMOTON_BONUS,
  [DAILY_REPORT_PROMO_TYPE.Enums.Betting]: ACCOUNT_FLOW_TYPE.Enums.PROMOTON_BONUS,
  [DAILY_REPORT_PROMO_TYPE.Enums.ReferralSignup]:
    ACCOUNT_FLOW_TYPE.Enums.REFERRAL_SIGNUP_BONUS,
  [DAILY_REPORT_PROMO_TYPE.Enums.Rebate]: ACCOUNT_FLOW_TYPE.Enums.REBATE,
  [DAILY_REPORT_PROMO_TYPE.Enums.PromotionBonus]: ACCOUNT_FLOW_TYPE.Enums.VIP_BONUS,
  [DAILY_REPORT_PROMO_TYPE.Enums.BirthdayBonus]: ACCOUNT_FLOW_TYPE.Enums.BIRTHDAY_BONUS,
  [DAILY_REPORT_PROMO_TYPE.Enums.ManualGift]: ACCOUNT_FLOW_TYPE.Enums.BONUS_GIFT,
  [DAILY_REPORT_PROMO_TYPE.Enums.ReferralRebate]: ACCOUNT_FLOW_TYPE.Enums.REFERRAL_REBATE,
  [DAILY_REPORT_PROMO_TYPE.Enums.Commission]: ACCOUNT_FLOW_TYPE.Enums.COMMISSION
}

/**
 * 將 DailyReportPromoType 轉換為 ACCOUNT_FLOW_TYPE
 * @param promoType DailyReportPromoType 值
 * @returns 對應的 ACCOUNT_FLOW_TYPE 值，如果找不到則返回 undefined
 */
export function convertPromoTypeToAccountFlowType(
  promoType: DAILY_REPORT_PROMO_TYPE.Enums
): ACCOUNT_FLOW_TYPE.Enums | undefined {
  return PROMO_TO_ACCOUNT_FLOW_MAPPING[promoType]
}

/**
 * 將多個 DailyReportPromoType 轉換為 ACCOUNT_FLOW_TYPE 陣列
 * @param promoTypes DailyReportPromoType 值陣列或逗號分隔的字串
 * @returns 對應的 ACCOUNT_FLOW_TYPE 值陣列（去重）
 */
export function convertPromoTypesToAccountFlowTypes(
  promoTypes: number | number[] | string
): number[] {
  let promoTypeArray: number[] = []

  // 處理不同類型的輸入
  if (Array.isArray(promoTypes)) {
    promoTypeArray = promoTypes
  } else if (typeof promoTypes === "string") {
    // 處理逗號分隔的字串，例如 "1,2"
    promoTypeArray = promoTypes
      .split(",")
      .map((item) => parseInt(item.trim(), 10))
      .filter((item) => !isNaN(item))
  } else if (typeof promoTypes === "number") {
    promoTypeArray = [promoTypes]
  }

  // 轉換並去重
  const accountFlowTypes = promoTypeArray
    .map((promoType) => convertPromoTypeToAccountFlowType(promoType as DAILY_REPORT_PROMO_TYPE.Enums))
    .filter((type): type is ACCOUNT_FLOW_TYPE.Enums => type !== undefined)

  // 使用 Set 去重
  return Array.from(new Set(accountFlowTypes))
}

