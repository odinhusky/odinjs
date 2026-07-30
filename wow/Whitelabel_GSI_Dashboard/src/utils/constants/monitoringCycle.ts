export enum Enums {
  /** 及時偵測 */
  RealTimeDetection = 1,
  /** 每日偵測 */
  DailyDetection = 2,
  /** 每週偵測 */
  WeeklyDetection = 3,
  /** 每月偵測 */
  MonthlyDetection = 4,
  /** 幾天內 */
  INFEWDAYS = 5
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.RealTimeDetection]: "common.real_time_detection",
  [Enums.DailyDetection]: "common.daily_detection",
  [Enums.WeeklyDetection]: "common.weekly_detection",
  [Enums.MonthlyDetection]: "common.monthly_detection",
  [Enums.INFEWDAYS]: "common.in_few_days"
}
