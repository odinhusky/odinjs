export enum Enums {
  /** 單筆異動 */
  Single = 1,

  /** 批次異動 */
  Multi,

  /** 檔案匯入 */
  FileImport
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Single]: "member_level.modify_by_single",
  [Enums.Multi]: "member_level.modify_by_multi",
  [Enums.FileImport]: "member_level.modify_by_file_import"
}
