export enum Enums {
  /** 身分證 */
  ID = 1,

  /** 駕照 */
  DRIVER_LICENSE = 2,

  /** 自拍照 */
  SELFIE = 3,

  /** 保險證 */
  INSURANCE = 4,

  /** 工資明細 */
  PAYSLIP = 5
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ID]: "kyc_type.id",
  [Enums.DRIVER_LICENSE]: "kyc_type.driver_license",
  [Enums.SELFIE]: "kyc_type.selfie",
  [Enums.INSURANCE]: "kyc_type.insurance",
  [Enums.PAYSLIP]: "kyc_type.payslip"
}
