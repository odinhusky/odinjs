import { nextTick, ref } from "vue"
import { beforeEach, describe, expect, it, vi } from "vitest"

const queryClientState = vi.hoisted(() => ({
  fetchQuery: vi.fn()
}))

vi.mock("@tanstack/vue-query", () => ({
  useQueryClient: () => queryClientState
}))

describe("useRemoteLocaleMessages", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
    queryClientState.fetchQuery.mockReset()
  })

  it("loads remote locale messages only after start is called", async () => {
    const currentLocale = ref("zh-TW")
    const setLocaleMessage = vi.fn()

    vi.stubGlobal("useRuntimeConfig", () => ({
      public: {
        localeRemoteBase: "https://locale.templates.gsiwl.com/locale/frontend"
      }
    }))
    vi.stubGlobal("useNuxtApp", () => ({
      $i18n: {
        locale: currentLocale,
        getLocaleMessage: () => ({
          common: {
            search: "搜尋"
          }
        }),
        setLocaleMessage
      }
    }))
    queryClientState.fetchQuery.mockResolvedValue({
      common: {
        search: "查詢"
      }
    })

    const { useRemoteLocaleMessages } = await import("./useRemoteLocaleMessages")
    const { start } = useRemoteLocaleMessages()
    await nextTick()

    expect(queryClientState.fetchQuery).not.toHaveBeenCalled()

    start()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(queryClientState.fetchQuery).toHaveBeenCalledTimes(1)
    expect(setLocaleMessage).toHaveBeenCalledWith("zh-TW", {
      common: {
        search: "查詢"
      }
    })
  })
})
