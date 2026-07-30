export enum MAIL_TYPE_ENUMS {
  /** 優惠 */
  PROMOTION = 1,

  /** 中獎 */
  WINNING = 2
}

export const MAILTYPE_I18N_KEYS: Record<MAIL_TYPE_ENUMS, string> = {
  [MAIL_TYPE_ENUMS.PROMOTION]: "member.mail.promotion",
  [MAIL_TYPE_ENUMS.WINNING]: "member.mail.winning_notification"
}
