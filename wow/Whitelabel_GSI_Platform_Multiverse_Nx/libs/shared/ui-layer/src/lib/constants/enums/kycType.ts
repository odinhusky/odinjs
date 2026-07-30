export enum KYC_TYPE_ENUMS {
  /** 身分證 */
  ID = 1,

  /** 駕照 */
  DRIVER_LICENSE = 2,

  /** 自拍照 */
  SELFIE = 3,

  /** 保險證 */
  INSURANCE = 4,

  /** 工資明細 */
  PAYSLIP = 5,
}

export const KYC_TYPE_I18N_KEYS: Record<KYC_TYPE_ENUMS, string> = {
  [KYC_TYPE_ENUMS.ID]: "member.kyc.id",
  [KYC_TYPE_ENUMS.DRIVER_LICENSE]: "member.kyc.driverLicense",
  [KYC_TYPE_ENUMS.SELFIE]: "member.kyc.selfie",
  [KYC_TYPE_ENUMS.INSURANCE]: "member.kyc.insurance",
  [KYC_TYPE_ENUMS.PAYSLIP]: "member.kyc.payslip"
}
