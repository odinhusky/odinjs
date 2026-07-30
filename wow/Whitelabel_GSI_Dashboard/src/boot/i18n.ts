import { defineBoot } from "#q-app/wrappers"
import type { Composer, I18n } from "vue-i18n"
import { createI18n } from "vue-i18n"
import { useLanguageStore } from "src/stores/languageStore"
import { availableLanguages } from "src/i18n/language-utils"
import { watch } from "vue"

import { LANGUAGE_TYPE } from "src/utils/constants"

// 擴展 globalThis 型別
declare global {
  // eslint-disable-next-line no-var
  var $t: Composer["t"]
  // eslint-disable-next-line no-var
  var $te: Composer["te"]
  // eslint-disable-next-line no-var
  var $d: Composer["d"]
  // eslint-disable-next-line no-var
  var $n: Composer["n"]
  // eslint-disable-next-line no-var
  var $i18n: I18n
}

const loadedLanguages = new Set<string>()
let remoteI18nVersion: string | null = null

const LOCALE_BASE_URL = import.meta.env.VITE_I18N_LOCALE_URL || process.env.VITE_I18N_LOCALE_URL || "/locales/"

const LEGACY_LOCALE_MAP: Record<string, string> = {
  jp: "ja",
  sp: "es",
  br: "pt",
  bm: "ms"
}

/**
 * 獲取遠端語系版本號 (version.json)
 */
async function fetchRemoteVersion() {
  if (remoteI18nVersion) return remoteI18nVersion
  try {
    const response = await fetch(`${LOCALE_BASE_URL}version.json?t=${new Date().getTime()}`)
    if (!response.ok) throw new Error("無法取得版本資訊")
    const data = await response.json()
    remoteI18nVersion = data.version
    return remoteI18nVersion
  } catch (e) {
    return null
  }
}

/**
 * 清理並校正語系檔中的 Placeholder
 * 1. 智慧修復：比對英文對照組，如果 {} 數量一致，則按順序還原正確的變數名 (例如 {মিনিট} -> {min})
 * 2. 基本防護：若無法匹配，則將其改為 [ ] 格式，避免 vue-i18n 解析失敗導致 runtime error
 */
function sanitizeMessages(messages: Record<string, any>, locale: string, referenceMessages?: Record<string, any>) {
  const regex = /\{([^{}]+)\}/g
  const doubleBraceRegex = /\{\{([A-Za-z_$][A-Za-z0-9_$]*)\}\}/g
  const sanitized = { ...messages }
  let hasCorrection = false

  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      const currentVal = sanitized[key].replace(doubleBraceRegex, (match: string) => {
        hasCorrection = true
        return `{'${match}'}`
      })
      const currentMatches = currentVal.match(regex)
      const enVal = referenceMessages?.[key]
      const enMatches = typeof enVal === "string" ? enVal.match(regex) : null

      // --- 1. 智慧修復邏輯 ---
      if (currentMatches && enMatches && currentMatches.length === enMatches.length) {
        let repaired = currentVal
        currentMatches.forEach((badToken: string, index: number) => {
          if (badToken !== enMatches[index]) {
            hasCorrection = true
            repaired = repaired.replace(badToken, enMatches[index])
          }
        })
        sanitized[key] = repaired
      }
      // --- 2. 基本防護邏輯 (防止非 ASCII 字符或空格導致崩潰) ---
      else {
        sanitized[key] = currentVal.replace(regex, (match: string, p1: string) => {
          if (/[^\x00-\x7F]/.test(p1) || /\s/.test(p1)) {
            hasCorrection = true
            return `[${p1}]`
          }
          return match
        })
      }
    }
  }

  if (hasCorrection) {
    console.warn(`[i18n] Sanitized invalid placeholders in [${locale}] using reference-match or safety-rules.`)
  }
  return sanitized
}

/**
 * 載入語系檔的非同步函式 (先比對遠端 version.json)
 */
async function loadLocaleMessages(i18n: I18n<any, any, any, any, false>, locale: string) {
  if (loadedLanguages.has(locale)) {
    i18n.global.locale.value = locale
    return
  }

  // 如果載入的是非英文語系，確保英文版已經載入(作為分析對比用)
  let enMessages: Record<string, any> | undefined
  if (locale !== "en") {
    if (!loadedLanguages.has("en")) {
      await loadLocaleMessages(i18n, "en")
    }
    enMessages = i18n.global.getLocaleMessage("en") as Record<string, any>
  }

  const currentRemoteVersion = await fetchRemoteVersion()
  const cacheKey = `i18n_cache_${locale}`
  const cached = localStorage.getItem(cacheKey)

  // 開發模式下不使用快取，確保語系檔變更即時生效
  if (!process.env.DEV && cached && currentRemoteVersion) {
    try {
      const { version, messages: rawMessages } = JSON.parse(cached)
      if (version === currentRemoteVersion) {
        const messages = sanitizeMessages(rawMessages, locale, enMessages)
        i18n.global.setLocaleMessage(locale, messages)
        loadedLanguages.add(locale)
        i18n.global.locale.value = locale
        return
      }
    } catch (e) {
      // 解析失敗不處理，走 Fetch 流程
    }
  }

  try {
    const langOption = availableLanguages.find((l: any) => l.value === locale)
    let fetchFilename = langOption?.key || locale

    // 修復 legacy code 加載錯誤
    if (LEGACY_LOCALE_MAP[fetchFilename]) {
      fetchFilename = LEGACY_LOCALE_MAP[fetchFilename]
    }

    const versionParam = process.env.DEV ? new Date().getTime() : currentRemoteVersion || new Date().getTime()
    const response = await fetch(`${LOCALE_BASE_URL}${fetchFilename}.json?v=${versionParam}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const rawMessages = await response.json()
    const messages = sanitizeMessages(rawMessages, locale, enMessages)

    // 存入快取 (如果有獲取到版本號)
    if (currentRemoteVersion) {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          version: currentRemoteVersion,
          messages
        })
      )
    }

    i18n.global.setLocaleMessage(locale, messages)
    loadedLanguages.add(locale)
    i18n.global.locale.value = locale
  } catch (error) {
    console.error(`無法載入語系檔 [${locale}]:`, error)
    // 如果載入失敗且不是預設語系，嘗試載入英文作為後備
    if (locale !== "en") {
      await loadLocaleMessages(i18n, "en")
    }
  }
}

export default defineBoot(async ({ app }) => {
  const languageStore = useLanguageStore()

  // 預先定義所有可能的語系 key，確保 i18n.global.availableLocales 完整
  const initialMessages = Object.values(LANGUAGE_TYPE.Enums).reduce(
    (acc, lang) => {
      acc[lang] = {}
      return acc
    },
    {} as Record<string, any>
  )

  // 初始建立 i18n 實例
  const i18n = createI18n({
    locale: languageStore.currentLanguage,
    fallbackLocale: "en",
    legacy: false,
    flatJson: true,
    sync: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    globalInjection: true,
    messages: initialMessages
  })

  // 載入初始語系
  await loadLocaleMessages(i18n, languageStore.currentLanguage)

  globalThis.$i18n = i18n

  app.use(i18n)

  // 監聽語系切換
  watch(
    () => languageStore.currentLanguage,
    async (newLanguage) => {
      await loadLocaleMessages(i18n, newLanguage)
    }
  )

  // 掛載全局 i18n functions
  globalThis.$t = (i18n.global as Composer).t
  globalThis.$te = (i18n.global as Composer).te
  globalThis.$d = (i18n.global as Composer).d
  globalThis.$n = (i18n.global as Composer).n
})
