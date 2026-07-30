export enum Enums {
  /** 禁止入款 */
  Deposit = 1,

  /** 禁止XXX PAY入款 */
  XXXPay,

  /** 標籤A */
  TagA,

  /** 標籤B */
  TagB,

  /** 標籤C */
  TagC,

  /** 標籤D */
  TagD
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Deposit]: "block_tag.deposit",
  [Enums.XXXPay]: "block_tag.xxxpay",
  [Enums.TagA]: "block_tag.tag_a",
  [Enums.TagB]: "block_tag.tag_b",
  [Enums.TagC]: "block_tag.tag_c",
  [Enums.TagD]: "block_tag.tag_d"
}
