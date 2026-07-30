export enum Enums {
  /** 指定代理 */
  DesignatedAgent = 1,

  /** 全代理 */
  FullAgent = 2
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.DesignatedAgent]: "announcement_object.designated_agent",
  [Enums.FullAgent]: "announcement_object.full_agent"
}
