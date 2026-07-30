export enum Enums {
  /** 入款標籤 */
  Deposit = 1,

  /** 出款標籤 */
  Withdraw = 2,

  /** 優惠標籤 */
  Promotion = 3,

  /** 投注標籤 */
  Betting = 4,

  /** 其他 */
  Other = 5,

  /** AI 標籤 */
  AI = 6
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Deposit]: "member_tag_type.deposit",
  [Enums.Withdraw]: "member_tag_type.withdraw",
  [Enums.Betting]: "member_tag_type.betting",
  [Enums.Promotion]: "member_tag_type.promotion",
  [Enums.Other]: "member_tag_type.other",
  [Enums.AI]: "member_tag_type.ai"
}
