export enum Enums {
  VERIFICATION_STATUS_NOT_STARTED = 0, // 未開始
  VERIFICATION_STATUS_VERIFIED = 1, // 已驗證
  VERIFICATION_STATUS_REJECTED = 2, // 驗證被拒
  VERIFICATION_STATUS_EXPIRED = 3, // 驗證過期
  VERIFICATION_STATUS_PENDING = 4, // 待驗證
  VERIFICATION_STATUS_PROCESSING = 5 // 驗證中
}

export const I18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.VERIFICATION_STATUS_NOT_STARTED]: "process_status.unStarted",
  [Enums.VERIFICATION_STATUS_VERIFIED]: "process_status.approved",
  [Enums.VERIFICATION_STATUS_REJECTED]: "process_status.rejected",
  [Enums.VERIFICATION_STATUS_EXPIRED]: "process_status.expired",
  [Enums.VERIFICATION_STATUS_PENDING]: "process_status.pendings",
  [Enums.VERIFICATION_STATUS_PROCESSING]: "process_status.processing"
}
