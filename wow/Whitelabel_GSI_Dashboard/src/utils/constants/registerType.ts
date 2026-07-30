// 只有REGISTER_METHOD為Operator時才會用到此Enum
export enum Enums {
  /** 後台註冊 */
  Backoffice = 1,

  /** 會員端註冊 */
  Web = 2,

  /** 對外API註冊 */
  Api = 3
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Backoffice]: "register_type.backoffice",
  [Enums.Web]: "register_type.web",
  [Enums.Api]: "register_type.api"
}
