export enum Enums {
  /** 關於我 */
  ABOUT_US = 1,

  /** 條款 */
  TERMS_CONDITION,

  /** 隱私權 */
  PRIVACY_POLICY,

  /** 負責任的遊戲 */
  RESPONSIBLE_GAME
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ABOUT_US]: "cms.about_us",
  [Enums.TERMS_CONDITION]: "cms.term_condition",
  [Enums.PRIVACY_POLICY]: "cms.privacy_policy",
  [Enums.RESPONSIBLE_GAME]: "cms.responsible_gaming"
}
