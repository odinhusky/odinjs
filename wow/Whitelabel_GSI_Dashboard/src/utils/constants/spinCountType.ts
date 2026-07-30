export enum Enums {
  /** 活躍 */
  Add = 0,

  /** 減少 */
  Subtract = 1
}

export const I18nKeys: Record<Enums | 0, string> = {
  [Enums.Add]: "common.add",
  [Enums.Subtract]: "common.subtract"
}
