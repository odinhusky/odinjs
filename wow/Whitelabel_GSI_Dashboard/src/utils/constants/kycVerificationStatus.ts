export enum Enums {
  VERIFICATION_STATUS_NOT_STARTED = 0, // 未開始/未提交
  VERIFICATION_STATUS_VERIFIED = 1, // 已驗證/通過
  VERIFICATION_STATUS_REJECTED = 2, // 驗證被拒
  VERIFICATION_STATUS_EXPIRED = 3, // 驗證過期
  VERIFICATION_STATUS_PENDING = 4, // 待驗證
  VERIFICATION_STATUS_PROCESSING = 5 // 驗證中
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.VERIFICATION_STATUS_NOT_STARTED]: "kyc_status.unsubmitted",
  [Enums.VERIFICATION_STATUS_VERIFIED]: "kyc_status.approved",
  [Enums.VERIFICATION_STATUS_REJECTED]: "kyc_status.rejecteds",
  [Enums.VERIFICATION_STATUS_EXPIRED]: "kyc_status.unsubmitted",
  [Enums.VERIFICATION_STATUS_PENDING]: "kyc_status.pending _review",
  [Enums.VERIFICATION_STATUS_PROCESSING]: "kyc_status.reviewing"
}
