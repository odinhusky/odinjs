/** 歷史紀錄頁面選單列表 */
export enum HISTORY_UPDATED_BY_TYPE_ENUMS {
  /** 全部 */
  All = -1,

  /** 會員 */
  Member = 0,

  /** AI */
  Ai = 1
}

export const HISTORY_UPDATED_BY_TYPE_I18N_KEYS: Record<HISTORY_UPDATED_BY_TYPE_ENUMS, string> = {
  [HISTORY_UPDATED_BY_TYPE_ENUMS.All]: "common.btn.all",
  [HISTORY_UPDATED_BY_TYPE_ENUMS.Member]: "tableHeader.member",
  [HISTORY_UPDATED_BY_TYPE_ENUMS.Ai]: "Ai"
}
