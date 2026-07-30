export enum Enums {
  /** 公告目標全主 */
  ANNOUNCEMENT_TARGET_ALL_MASTER = 1,

  /** 公告對象為所有代理商 */
  ANNOUNCEMENT_TARGET_ALL_AGENT,

  /** 系統線路類 */
  ANNOUNCEMENT_TARGET_SPECIFIC_AGENT,

  /** 總代最新消息 */
  ANNOUNCEMENT_TARGET_FRONTEND
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ANNOUNCEMENT_TARGET_ALL_MASTER]: "announcement_type.announcement_target_all_master",
  [Enums.ANNOUNCEMENT_TARGET_ALL_AGENT]: "announcement_type.announcement_target_all_agent",
  [Enums.ANNOUNCEMENT_TARGET_SPECIFIC_AGENT]: "announcement_type.announcement_target_specific_agent",
  [Enums.ANNOUNCEMENT_TARGET_FRONTEND]: "announcement_type.announcement_target_frontend"
}
