export enum ID_FACE_ENUMS {
  FRONT = 0,
  BACK = 1,
  SELFIE = 2
}

export const ID_FACE_I18N_KEYS: Record<ID_FACE_ENUMS, string> = {
  [ID_FACE_ENUMS.FRONT]: "member.kyc.ID_positive",
  [ID_FACE_ENUMS.BACK]: "member.kyc.ID_reverse",
  [ID_FACE_ENUMS.SELFIE]: "member.kyc.photo_with_ID"
}
