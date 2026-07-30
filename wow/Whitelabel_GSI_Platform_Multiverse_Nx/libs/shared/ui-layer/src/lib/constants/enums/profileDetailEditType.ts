export enum PROFILE_DETAIL_EDIT_TYPE_ENUMS {
  /** 全名 */
  REALNAME = 0,

  /** 匿名 */
  NICKNAME = 1,

  /** 匿名 */
  GENDER = 2,

  /** 匿名 */
  BIRTH = 3,

  /** 匿名 */
  CONTACT1 = 4,

  /** 匿名 */
  CONTACT2 = 5,

  /** 自我排除 */
  SELF_EXCLUSION = 6,
}

export const PROFILE_DETAIL_EDIT_TYPE_I18N_KEYS: Record<PROFILE_DETAIL_EDIT_TYPE_ENUMS, string> = {
  [PROFILE_DETAIL_EDIT_TYPE_ENUMS.REALNAME]: "member.register.fullName",
  [PROFILE_DETAIL_EDIT_TYPE_ENUMS.NICKNAME]: "member.profile.nickname",
  [PROFILE_DETAIL_EDIT_TYPE_ENUMS.GENDER]: "member.register.gender",
  [PROFILE_DETAIL_EDIT_TYPE_ENUMS.BIRTH]: "member.register.birthdate",
  [PROFILE_DETAIL_EDIT_TYPE_ENUMS.CONTACT1]: "member.register.contact1",
  [PROFILE_DETAIL_EDIT_TYPE_ENUMS.CONTACT2]: "member.register.contact2",
  [PROFILE_DETAIL_EDIT_TYPE_ENUMS.SELF_EXCLUSION]: "member.profile.disableAccountDate"
}
