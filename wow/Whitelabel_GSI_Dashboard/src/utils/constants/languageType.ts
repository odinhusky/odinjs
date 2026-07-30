/* backend key
  英語：en
  泰語：th
  越南：vi
  簡體中文：zh-cn
  繁體中文：zh-tw
  菲律宾: fil
  印尼：id
  印度：hi
  西班牙：es
  巴西：pt-br
  阿拉伯-ar
  韓國：ko
  菲律賓：tl
 */
export enum Enums {
  EN = "en",
  FR = "fr",
  SW = "sw",
  TH = "th",
  ID = "id",
  VI = "vi",
  CN = "zh-cn",
  TW = "zh-tw",
  JP = "jp",
  BN = "bn",
  SP = "sp",
  BR = "br",
  BM = "bm",
  AR = "ar",
  KO = "ko",
  MY = "my",
  TL = "tl",
  HI = "hi"
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.EN]: "common.english",
  [Enums.FR]: "common.french",
  [Enums.SW]: "common.swahili",
  [Enums.TH]: "common.thai",
  [Enums.ID]: "common.india",
  [Enums.VI]: "common.vietnam",
  [Enums.CN]: "common.simple",
  [Enums.TW]: "common.traditional",
  [Enums.JP]: "common.japan",
  [Enums.BN]: "common.bn",
  [Enums.SP]: "common.sp",
  [Enums.BR]: "common.br",
  [Enums.BM]: "common.bm",
  [Enums.AR]: "common.ar",
  [Enums.MY]: "common.my",
  [Enums.KO]: "common.ko",
  [Enums.TL]: "common.tl",
  [Enums.HI]: "common.hi"
}

export const Labels: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.EN]: "English",
  [Enums.FR]: "Français",
  [Enums.SW]: "Kiswahili",
  [Enums.TH]: "ภาษาไทย",
  [Enums.ID]: "Bahasa Indonesia",
  [Enums.VI]: "Tiếng Việt",
  [Enums.CN]: "中文（简体）",
  [Enums.TW]: "中文（繁體）",
  [Enums.JP]: "日本語",
  [Enums.BN]: "Bengali",
  [Enums.SP]: "Español",
  [Enums.BR]: "Brazilian Portuguese",
  [Enums.BM]: "Bahasa Melayu",
  [Enums.AR]: "العربية",
  [Enums.KO]: "한국어",
  [Enums.MY]: "ဗမာစာ",
  [Enums.TL]: "Filipino-Tagalog",
  [Enums.HI]: "Hindī"
}

export const Abbreviation: Record<Enums, string> = {
  [Enums.EN]: "EN",
  [Enums.FR]: "FR",
  [Enums.SW]: "SW",
  [Enums.TH]: "TH",
  [Enums.ID]: "ID",
  [Enums.VI]: "VI",
  [Enums.CN]: "CN",
  [Enums.TW]: "TW",
  [Enums.JP]: "JP",
  [Enums.BN]: "BN",
  [Enums.SP]: "SP",
  [Enums.BR]: "BR",
  [Enums.BM]: "BM",
  [Enums.AR]: "AR",
  [Enums.KO]: "KO",
  [Enums.MY]: "MY",
  [Enums.TL]: "TL",
  [Enums.HI]: "HI"
}
