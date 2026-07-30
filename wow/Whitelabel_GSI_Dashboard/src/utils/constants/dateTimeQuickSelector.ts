export enum Enums {
  Today = 1,
  Yesterday,
  ThreeDaysBefore,
  ThisWeek,
  LastWeek,
  ThisMonth,
  LastMonth
}

export const I18nKeys: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.Today]: "common.today",
  [Enums.Yesterday]: "common.yesterday",
  [Enums.ThreeDaysBefore]: "common.these_three_days",
  [Enums.ThisWeek]: "common.this_week",
  [Enums.LastWeek]: "common.last_week",
  [Enums.ThisMonth]: "common.this_month",
  [Enums.LastMonth]: "common.last_month"
}
