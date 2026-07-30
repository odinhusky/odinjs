export enum KYC_STATUS_CODE_ENUMS {
  /**未上傳前的狀態, 前端自己判斷用 */

  NONE = 888, // 刪除的狀態
  PREUPLOAD = 999, // 等待上傳的圖片的狀態

  /*後端返回的狀態 */
  UNSUBMITTED = 0,
  REVIEWING = 1,
  VERIFIED = 2,
  REJECTED = 3
}

export const KYC_STATUS_CODE_I18N_KEYS: Record<KYC_STATUS_CODE_ENUMS, string> = {
  [KYC_STATUS_CODE_ENUMS.NONE]: "",
  [KYC_STATUS_CODE_ENUMS.PREUPLOAD]: "",
  [KYC_STATUS_CODE_ENUMS.UNSUBMITTED]: "member.kyc.UNSUBMITTED",
  [KYC_STATUS_CODE_ENUMS.REVIEWING]: "member.kyc.status_pending",
  [KYC_STATUS_CODE_ENUMS.VERIFIED]: "member.kyc.status_success",
  [KYC_STATUS_CODE_ENUMS.REJECTED]: "member.kyc.status_failed"
}
