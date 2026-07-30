import { boot } from "quasar/wrappers"
import { createI18n, Composer } from "vue-i18n"
import type { I18n } from "vue-i18n"
import { watch } from "vue"
import { useLanguageStore } from "src/stores/languageStore"
import { Enums } from "src/common/utils/constants/languageType"

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

const LOCALE_BASE_URL = import.meta.env.VITE_I18N_LOCALE_URL || "/locales/"

const LEGACY_LOCALE_MAP: Record<string, string> = {
  "zh-tw": "zh-TW",
  "zh-cn": "zh-CN",
  bm: "ms",
  br: "pt",
  jp: "ja",
  sp: "es"
}

// 初始語系架構，確保 availableLocales 完整
const initialMessages = Object.values(Enums).reduce((acc, lang) => {
  acc[lang] = {}
  return acc
}, {} as Record<string, any>)

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
 * TypeScript 相關定義
 */
export type MessageSchema = any

/* eslint-disable @typescript-eslint/no-empty-interface */
declare module "vue-i18n" {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat {}
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

/**
 * 清理並校正語系檔中的 Placeholder
 * 1. 智慧修復：比對英文對照組，如果 {} 數量一致，則按順序還原正確的變數名 (例如 {মিনিট} -> {min})
 * 2. 基本防護：若無法匹配，則將其改為 [ ] 格式，避免 vue-i18n 解析失敗導致 runtime error
 */
function sanitizeMessages(messages: Record<string, any>, locale: string, referenceMessages?: Record<string, any>) {
  const regex = /\{([^{}]+)\}/g
  const sanitized = { ...messages }
  let hasCorrection = false

  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      const bnMatch = sanitized[key].match(regex)
      const enVal = referenceMessages?.[key]
      const enMatch = typeof enVal === "string" ? enVal.match(regex) : null

      // --- 1. 智慧修復邏輯 ---
      if (bnMatch && enMatch && bnMatch.length === enMatch.length) {
        let repaired = sanitized[key]
        bnMatch.forEach((badToken: string, index: number) => {
          if (badToken !== enMatch[index]) {
            hasCorrection = true
            repaired = repaired.replace(badToken, enMatch[index])
          }
        })
        sanitized[key] = repaired
      }
      // --- 2. 基本防護邏輯 (防止非 ASCII 字符或空格導致崩潰) ---
      else {
        sanitized[key] = sanitized[key].replace(regex, (match: string, p1: string) => {
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
 * 動態載入語系的函數
 */
export async function loadLanguageAsync(locale: string): Promise<boolean> {
  const i18nInstance = globalThis.$i18n
  if (!i18nInstance) return false

  // 如果語系已經載入且不是英文(因為可能需要重新 sanitize),直接返回
  if (loadedLanguages.has(locale)) {
    return true
  }

  // 如果載入的是非英文語系，確保英文版已經載入(作為分析對比用)
  let enMessages: Record<string, any> | undefined
  if (locale !== "en") {
    await loadLanguageAsync("en")
    enMessages = i18nInstance.global.getLocaleMessage("en") as Record<string, any>
  }

  const currentRemoteVersion = await fetchRemoteVersion()
  const cacheKey = `i18n_cache_${locale}`
  const cached = localStorage.getItem(cacheKey)

  // 開發模式下不使用快取
  if (!process.env.DEV && cached && currentRemoteVersion) {
    try {
      const { version, messages: rawMessages } = JSON.parse(cached)
      if (version === currentRemoteVersion) {
        const messages = sanitizeMessages(rawMessages, locale, enMessages)
        i18nInstance.global.setLocaleMessage(locale, messages as Record<string, unknown>)
        loadedLanguages.add(locale)
        return true
      }
    } catch (e) {
      // 解析失敗不處理
    }
  }

  try {
    let fetchFilename = locale

    // 修復 legacy code 加載錯誤
    if (LEGACY_LOCALE_MAP[fetchFilename]) {
      fetchFilename = LEGACY_LOCALE_MAP[fetchFilename]
    }

    const versionParam = process.env.DEV ? new Date().getTime() : currentRemoteVersion || new Date().getTime()
    const response = await fetch(`${LOCALE_BASE_URL}${fetchFilename}.json?v=${versionParam}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const messages = sanitizeMessages(await response.json(), locale, enMessages)

    // 存入快取
    if (currentRemoteVersion) {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          version: currentRemoteVersion,
          messages
        })
      )
    }

    i18nInstance.global.setLocaleMessage(locale, messages)
    loadedLanguages.add(locale)
    return true
  } catch (error) {
    console.error(`無法載入語系檔 [${locale}]:`, error)
    // 嘗試載入英文作為後備
    if (locale !== "en") {
      return await loadLanguageAsync("en")
    }
    return false
  }
}

export let i18n: I18n<any, any, any, any, false>

export default boot(async ({ app }) => {
  const languageStore = useLanguageStore()
  const initialLang = languageStore.lang || "en"

  const i18nInstance = createI18n({
    locale: initialLang,
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

  i18n = i18nInstance
  globalThis.$i18n = i18n

  // 初始載入語系
  await loadLanguageAsync(initialLang)

  app.use(i18n)

  // 監聽語系切換
  watch(
    () => languageStore.lang,
    async (newLanguage) => {
      if (newLanguage) {
        await loadLanguageAsync(newLanguage)
        i18nInstance.global.locale.value = newLanguage
      }
    }
  )

  // 掛載全局 i18n functions
  globalThis.$t = (i18n.global as Composer).t
  globalThis.$te = (i18n.global as Composer).te
  globalThis.$d = (i18n.global as Composer).d
  globalThis.$n = (i18n.global as Composer).n
})
