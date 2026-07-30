import type { LocaleObject } from "@nuxtjs/i18n"

interface LanguageOptionItem {
  code: string
  name: string
  icon: string
}

const LANGUAGE_ICON_MAP: Record<string, string> = {
  "zh-cn": "zh-cn",
  "zh-tw": "zh-tw",
  ms: "my",
  tl: "sw"
}

const resolveLanguageIcon = (code: string) => {
  const normalized = normalizeLocaleCode(code)
  return LANGUAGE_ICON_MAP[normalized] || normalized
}

const parseSettingLanguage = (raw: string | undefined): string[] => {
  if (!raw) return []

  const trimmed = raw.trim()
  if (!trimmed) return []

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => {
            if (typeof item === "string") return item
            if (item && typeof item === "object" && "code" in item) return String((item as { code: string }).code)
            return ""
          })
          .filter(Boolean)
      }
    } catch {
      // ignore invalid JSON and fallback to comma split
    }
  }

  return trimmed
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

const normalizeLocaleCode = (code: string) => code.toLowerCase().replace("_", "-")

export const useLanguage = () => {
  const { locale } = useI18n()
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n as any

  const { setting, isLoading, refetch } = useSetting({
    selector: (s) => ({
      language: s.language,
      defaultLanguage: s.default_language
    })
  })

  const localeList = computed(() => {
    const value = i18n?.locales?.value ?? i18n?.locales ?? []
    return value as LocaleObject[]
  })

  const enabledCodes = computed(() => {
    const parsed = parseSettingLanguage(setting.value?.language)
    return new Set(parsed.map((item) => normalizeLocaleCode(item)))
  })

  const languageList = computed<LanguageOptionItem[]>(() => {
    const list = localeList.value.map((item) => ({
      code: String(item.code),
      name: (item.name as string) || String(item.code),
      icon: resolveLanguageIcon(String(item.code))
    }))

    if (!enabledCodes.value.size) return list
    return list.filter((item) => enabledCodes.value.has(normalizeLocaleCode(item.code)))
  })

  const currentLang = computed(() => {
    const current = normalizeLocaleCode(String(locale.value))
    return (
      languageList.value.find((item) => normalizeLocaleCode(item.code) === current) ?? languageList.value[0] ?? null
    )
  })

  const changeLanguage = async (code: string) => {
    if (!code || code === locale.value) return
    if (typeof i18n?.setLocale === "function") {
      await i18n.setLocale(code)
      return
    }
    locale.value = code as any
  }

  return {
    languageList,
    currentLang,
    currentLocale: locale,
    defaultLanguage: computed(() => setting.value?.defaultLanguage || ""),
    isLoading,
    refetch,
    changeLanguage
  }
}
