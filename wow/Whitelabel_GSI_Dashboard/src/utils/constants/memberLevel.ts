export enum Enums {
  /** 預設層級 */
  Initial = 1,

  /** 黑名單 */
  Black,

  /** 一般層級 */
  Normal,

  /** 青銅VIP */
  Bronze,

  /** 白銀VIP */
  Silver,

  /** 黃金VIP */
  Gold,

  /** 白金VIP */
  Platinum,

  /** 鑽石VIP */
  Diamond
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Initial]: "membership_level.initial_member",
  [Enums.Black]: "membership_level.black_list",
  [Enums.Normal]: "membership_level.general_member",
  [Enums.Bronze]: "membership_level.bronze_vip",
  [Enums.Silver]: "membership_level.silver_vip",
  [Enums.Gold]: "membership_level.gold_vip",
  [Enums.Platinum]: "membership_level.platinum_vip",
  [Enums.Diamond]: "membership_level.diamond_vip"
}
