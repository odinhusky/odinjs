export type LocaleMessages = Record<string, unknown>

interface LoadRemoteLocaleMessagesOptions {
  localeCode: string
  localeRemoteBase: string
  fetchRemoteMessages: (url: string, remoteLocale: string) => Promise<LocaleMessages>
  getCurrentLocale: () => string
  getLocalMessages: (localeCode: string) => LocaleMessages
  setLocaleMessages: (localeCode: string, messages: LocaleMessages) => void
}

const REMOTE_LOCALE_CODES = new Set([
  "en",
  "zh-TW",
  "zh-CN",
  "ms",
  "pt",
  "ja",
  "es",
  "ar",
  "bn",
  "hi",
  "id",
  "ko",
  "my",
  "th",
  "vi",
  "tl"
])

const REMOTE_LOCALE_MAP: Record<string, string> = {
  jp: "ja"
}

export const mapRemoteLocale = (localeCode: string) => {
  const mapped = REMOTE_LOCALE_MAP[localeCode] ?? localeCode
  return REMOTE_LOCALE_CODES.has(mapped) ? mapped : null
}

export const normalizeLocaleRemoteBase = (baseUrl: string) => baseUrl.trim().replace(/\/+$/, "")

export const buildRemoteLocaleUrl = (baseUrl: string, localeCode: string) => {
  const normalizedBase = normalizeLocaleRemoteBase(baseUrl)
  if (!normalizedBase) return null

  const remoteLocale = mapRemoteLocale(localeCode)
  if (!remoteLocale) return null

  return `${normalizedBase}/${remoteLocale}.json`
}

export const isPlainLocaleMessages = (value: unknown): value is LocaleMessages => {
  if (!value || typeof value !== "object") return false
  return !Array.isArray(value)
}

export const mergeLocaleMessages = (localMessages: LocaleMessages, remoteMessages: LocaleMessages): LocaleMessages => {
  const merged: LocaleMessages = { ...localMessages }

  Object.entries(remoteMessages).forEach(([key, remoteValue]) => {
    const localValue = localMessages[key]
    if (isPlainLocaleMessages(localValue) && isPlainLocaleMessages(remoteValue)) {
      merged[key] = mergeLocaleMessages(localValue, remoteValue)
      return
    }

    merged[key] = remoteValue
  })

  return merged
}

export const loadRemoteLocaleMessages = async ({
  localeCode,
  localeRemoteBase,
  fetchRemoteMessages,
  getCurrentLocale,
  getLocalMessages,
  setLocaleMessages
}: LoadRemoteLocaleMessagesOptions) => {
  const remoteLocale = mapRemoteLocale(localeCode)
  if (!remoteLocale) return false

  const url = buildRemoteLocaleUrl(localeRemoteBase, localeCode)
  if (!url) return false

  const remoteMessages = await fetchRemoteMessages(url, remoteLocale)
  if (getCurrentLocale() !== localeCode) return false

  setLocaleMessages(localeCode, mergeLocaleMessages(getLocalMessages(localeCode), remoteMessages))
  return true
}
