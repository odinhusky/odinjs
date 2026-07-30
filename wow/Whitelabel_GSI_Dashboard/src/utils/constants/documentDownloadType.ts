export enum Enums {
  /** 文件類型一般 */
  FILE_TYPE_GENERAL = 1,

  /** 文件類型請求 */
  FILE_TYPE_REQUEST = 2,

  /** 文件類型手冊 */
  FILE_TYPE_MANUAL = 3,

  /** 文件類型客戶服務 */
  FILE_TYPE_CUSTOMER_SERVICE = 4
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.FILE_TYPE_GENERAL]: "download_type.file_type_general",
  [Enums.FILE_TYPE_REQUEST]: "download_type.file_type_request",
  [Enums.FILE_TYPE_MANUAL]: "download_type.file_type_manual",
  [Enums.FILE_TYPE_CUSTOMER_SERVICE]: "download_type.file_type_customer_service"
}
