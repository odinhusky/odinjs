export enum Enums {
  /** 使用密碼進行註冊 */
  Operator = 0,

  /** 使用Sms進行註冊 */
  Sms = 1,

  /** 使用 Telegram Bot 進行註冊 */
  TelegramBot = 2,

  /** 使用三方 SSO 進行註冊 */
  Sso = 3,

  /** 透過 Telegram 註冊 */
  Telegram = 4,

  /** 透過 Google 註冊 */
  Google = 5
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Operator]: "register_method.password",
  [Enums.Sms]: "register_method.thirdpartySms",
  [Enums.TelegramBot]: "register_method.telegram_bot",
  [Enums.Sso]: "register_method.thirdpartySso",
  [Enums.Telegram]: "register_method.telegram",
  [Enums.Google]: "register_method.google"
}
