export enum Enums {
  REVIEWING = 1,
  VERIFIED = 2,
  REJECTED = 3,
  UNSUBMITTED = 4
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.REVIEWING]: "kyc_status.reviewing",
  [Enums.VERIFIED]: "kyc_status.verified",
  [Enums.REJECTED]: "kyc_status.rejected",
  [Enums.UNSUBMITTED]: "kyc_status.unsubmitted"
}
