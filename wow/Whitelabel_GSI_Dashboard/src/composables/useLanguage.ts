import { getSettings } from "@/api/common"
import { useSiteStore } from "src/stores/siteStore"
import { useLanguageStore } from "src/stores/languageStore"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { LANGUAGE_TYPE } from "src/utils/constants"
import { useSearch } from "@/hook/useSearch"
/* backend key
  英語：en
  泰語：th
  越南：vi
  簡體中文：zh-cn
  繁體中文：zh-tw
  菲律宾: fil
  印尼：id
  印度：hi
  西班牙：sp
  巴西：br
  孟加拉：bn
  馬來西亞：bm
  阿拉伯:ar
 */

/**
 * 語言代碼到國旗代碼的映射
 * 使用 circle-flags (https://hatscripts.github.io/circle-flags/)
 */
const languageToFlagMap: Record<string, string> = {
  en: "us", // 英語 -> 美國
  fr: "fr", // 法語 -> 法國
  sw: "ke", // 斯瓦希里語 -> 肯亞
  "zh-cn": "cn", // 簡體中文 -> 中國
  "zh-tw": "tw", // 繁體中文 -> 台灣
  jp: "jp", // 日文 -> 日本
  th: "th", // 泰語 -> 泰國
  id: "id", // 印尼語 -> 印尼
  br: "br", // 巴西葡萄牙語 -> 巴西
  sp: "es", // 西班牙語 -> 西班牙
  vi: "vn", // 越南語 -> 越南
  ko: "kr", // 韓語 -> 韓國
  tl: "ph", // 菲律賓語 -> 菲律賓
  hi: "in", // 印地語 -> 印度
  bn: "bd", // 孟加拉語 -> 孟加拉
  bm: "my", // 馬來語 -> 馬來西亞
  ar: "ae", // 阿拉伯語 -> 阿拉伯聯合大公國
  my: "mm" // 緬甸語 -> 緬甸
}

export function useLanguage() {
  const { locale, availableLocales, t } = useI18n()
  const langStore = useLanguageStore()
  const siteStore = useSiteStore()
  const availableLanguages = computed(() =>
    siteStore.boLangLabels.filter((item) => availableLocales.includes(item as any))
  )

  function getLanguage() {
    return locale.value
  }

  function setLanguage(lang: string) {
    const availableLangs = availableLocales.filter((item) =>
      siteStore.boLangLabels.includes(item as LANGUAGE_TYPE.Enums)
    )
    if (!lang || !availableLangs.includes(lang)) return

    if (locale.value !== lang) {
      locale.value = lang
      langStore.setLanguage(lang)
    }
  }

  async function getAgentSetting() {
    const { search, status, tableData } = useSearch(getSettings)
    await search()

    if (!status) return
    await siteStore.updateSiteSetting(tableData.value)

    if (!siteStore.boDefaultLang || !siteStore.boLangLabels.length) return

    const storedLang = localStorage.getItem("lang") || ""
    // localStorage
    if (
      storedLang &&
      availableLocales.find((e) => e.toLowerCase().trim() === storedLang.toLowerCase().trim()) &&
      siteStore.boLangLabels.find((e) => e.toLowerCase().trim() === storedLang.toLowerCase().trim())
    ) {
      setLanguage(storedLang)
      return
    }

    // api default
    if (
      siteStore.boDefaultLang &&
      availableLocales.find((e) => e.toLowerCase().trim() === siteStore.boDefaultLang.toLowerCase().trim()) &&
      siteStore.boLangLabels.find((e) => e.toLowerCase().trim() === siteStore.boDefaultLang.toLowerCase().trim())
    ) {
      setLanguage(siteStore.boDefaultLang)
      return
    }

    // languageList[0]
    if (
      siteStore.boLangLabels.length &&
      availableLocales.find((e) => e.toLowerCase().trim() === siteStore.boLangLabels[0].toLowerCase().trim())
    ) {
      setLanguage(siteStore.boLangLabels[0])
    }
  }

  /**
   * 獲取語系標籤（使用與 header 語系下拉組件相同的方式）
   * @param langValue 語系代碼（如 "en", "zh-tw"）
   * @returns 語系標籤文字
   */
  function getLabel(langValue: string): string {
    const langKey = langValue.toLowerCase() as LANGUAGE_TYPE.Enums

    // 優先使用 I18nKeys 配合 t() 來實現 i18n
    if (LANGUAGE_TYPE.I18nKeys[langKey]) {
      const i18nKey = LANGUAGE_TYPE.I18nKeys[langKey]
      const translated = t(i18nKey)
      // 如果 t() 返回的值等於 key 本身，表示找不到翻譯，使用 Labels 作為 fallback
      if (translated === i18nKey && LANGUAGE_TYPE.Labels[langKey]) {
        return LANGUAGE_TYPE.Labels[langKey]
      }
      return translated
    }
    // 如果沒有 I18nKeys，則使用 Labels（與 header 一致）
    if (LANGUAGE_TYPE.Labels[langKey]) {
      return LANGUAGE_TYPE.Labels[langKey]
    }
    // 如果都沒有，返回原始值
    return langValue
  }

  /**
   * 獲取語言對應的國旗代碼
   * @param languageCode 語言代碼（如：en, zh-cn, zh-tw）
   * @returns 國旗代碼，如果沒有對應的則返回 null
   */
  function getFlagCode(languageCode: string): string | null {
    if (!languageCode) return null
    const normalizedCode = languageCode.toLowerCase()
    return languageToFlagMap[normalizedCode] || null
  }

  /**
   * 獲取語言對應的國旗 URL
   * @param languageCode 語言代碼（如：en, zh-cn, zh-tw）
   * @returns 國旗 SVG URL（使用本地文件），如果沒有對應的則返回 null
   */
  function getFlagUrl(languageCode: string): string | null {
    const flagCode = getFlagCode(languageCode)
    if (!flagCode) return null
    // 使用本地下載的國旗文件（位於 public/images/flags/circle/）
    return `/images/flags/circle/${flagCode}.svg`
  }

  return {
    /** 可使用語系列表 */
    availableLanguages,

    /** 取得當前使用語系 */
    getLanguage,

    /** 設定語系 */
    setLanguage,

    /** 取得代理設定語系 */
    getAgentSetting,

    /** 獲取語系標籤 */
    getLabel,

    /** 獲取語言對應的國旗代碼 */
    getFlagCode,

    /** 獲取語言對應的國旗 URL */
    getFlagUrl
  }
}
