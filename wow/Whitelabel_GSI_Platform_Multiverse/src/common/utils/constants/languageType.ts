/*
  Backend key
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
  韓文：ko
  孟加拉文: bn
  馬來文: bm
  阿拉伯文: ar
  緬甸語: my
  菲律賓文: tl
*/

export enum Enums {
  EN = "en",
  TH = "th",
  ID = "id",
  VI = "vi",
  CN = "zh-cn",
  TW = "zh-tw",
  JP = "jp",
  KO = "ko",
  SP = "sp",
  BR = "br",
  BM = "bm",
  BN = "bn",
  AR = "ar",
  MY = "my",
  TL = "tl",
  FR = "fr",
  SW = "sw",
  HI = "hi"
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.BR]: "common.brazil",
  [Enums.SP]: "common.spain",
  [Enums.EN]: "common.english",
  [Enums.TH]: "common.thai",
  [Enums.ID]: "common.india",
  [Enums.VI]: "common.vietnam",
  [Enums.CN]: "common.simple",
  [Enums.TW]: "common.traditional",
  [Enums.JP]: "common.japan",
  [Enums.KO]: "common.korean",
  [Enums.BM]: "common.bahasaMelayu",
  [Enums.BN]: "common.bengali",
  [Enums.AR]: "common.arabic",
  [Enums.MY]: "common.myanmar",
  [Enums.TL]: "common.filipino",
  // 新增語系（遠端 i18n 可能未必包含此 key；此處主要用於本機型別/下拉顯示 fallback）
  [Enums.FR]: "common.french",
  [Enums.SW]: "common.swahili",
  [Enums.HI]: "common.hindi"
}

export const Labels: Record<Enums, string> = {
  /** 未定義(全部) */
  [Enums.SP]: "España",
  [Enums.BR]: "Brasil",
  [Enums.EN]: "English",
  [Enums.TH]: "ภาษาไทย",
  [Enums.ID]: "Bahasa Indonesia",
  [Enums.VI]: "Tiếng Việt",
  [Enums.CN]: "中文(简体)",
  [Enums.TW]: "中文(繁體)",
  [Enums.JP]: "日本語",
  [Enums.KO]: "한국어",
  [Enums.BM]: "Bahasa Melayu",
  [Enums.BN]: "বাংলা",
  [Enums.AR]: "العربية",
  [Enums.MY]: "မြန်မာ",
  [Enums.TL]: "Filipino(Tagalog)",
  [Enums.FR]: "Français",
  [Enums.SW]: "Kiswahili",
  [Enums.HI]: "हिन्दी"
}

export const Abbreviation: Record<Enums, string> = {
  [Enums.BR]: "BR",
  [Enums.SP]: "SP",
  [Enums.EN]: "EN",
  [Enums.TH]: "TH",
  [Enums.ID]: "ID",
  [Enums.VI]: "VI",
  [Enums.CN]: "CN",
  [Enums.TW]: "TW",
  [Enums.JP]: "JP",
  [Enums.KO]: "KO",
  [Enums.BM]: "BM",
  [Enums.BN]: "BN",
  [Enums.AR]: "AR",
  [Enums.MY]: "MY",
  [Enums.TL]: "TL",
  [Enums.FR]: "FR",
  [Enums.SW]: "SW",
  [Enums.HI]: "HI"
}
