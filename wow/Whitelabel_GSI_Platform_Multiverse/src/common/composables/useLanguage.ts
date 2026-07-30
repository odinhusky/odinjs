import { register } from "./../../api/login"
import { getSetting } from "src/api/setting"
import { useApi } from "src/common/hooks/useApi"
import { useEnvInfoStore } from "src/stores/envStore"
import { useLanguageStore } from "src/stores/languageStore"
import { liveChatConfigsStore } from "src/stores/liveChatConfigsStore"
import { tafficAnalysisStore } from "src/stores/TrafficAnalysisStore"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { loadLanguageAsync } from "src/common/i18n/loadLanguageAsync"
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
  韓文：ko
  孟加拉文: bn
  馬來文: bm
  緬甸語: my
  菲律賓文: tl
 */

export function useLanguage() {
  const route = useRoute()
  const router = useRouter()
  const { locale, availableLocales } = useI18n()
  const langStore = useLanguageStore()
  const { updateEnvAgentSetting } = useEnvInfoStore()
  const { updateLiveChatConfigs } = liveChatConfigsStore()
  const { updateTrafficAnalysisConfigMap } = tafficAnalysisStore()

  const availableLanguages = computed(() => {
    // 按照 data.language 轉成 array 後的順序，過濾出在 availableLocales 中存在的語系
    const languageList = langStore.storedLanguageList
    if (!languageList || languageList.length === 0) {
      return []
    }

    // 保持 languageList 的順序，只保留在 availableLocales 中存在的語系
    return languageList.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0 && availableLocales.includes(item)
    )
  }).value

  const langListWithLabel = computed(() =>
    availableLanguages.map((e) => {
      const langLabel: { [key: string]: string } = {
        en: "English",
        "zh-cn": "简体中文",
        "zh-tw": "繁體中文",
        jp: "日本語",
        th: "แบบไทย",
        vi: "Tiếng Việt",
        ko: "한국어",
        bn: "বাংলা",
        sp: "Español",
        br: "Português (Brasil)",
        id: "Bahasa Indonesia",
        bm: "Bahasa Melayu",
        ar: "العربية",
        my: "မြန်မာ",
        tl: "Filipino(Tagalog)",
        hi: "हिन्दी",
        fr: "Français",
        sw: "Kiswahili"
      }

      return {
        label: langLabel[e] || e,
        value: e
      }
    })
  )

  const nowLang = computed(() => locale.value)

  const apiLanguages = ref<string[]>([])

  const normalizeLanguageCode = (lang?: string) => {
    const normalized = (lang || "en").toLowerCase().trim()
    if (!normalized) return "en"
    if (normalized === "ja") return "jp"
    return normalized
  }

  const flagImages = import.meta.globEagerDefault("../assets/images/flag/*.{png,jpg,jpeg,webp,svg,gif}") as Record<string, string>
  const squareFlagImages = import.meta.globEagerDefault("../assets/images/flagSquare/*.{png,jpg,jpeg,webp,svg,gif}") as Record<string, string>

  const getFlagFromMap = (imageMap: Record<string, string>, folder: "flag" | "flagSquare", lang?: string) => {
    const normalized = normalizeLanguageCode(lang)
    const match = Object.entries(imageMap).find(([key]) => key.includes(`/${folder}/${normalized}.`))
    if (match) return match[1]

    const fallback = Object.entries(imageMap).find(([key]) => key.includes(`/${folder}/en.`))
    return fallback ? fallback[1] : ""
  }

  const getFlagImg = (url?: unknown) => {
    return getFlagFromMap(flagImages, "flag", typeof url === "string" ? url : undefined)
  }

  const getSquareFlagImg = (url?: unknown) => {
    return getFlagFromMap(squareFlagImages, "flagSquare", typeof url === "string" ? url : undefined)
  }

  function getLanguage() {
    return locale.value
  }

  async function setLanguage(lang: string) {
    const availableLangs = availableLocales.filter((item) => langStore.storedLanguageList.includes(item))
    if (!lang || !availableLangs.includes(lang)) return

    // 先載入語系檔案
    const loaded = await loadLanguageAsync(lang)
    if (!loaded) {
      console.warn(`Failed to load language: ${lang}`)
      return
    }

    if (locale.value !== lang) {
      locale.value = lang
      langStore.setStoreLang(lang)

      await langStore.executeLanguageChangeFunc()
    }
  }

  function checkLang(lang: string) {
    return (
      availableLocales.find((e) => e.toLowerCase().trim() === lang.toLowerCase().trim()) &&
      apiLanguages.value.find((e) => e.toLowerCase().trim() === lang.toLowerCase().trim())
    )
  }

  async function getAgentSetting() {
    const { status, data } = await useApi(getSetting)

    if (status) {
      langStore.setAgentLangSetting(data)
      updateEnvAgentSetting(data)
      updateLiveChatConfigs(data)
      updateTrafficAnalysisConfigMap(data)

      apiLanguages.value = (JSON.parse(data.language) as string[]) || []

      if (!apiLanguages.value || !apiLanguages.value.length) return

      // query
      const queryLang = route.query.lang as string
      if (queryLang && checkLang(queryLang)) {
        await setLanguage(queryLang)
        langStore.setStoreLang(queryLang)
        const query = { ...router.currentRoute.value.query }
        delete query.lang
        router.push({ query })
        return
      }

      // localStorage
      if (langStore.storedLang && checkLang(langStore.storedLang)) {
        await setLanguage(langStore.storedLang)
        return
      }

      // api default
      if (data.default_language && checkLang(data.default_language)) {
        await setLanguage(data.default_language)
        return
      }

      // languageList[0]
      if (apiLanguages.value.length && checkLang(apiLanguages.value[0])) {
        await setLanguage(apiLanguages.value[0])
      }
    }
  }

  function getCountryNameByCode(localeCode: string, displayLang = "en") {
    const displayNames = new Intl.DisplayNames([displayLang], { type: "language" })

    if (localeCode == "jp") localeCode = "ja"

    return displayNames.of(localeCode)
  }

  function registerLanguageChangeFunc(func: () => void | Promise<void>) {
    langStore.registerLanguageChangeFunc(func)
  }

  function unregisterLanguageChangeFunc(func: () => void | Promise<void>) {
    langStore.unregisterLanguageChangeFunc(func)
  }

  async function executeLanguageChangeFunc() {
    await langStore.executeLanguageChangeFunc()
  }

  return {
    /** 可使用語系列表 */
    availableLanguages,

    /** 可使用語系列表含標籤 */
    langListWithLabel,

    /** 當前語系 */
    nowLang,

    /** 取得當前使用語系 */
    getLanguage,

    /** 設定語系 */
    setLanguage,

    /** 取得語系國旗圓形圖 */
    getFlagImg,

    /** 取得語系國旗方形圖 */
    getSquareFlagImg,

    /** 取得代理設定語系 */
    getAgentSetting,

    /** 使用語系代號取得國家名稱 (國家名稱按當前使用語系顯示),
     * ex: zh-tw => Chinese (Taiwan) */
    getCountryNameByCode,

    /** 註冊語系變更回調函數 */
    registerLanguageChangeFunc,

    /** 取消註冊語系變更回調函數 */
    unregisterLanguageChangeFunc,

    /** 執行語系變更回調函數 */
    executeLanguageChangeFunc
  }
}
