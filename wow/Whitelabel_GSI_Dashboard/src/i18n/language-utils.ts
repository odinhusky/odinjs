export type Language = "en" | "fr-FR" | "es-ES" | "zh-CN" | "zh-TW"

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
  韓國：ko
  菲律賓：tl
  緬甸：my
 */
export const availableLanguages = [
  {
    value: "en",
    key: "en",
    i18nKey: "english",
    backendKey: "en"
  },
  {
    value: "fr",
    key: "fr",
    i18nKey: "fr",
    backendKey: "fr"
  },
  {
    value: "sw",
    key: "sw",
    i18nKey: "sw",
    backendKey: "sw"
  },
  {
    value: "zh-cn",
    key: "zh-CN",
    i18nKey: "simple",
    backendKey: "zh-cn"
  },
  {
    value: "zh-tw",
    key: "zh-TW",
    i18nKey: "traditional",
    backendKey: "zh-tw"
  },
  {
    value: "jp",
    key: "jp",
    i18nKey: "japan",
    backendKey: "jp"
  },
  {
    value: "th",
    key: "th",
    i18nKey: "th",
    backendKey: "th"
  },
  {
    value: "id",
    key: "id",
    i18nKey: "id",
    backendKey: "id"
  },
  {
    value: "br",
    key: "br",
    i18nKey: "br",
    backendKey: "br"
  },
  {
    value: "sp",
    key: "sp",
    i18nKey: "sp",
    backendKey: "sp"
  },
  {
    value: "bn",
    key: "bn",
    i18nKey: "bn",
    backendKey: "bn"
  },
  {
    value: "bm",
    key: "bm",
    i18nKey: "bm",
    backendKey: "bm"
  },
  {
    value: "ar",
    key: "Arabic",
    i18nKey: "ar",
    backendKey: "ar"
  },
  {
    value: "tl",
    key: "Filipino-Tagalog",
    i18nKey: "tl",
    backendKey: "tl"
  },
  {
    value: "hi",
    key: "Hindī",
    i18nKey: "hi",
    backendKey: "hi"
  },
  {
    value: "ko",
    key: "ko",
    i18nKey: "ko",
    backendKey: "ko"
  },
  {
    value: "my",
    key: "my",
    i18nKey: "my",
    backendKey: "my"
  },
  {
    value: "vi",
    key: "vi",
    i18nKey: "vietnam",
    backendKey: "vi"
  }
]
