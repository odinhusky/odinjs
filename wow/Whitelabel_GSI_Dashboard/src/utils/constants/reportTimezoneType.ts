export enum Enums {
  UTC0 = 0,
  Client
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.UTC0]: "common.timezone_utc0",
  [Enums.Client]: "common.timezone_client"
}
