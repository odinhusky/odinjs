interface RuntimeEnvConfig {
  apiBase?: string
  agentCode?: string
  imageBase?: string
  staticResourceUrl?: string
  staticResourceProxyTarget?: string
  siteKey?: string
  appVersion?: string
  showMockData?: string | boolean
  themeFile?: string
}

declare global {
  interface Window {
    __ENV__?: RuntimeEnvConfig
  }
}

const RUNTIME_STRING_FIELDS = [
  "apiBase",
  "agentCode",
  "imageBase",
  "staticResourceUrl",
  "staticResourceProxyTarget",
  "siteKey",
  "appVersion"
] as const

const DEFAULT_THEME_FILE = "default.css"

const normalizeString = (value: unknown): string => {
  if (value === undefined || value === null) return ""
  return String(value).trim()
}

const normalizeThemeKey = (value: unknown): string =>
  normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")

const toThemeFile = (key: string): string => (key ? `${key}.css` : "")

const withVersion = (path: string, version: unknown): string => {
  const normalizedVersion = normalizeString(version)
  if (!normalizedVersion) return path
  return `${path}?v=${encodeURIComponent(normalizedVersion)}`
}

const loadRuntimeTheme = ({
  themeFile,
  fallbackFile,
  version
}: {
  themeFile: string
  fallbackFile: string
  version: unknown
}) => {
  if (!themeFile) return

  const link =
    document.querySelector<HTMLLinkElement>('link[data-runtime-theme="true"]') ?? document.createElement("link")

  link.rel = "stylesheet"
  link.setAttribute("data-runtime-theme", "true")
  link.onerror = () => {
    if (fallbackFile && fallbackFile !== themeFile) {
      link.onerror = null
      link.href = withVersion(`/themes/${fallbackFile}`, version)
    }
  }

  if (!link.parentNode) {
    document.head.appendChild(link)
  }

  link.href = withVersion(`/themes/${themeFile}`, version)
}

export default defineNuxtPlugin({
  name: "runtime-env",
  enforce: "pre",
  setup() {
    const env = (globalThis as { __ENV__?: RuntimeEnvConfig }).__ENV__
    if (!env) return

    const runtimeConfig = useRuntimeConfig()
    const publicConfig = runtimeConfig.public as Record<string, unknown>

    for (const key of RUNTIME_STRING_FIELDS) {
      const value = normalizeString(env[key])
      if (value) publicConfig[key] = value
    }

    if (env.showMockData !== undefined && env.showMockData !== null && env.showMockData !== "") {
      const showMockData = String(env.showMockData)
      publicConfig.showMockData = showMockData
      publicConfig.SHOW_MOCK_DATA = showMockData
    }

    const hasEnvAgentCode = Object.prototype.hasOwnProperty.call(env, "agentCode")
    const resolvedAgentCode = hasEnvAgentCode ? env.agentCode : publicConfig.agentCode

    const explicitThemeFile = normalizeString(env.themeFile)
    const agentThemeFile = toThemeFile(normalizeThemeKey(resolvedAgentCode))
    const fallbackThemeFile = DEFAULT_THEME_FILE
    const themeFile = explicitThemeFile || agentThemeFile || fallbackThemeFile

    loadRuntimeTheme({
      themeFile,
      fallbackFile: fallbackThemeFile,
      version: env.appVersion || publicConfig.appVersion
    })
  }
})
