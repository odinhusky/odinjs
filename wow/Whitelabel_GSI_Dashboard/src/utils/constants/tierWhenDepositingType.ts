export enum Enums {
  BronzeVip = 1,
  SilverVip,
  GoldVip,
  PlatinumVip,
  DiamondVip
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.BronzeVip]: "tier_when_depositing.bronze_vip",
  [Enums.SilverVip]: "tier_when_depositing.silver_vip",
  [Enums.GoldVip]: "tier_when_depositing.gold_vip",
  [Enums.PlatinumVip]: "tier_when_depositing.platinum_vip",
  [Enums.DiamondVip]: "tier_when_depositing.diamond_vip"
}
