export enum MEMBER_AGENT_QUOTA_BALANCE_TYPE_ENUMS {
  /** 加款 */
  ADD = 1,

  /** 扣款 */
  MINUS = 2,

  /** 查看下級 */
  VIEW_SUBORDINATE = 3,

  /** 編輯 */
  EDIT = 4
}

export const MEMBER_AGENT_QUOTA_BALANCE_TYPE_I18N_KEYS: Record<MEMBER_AGENT_QUOTA_BALANCE_TYPE_ENUMS, string> = {
  [MEMBER_AGENT_QUOTA_BALANCE_TYPE_ENUMS.ADD]: "common.btn.addAmount",
  [MEMBER_AGENT_QUOTA_BALANCE_TYPE_ENUMS.MINUS]: "common.btn.minusAmount",
  [MEMBER_AGENT_QUOTA_BALANCE_TYPE_ENUMS.VIEW_SUBORDINATE]: "member.membershipManagement.viewSubordinateMember",
  [MEMBER_AGENT_QUOTA_BALANCE_TYPE_ENUMS.EDIT]: "common.btn.edit"
}
