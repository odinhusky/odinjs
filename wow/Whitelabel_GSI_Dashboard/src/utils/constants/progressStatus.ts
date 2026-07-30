export enum Enums {
  MOT_STARTED = 1, // 未處理
  IN_PROGRESS = 2, // 進行中
  ENDED = 3 // 結束
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.MOT_STARTED]: "progress_status.not_started",
  [Enums.IN_PROGRESS]: "progress_status.in_progress",
  [Enums.ENDED]: "progress_status.ended"
}
