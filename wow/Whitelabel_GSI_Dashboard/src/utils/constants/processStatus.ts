export enum Enums {
  PROCESS_STATUS_PENDING = 0, // 待處理
  PROCESS_STATUS_PROCESSING = 1, // 處理中
  PROCESS_STATUS_SUCCESS = 2, // 處理成功
  PROCESS_STATUS_FAILED = 3, // 處理失敗
  PROCESS_STATUS_CANCELED = 4, // 已取消
  PROCESS_STATUS_SETTLED = 5, // 已結算
  PROCESS_STATUS_RELEASED = 6, // 已發佈
  PROCESS_STATUS_LOCKED = 7, // 已鎖定
  PROCESS_STATUS_APPROVED = 8, // 已核准
  PROCESS_STATUS_REJECTED = 9, // 已拒絕
  PROCESS_STATUS_SUSPENDED = 10, // 已暫停
  PROCESS_STATUS_EXPIRED = 11 // 已過期
}

export const I18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.PROCESS_STATUS_PENDING]: "process_status.pendings",
  [Enums.PROCESS_STATUS_PROCESSING]: "process_status.processing",
  [Enums.PROCESS_STATUS_SUCCESS]: "process_status.success",
  [Enums.PROCESS_STATUS_FAILED]: "process_status.failed",
  [Enums.PROCESS_STATUS_CANCELED]: "process_status.cancelled",
  [Enums.PROCESS_STATUS_SETTLED]: "process_status.settled",
  [Enums.PROCESS_STATUS_RELEASED]: "process_status.published",
  [Enums.PROCESS_STATUS_LOCKED]: "process_status.locked",
  [Enums.PROCESS_STATUS_APPROVED]: "process_status.approved",
  [Enums.PROCESS_STATUS_REJECTED]: "process_status.rejected",
  [Enums.PROCESS_STATUS_SUSPENDED]: "process_status.suspended",
  [Enums.PROCESS_STATUS_EXPIRED]: "process_status.expired"
}

export const kycI18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.PROCESS_STATUS_PENDING]: "process_status.pendings",
  [Enums.PROCESS_STATUS_PROCESSING]: "process_status.under_review",
  [Enums.PROCESS_STATUS_SUCCESS]: "process_status.success",
  [Enums.PROCESS_STATUS_FAILED]: "process_status.failed",
  [Enums.PROCESS_STATUS_CANCELED]: "process_status.cancelled",
  [Enums.PROCESS_STATUS_SETTLED]: "process_status.settled",
  [Enums.PROCESS_STATUS_RELEASED]: "process_status.published",
  [Enums.PROCESS_STATUS_LOCKED]: "process_status.locked",
  [Enums.PROCESS_STATUS_APPROVED]: "process_status.approved",
  [Enums.PROCESS_STATUS_REJECTED]: "process_status.rejected",
  [Enums.PROCESS_STATUS_SUSPENDED]: "process_status.suspended",
  [Enums.PROCESS_STATUS_EXPIRED]: "process_status.expired"
}
