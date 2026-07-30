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

export enum LANGUAGE_TYPE_ENUMS {
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
  TL = "tl"
}



export enum LANGUAGE_CODE_ENUMS {
  en = 0,

  "zh-tw" = 1,

  "zh-cn" = 2,

  th = 3,

  id = 4,

  jp = 5,

  ko = 6,

  vi = 7,

  br = 12,

  my = 13,

  bm = 36,

  sp = 40
}


export const LANGUAGE_I18N_KEYS: Record<LANGUAGE_TYPE_ENUMS | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [LANGUAGE_TYPE_ENUMS.BR]: "common.brazil",
  [LANGUAGE_TYPE_ENUMS.SP]: "common.spain",
  [LANGUAGE_TYPE_ENUMS.EN]: "common.english",
  [LANGUAGE_TYPE_ENUMS.TH]: "common.thai",
  [LANGUAGE_TYPE_ENUMS.ID]: "common.india",
  [LANGUAGE_TYPE_ENUMS.VI]: "common.vietnam",
  [LANGUAGE_TYPE_ENUMS.CN]: "common.simple",
  [LANGUAGE_TYPE_ENUMS.TW]: "common.traditional",
  [LANGUAGE_TYPE_ENUMS.JP]: "common.japan",
  [LANGUAGE_TYPE_ENUMS.KO]: "common.korean",
  [LANGUAGE_TYPE_ENUMS.BM]: "common.bahasaMelayu",
  [LANGUAGE_TYPE_ENUMS.BN]: "common.bengali",
  [LANGUAGE_TYPE_ENUMS.AR]: "common.arabic",
  [LANGUAGE_TYPE_ENUMS.MY]: "common.myanmar",
  [LANGUAGE_TYPE_ENUMS.TL]: "common.filipino"
}

export const LANGUAGE_LABELS: Record<LANGUAGE_TYPE_ENUMS, string> = {
  /** 未定義(全部) */
  [LANGUAGE_TYPE_ENUMS.SP]: "España",
  [LANGUAGE_TYPE_ENUMS.BR]: "Brasil",
  [LANGUAGE_TYPE_ENUMS.EN]: "English",
  [LANGUAGE_TYPE_ENUMS.TH]: "ภาษาไทย",
  [LANGUAGE_TYPE_ENUMS.ID]: "Bahasa Indonesia",
  [LANGUAGE_TYPE_ENUMS.VI]: "Tiếng Việt",
  [LANGUAGE_TYPE_ENUMS.CN]: "中文(简体)",
  [LANGUAGE_TYPE_ENUMS.TW]: "中文(繁體)",
  [LANGUAGE_TYPE_ENUMS.JP]: "日本語",
  [LANGUAGE_TYPE_ENUMS.KO]: "한국어",
  [LANGUAGE_TYPE_ENUMS.BM]: "Bahasa Melayu",
  [LANGUAGE_TYPE_ENUMS.BN]: "বাংলা",
  [LANGUAGE_TYPE_ENUMS.AR]: "العربية",
  [LANGUAGE_TYPE_ENUMS.MY]: "မြန်မာ",
  [LANGUAGE_TYPE_ENUMS.TL]: "Filipino(Tagalog)"
}

export const LANGUAGE_ABBREVIATIONS: Record<LANGUAGE_TYPE_ENUMS, string> = {
  [LANGUAGE_TYPE_ENUMS.BR]: "BR",
  [LANGUAGE_TYPE_ENUMS.SP]: "SP",
  [LANGUAGE_TYPE_ENUMS.EN]: "EN",
  [LANGUAGE_TYPE_ENUMS.TH]: "TH",
  [LANGUAGE_TYPE_ENUMS.ID]: "ID",
  [LANGUAGE_TYPE_ENUMS.VI]: "VI",
  [LANGUAGE_TYPE_ENUMS.CN]: "CN",
  [LANGUAGE_TYPE_ENUMS.TW]: "TW",
  [LANGUAGE_TYPE_ENUMS.JP]: "JP",
  [LANGUAGE_TYPE_ENUMS.KO]: "KO",
  [LANGUAGE_TYPE_ENUMS.BM]: "BM",
  [LANGUAGE_TYPE_ENUMS.BN]: "BN",
  [LANGUAGE_TYPE_ENUMS.AR]: "AR",
  [LANGUAGE_TYPE_ENUMS.MY]: "MY",
  [LANGUAGE_TYPE_ENUMS.TL]: "TL"
}
