import { describe, expect, it, vi } from "vitest"
import {
  buildRemoteLocaleUrl,
  isPlainLocaleMessages,
  loadRemoteLocaleMessages,
  mapRemoteLocale,
  mergeLocaleMessages,
  normalizeLocaleRemoteBase
} from "./remoteLocale"

describe("remote locale utils", () => {
  it("maps supported Nuxt locale codes to remote locale codes", () => {
    expect(mapRemoteLocale("zh-TW")).toBe("zh-TW")
    expect(mapRemoteLocale("zh-CN")).toBe("zh-CN")
    expect(mapRemoteLocale("en")).toBe("en")
    expect(mapRemoteLocale("jp")).toBe("ja")
    expect(mapRemoteLocale("fr")).toBeNull()
    expect(mapRemoteLocale("sw")).toBeNull()
    expect(mapRemoteLocale("unknown")).toBeNull()
  })

  it("normalizes remote locale base URLs without mutating empty values", () => {
    expect(normalizeLocaleRemoteBase("")).toBe("")
    expect(normalizeLocaleRemoteBase("   ")).toBe("")
    expect(normalizeLocaleRemoteBase("https://locale.templates.gsiwl.com/locale/frontend/")).toBe(
      "https://locale.templates.gsiwl.com/locale/frontend"
    )
  })

  it("builds remote locale URLs only for supported locales", () => {
    const base = "https://locale.templates.gsiwl.com/locale/frontend/"

    expect(buildRemoteLocaleUrl(base, "zh-TW")).toBe("https://locale.templates.gsiwl.com/locale/frontend/zh-TW.json")
    expect(buildRemoteLocaleUrl(base, "jp")).toBe("https://locale.templates.gsiwl.com/locale/frontend/ja.json")
    expect(buildRemoteLocaleUrl(base, "fr")).toBeNull()
    expect(buildRemoteLocaleUrl("", "zh-TW")).toBeNull()
  })

  it("detects plain locale message objects", () => {
    expect(isPlainLocaleMessages({ common: { search: "Search" } })).toBe(true)
    expect(isPlainLocaleMessages({ common: "Search" })).toBe(true)
    expect(isPlainLocaleMessages(null)).toBe(false)
    expect(isPlainLocaleMessages([])).toBe(false)
    expect(isPlainLocaleMessages("Search")).toBe(false)
  })

  it("deep merges locale messages with remote values taking priority", () => {
    const local = {
      common: {
        search: "搜尋",
        cancel: "取消"
      },
      menu: {
        home: "首頁"
      }
    }

    const remote = {
      common: {
        search: "查詢"
      }
    }

    expect(mergeLocaleMessages(local, remote)).toEqual({
      common: {
        search: "查詢",
        cancel: "取消"
      },
      menu: {
        home: "首頁"
      }
    })
  })

  it("loads remote messages and writes merged messages into the active locale", async () => {
    const setLocaleMessages = vi.fn()

    const result = await loadRemoteLocaleMessages({
      localeCode: "zh-TW",
      localeRemoteBase: "https://locale.templates.gsiwl.com/locale/frontend",
      fetchRemoteMessages: async () => ({
        common: {
          search: "查詢"
        }
      }),
      getCurrentLocale: () => "zh-TW",
      getLocalMessages: () => ({
        common: {
          search: "搜尋",
          cancel: "取消"
        }
      }),
      setLocaleMessages
    })

    expect(result).toBe(true)
    expect(setLocaleMessages).toHaveBeenCalledWith("zh-TW", {
      common: {
        search: "查詢",
        cancel: "取消"
      }
    })
  })

  it("does not write remote messages when the active locale changed while loading", async () => {
    const setLocaleMessages = vi.fn()

    const result = await loadRemoteLocaleMessages({
      localeCode: "zh-TW",
      localeRemoteBase: "https://locale.templates.gsiwl.com/locale/frontend",
      fetchRemoteMessages: async () => ({ common: { search: "查詢" } }),
      getCurrentLocale: () => "en",
      getLocalMessages: () => ({ common: { search: "搜尋" } }),
      setLocaleMessages
    })

    expect(result).toBe(false)
    expect(setLocaleMessages).not.toHaveBeenCalled()
  })
})
