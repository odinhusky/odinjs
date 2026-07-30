export enum INVITATION_STATUS_ENUMS {
  /** 全部 */
  ALL = -1,

  /** 未達成 */
  NOT_ACHIEVED = 0,

  /** 達成 */
  ACHIEVED = 1
}

export const INVITATION_STATUS_I18N_KEYS: Record<INVITATION_STATUS_ENUMS, string> = {
  [INVITATION_STATUS_ENUMS.ALL]: "common.btn.all",
  [INVITATION_STATUS_ENUMS.NOT_ACHIEVED]: "collaboration.not_achieved",
  [INVITATION_STATUS_ENUMS.ACHIEVED]: "collaboration.achieved"
}
