export enum Enums {
  WARNING_STATUS_PROCESSING = 1, // 待處理
  WARNING_STATUS_SUCCESS = 2, // 處理成功
  WARNING_STATUS_CANCELED = 3 // 不處理
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.WARNING_STATUS_PROCESSING]: "warning_status.pendings",
  [Enums.WARNING_STATUS_SUCCESS]: "warning_status.success",
  [Enums.WARNING_STATUS_CANCELED]: "warning_status.cancelled"
}
