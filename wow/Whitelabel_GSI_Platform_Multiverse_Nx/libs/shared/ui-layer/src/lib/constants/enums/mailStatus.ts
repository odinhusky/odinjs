export enum MAIL_STATUS_ENUMS {
  /** 未讀 */
  ACTIVE = 1,

  /** 已讀 */
  COMPLETED = 2
}

export const MAIL_STATUS_I18N_KEYS: Record<MAIL_STATUS_ENUMS, string> = {
  [MAIL_STATUS_ENUMS.ACTIVE]: "member.mail.active",
  [MAIL_STATUS_ENUMS.COMPLETED]: "member.mail.completed"
}
