export enum Enums {
  /** Gmail */
  Gmail = 1,

  /** Outlook */
  Outlook = 2,

  /** iCloud */
  iCloud = 3
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Gmail]: "email_smtp_type.gmail",
  [Enums.Outlook]: "email_smtp_type.outlook",
  [Enums.iCloud]: "email_smtp_type.icloud"
}
