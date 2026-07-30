export enum Enums {
  FRONT = 0,
  BACK = 1,
  SELFIE = 2
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.FRONT]: "member.kyc.ID_positive",
  [Enums.BACK]: "member.kyc.ID_reverse",
  [Enums.SELFIE]: "member.kyc.photo_with_ID"
}
