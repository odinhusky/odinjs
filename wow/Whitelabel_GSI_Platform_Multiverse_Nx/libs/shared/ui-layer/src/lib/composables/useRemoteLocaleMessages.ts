import { useQueryClient } from "@tanstack/vue-query"
import { watch } from "vue"
import {
  isPlainLocaleMessages,
  loadRemoteLocaleMessages,
  mapRemoteLocale,
  type LocaleMessages
} from "../utils/remoteLocale"

interface RemoteLocaleI18n {
  locale?: string | { value?: string }
  getLocaleMessage?: (localeCode: string) => unknown
  setLocaleMessage?: (localeCode: string, messages: LocaleMessages) => void
}

interface RemoteLocaleNuxtApp {
  $i18n?: RemoteLocaleI18n
}

const REMOTE_LOCALE_STALE_TIME = 5 * 60 * 1000
const REMOTE_LOCALE_GC_TIME = 30 * 60 * 1000

const localMessagesByLocale = new Map<string, LocaleMessages>()
let isRemoteLocaleWatcherStarted = false

const warnRemoteLocale = (message: string, error?: unknown) => {
  if (!import.meta.dev) return
  console.warn(`[remote-locale] ${message}`, error)
}

const fetchRemoteLocaleMessages = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const json = (await response.json()) as unknown
  if (!isPlainLocaleMessages(json)) {
    throw new Error("Remote locale response must be a plain object")
  }

  return json
}

const noop = () => undefined

export const useRemoteLocaleMessages = () => {
  if (import.meta.server) return { start: noop }

  const runtimeConfig = useRuntimeConfig()
  const localeRemoteBase = String(runtimeConfig.public.localeRemoteBase || "")
  if (!localeRemoteBase.trim()) return { start: noop }

  const nuxtApp = useNuxtApp() as unknown as RemoteLocaleNuxtApp
  const i18n = nuxtApp.$i18n
  const queryClient = useQueryClient()
  if (!i18n || !queryClient || typeof i18n.setLocaleMessage !== "function") return { start: noop }

  const getLocaleValue = () => String((typeof i18n.locale === "object" ? i18n.locale?.value : i18n.locale) ?? "")

  const getLocalMessages = (localeCode: string) => {
    const cached = localMessagesByLocale.get(localeCode)
    if (cached) return cached

    const messages = typeof i18n.getLocaleMessage === "function" ? i18n.getLocaleMessage(localeCode) : {}
    const localMessages = isPlainLocaleMessages(messages) ? messages : {}
    localMessagesByLocale.set(localeCode, localMessages)
    return localMessages
  }

  const applyRemoteLocale = async (localeCode: string) => {
    const remoteLocale = mapRemoteLocale(localeCode)
    if (!remoteLocale) return

    try {
      await loadRemoteLocaleMessages({
        localeCode,
        localeRemoteBase,
        fetchRemoteMessages: (url) =>
          queryClient.fetchQuery({
            queryKey: ["remote-locale", remoteLocale],
            queryFn: () => fetchRemoteLocaleMessages(url),
            staleTime: REMOTE_LOCALE_STALE_TIME,
            gcTime: REMOTE_LOCALE_GC_TIME,
            retry: false
          }),
        getCurrentLocale: getLocaleValue,
        getLocalMessages,
        setLocaleMessages: (targetLocale, messages) => i18n.setLocaleMessage?.(targetLocale, messages)
      })
    } catch (error) {
      warnRemoteLocale(`Fallback to local messages for "${localeCode}"`, error)
    }
  }

  const start = () => {
    if (isRemoteLocaleWatcherStarted) return
    isRemoteLocaleWatcherStarted = true

    watch(
      () => getLocaleValue(),
      (localeCode) => {
        if (!localeCode) return
        void applyRemoteLocale(localeCode)
      },
      { immediate: true }
    )
  }

  return {
    start
  }
}
