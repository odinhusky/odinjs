export enum GENDER_ENUMS {
  /** 未指定 */
  NOTSPECIFIED = 0,

  /** 男 */
  MALE = 1,

  /** 女 */
  FEMALE = 2
}

export const GENDER_I18N_KEYS: Record<GENDER_ENUMS, string> = {
  [GENDER_ENUMS.NOTSPECIFIED]: "member.profile.notSpecified",
  [GENDER_ENUMS.MALE]: "member.profile.male",
  [GENDER_ENUMS.FEMALE]: "member.profile.female"
}
