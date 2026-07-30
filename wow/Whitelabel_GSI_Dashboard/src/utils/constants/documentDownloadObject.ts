export enum Enums {
  /** 文件目標所有主控 */
  FILE_TARGET_ALL_MASTER = 1,

  /** 文件目標所有代理 */
  FILE_TARGET_ALL_AGENT = 2,

  /** 文件目標特定代理 */
  FILE_TARGET_SPECIFIC_AGENT = 3
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.FILE_TARGET_ALL_MASTER]: "download_object.file_target_all_master",
  [Enums.FILE_TARGET_ALL_AGENT]: "download_object.file_target_all_agent",
  [Enums.FILE_TARGET_SPECIFIC_AGENT]: "download_object.file_target_specific_agent"
}
