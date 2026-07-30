export enum Enums {
  BigpayzInternetBanking = 1,
  APlusPay,
  Help2Pay,
  GSPAY,
  GSPAYTHB,
  TongspayUSDT
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.BigpayzInternetBanking]: "payer_list.bigpayz_internet_banking",
  [Enums.APlusPay]: "payer_list.a_plus_pay",
  [Enums.Help2Pay]: "payer_list.help_two_pay",
  [Enums.GSPAY]: "payer_list.gspay",
  [Enums.GSPAYTHB]: "payer_list.gspay_thb",
  [Enums.TongspayUSDT]: "payer_list.tongspay_usdt"
}
