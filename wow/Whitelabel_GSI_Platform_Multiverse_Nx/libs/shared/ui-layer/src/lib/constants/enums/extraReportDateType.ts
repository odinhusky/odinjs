export enum EXTRA_REPORT_DATE_TYPE_ENUMS {
  /** 今天 */
  TODAY = 5,

  /** 昨天 */
  YESTERDAY = 6

}

export const EXTRA_REPORT_DATE_TYPE_I18N_KEYS: Record<EXTRA_REPORT_DATE_TYPE_ENUMS, string> = {
  [EXTRA_REPORT_DATE_TYPE_ENUMS.TODAY]: "common.btn.today",
  [EXTRA_REPORT_DATE_TYPE_ENUMS.YESTERDAY]: "common.btn.yesterday"
}
