export enum Enums {
  /** 預設佣金 */
  Default = 1,

  /** vip1 */
  Vip1 = 2
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Default]: "commission_group.default",
  [Enums.Vip1]: "commission_group.vip1"
}
