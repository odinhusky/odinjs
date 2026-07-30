export enum MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS {
  /** 全部 */
  ALL = 0,

  /** 存款 */
  DEPOSIT = 1,

  /** 出款 */
  WITHDRAWAL = 2,

  /** 代理加款 */
  MANUAL_ADDITION = 3,

  /** 代理扣款 */
  MANUAL_DEDUCTION = 4,

  /** 投注紀錄 */
  BET_RECORD = 5
}

export const MEMBER_AGENT_QUOTA_SEARCH_I18N_KEYS: Record<MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS, string> = {
  [MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.ALL]: "menu.all",
  [MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.DEPOSIT]: "action_type.deposit",
  [MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.WITHDRAWAL]: "action_type.withdrawal",
  [MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.MANUAL_ADDITION]: "action_type.manualAddition",
  [MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.MANUAL_DEDUCTION]: "action_type.manualDeduction",
  [MEMBER_AGENT_QUOTA_SEARCH_TYPE_ENUMS.BET_RECORD]: "action_type.betRecord"
}
