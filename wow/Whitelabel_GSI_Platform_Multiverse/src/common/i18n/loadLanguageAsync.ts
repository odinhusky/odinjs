/**
 * 與 Quasar boot 分離：供 composable 等靜態引用，避免把整份 `boot/i18n` 拉回主 chunk，
 * 讓 client-entry 對 i18n boot 的 dynamic import 能獨立成 chunk。
 *
 * 注意：勿放在 `src/i18n/`（該目錄於 .gitignore，保留給本機／遺留語系 bundle）。
 */
const loadedLanguages = new Set<string>()
let remoteI18nVersion: string | null = null

const LOCALE_BASE_URL = import.meta.env.VITE_I18N_LOCALE_URL || "/locales/"

/** 舊站／錯誤路徑用的語系碼對應（例如 zh-tw → zh-TW） */
const LEGACY_LOCALE_MAP: Record<string, string> = {
  "zh-tw": "zh-TW",
  "zh-cn": "zh-CN",
  bm: "ms",
  br: "pt",
  jp: "ja",
  sp: "es"
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
  } catch {
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
          // eslint-disable-next-line no-control-regex -- 與原 i18n boot 一致：偵測非 ASCII placeholder
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
    } catch {
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
