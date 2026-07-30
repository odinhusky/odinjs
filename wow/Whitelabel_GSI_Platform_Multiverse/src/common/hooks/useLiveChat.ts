import ejs from "ejs"
import { computed, nextTick, onBeforeUnmount, ref, watchEffect, toRef } from "vue"
import { storeToRefs } from "pinia"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { CUSTOMER_SERVICES } from "src/common/utils/constants"
import { liveChatConfigsStore, ServiceKey } from "src/stores/liveChatConfigsStore"

export interface InjectHtml {
  name?: string
  email?: string
}

/**
 * Tawk embed 為單一全域 script；狀態必須跨所有 useLiveChat() 實例共享，
 * 否則僅解構 handleOpenLiveChat 的元件會與 LiveChat/Index 的實例狀態脫節（不載入、無反饋）。
 */
const tawkEmbedLoaded = ref(false)
const tawkEmbedLoading = ref(false)
const tawkShouldOpenAfterEmbedLoad = ref(false)

function getOrCreateTawkApi(): NonNullable<Window["Tawk_API"]> {
  if (!window.Tawk_API) window.Tawk_API = {}
  return window.Tawk_API
}

/**
 * 在 Tawk 就緒後展開對話視窗。
 * 注意：開窗要用 `maximize()`，`start()` 只負責啟動 widget、不會展開對話框；
 * 且必須等 Tawk 自身的 `onLoad` 生命週期觸發後 API 才就緒，
 * 在 script.onload（檔案下載完）當下呼叫往往過早。
 */
function bindTawkOnLoadOpen() {
  const api = getOrCreateTawkApi()
  const prevOnLoad = api.onLoad
  api.onLoad = function () {
    if (typeof prevOnLoad === "function") prevOnLoad()
    if (!tawkShouldOpenAfterEmbedLoad.value) return
    tawkShouldOpenAfterEmbedLoad.value = false
    const readyApi = getOrCreateTawkApi()
    readyApi.showWidget?.()
    readyApi.maximize?.()
  }
}

function openTawkWidget() {
  const api = getOrCreateTawkApi()
  // 已就緒：直接展開對話視窗
  if (typeof api.maximize === "function") {
    tawkShouldOpenAfterEmbedLoad.value = false
    api.showWidget?.()
    api.maximize()
    return
  }
  // 尚未就緒：等 Tawk onLoad 後再展開
  bindTawkOnLoadOpen()
}

function syncTawkEmbedLoadedFromDom() {
  if (tawkEmbedLoaded.value) return
  if (document.querySelector('script[src*="embed.tawk.to/"]')) {
    tawkEmbedLoaded.value = true
    tawkEmbedLoading.value = false
  }
}

function ensureTawkEmbed(appId: string, compId: string, requestOpenWidget: boolean) {
  syncTawkEmbedLoadedFromDom()

  if (!appId || !compId) {
    console.warn("[useLiveChat] Tawk 缺少 appID 或 compID，無法載入或開啟")
    return
  }

  if (requestOpenWidget) tawkShouldOpenAfterEmbedLoad.value = true

  if (tawkEmbedLoaded.value) {
    if (requestOpenWidget) openTawkWidget()
    return
  }

  // 載入中：確保 onLoad 會在就緒後展開對話視窗
  if (tawkEmbedLoading.value) {
    if (requestOpenWidget) bindTawkOnLoadOpen()
    return
  }

  try {
    tawkEmbedLoading.value = true
    getOrCreateTawkApi()
    // 在 embed 執行前先綁定 onLoad，避免在 Tawk API 尚未就緒時就嘗試開窗
    if (requestOpenWidget) bindTawkOnLoadOpen()

    const script = document.createElement("script")
    script.type = "text/javascript"
    script.async = true
    script.src = `https://embed.tawk.to/${appId}/${compId}`
    script.charset = "UTF-8"
    script.setAttribute("crossorigin", "*")
    script.onload = () => {
      tawkEmbedLoaded.value = true
      tawkEmbedLoading.value = false
      // 對話視窗的展開交由 Tawk_API.onLoad 生命週期處理（見 bindTawkOnLoadOpen）
    }
    script.onerror = () => {
      tawkEmbedLoading.value = false
      tawkShouldOpenAfterEmbedLoad.value = false
      console.warn("[useLiveChat] Tawk embed script 載入失敗")
    }
    document.body.appendChild(script)
  } catch (error) {
    tawkEmbedLoading.value = false
    tawkShouldOpenAfterEmbedLoad.value = false
    console.error(error)
  }
}

export function useLiveChat(lineLink?: string, isRWDEnabled = false) {
  const { isDown } = useMediaQuery()
  const isMobile = toRef(isDown, "phone")

  const liveChatStore = liveChatConfigsStore()
  const { configs, enableConfigs } = storeToRefs(liveChatStore)

  const htmlContent = ref<string>("")
  const htmlContainer = ref<HTMLElement | null>(null)

  const enableConfig = computed(() => {
    if (!enableConfigs.value.length) return null

    return enableConfigs.value[0]
  })

  const handleCmsLiveChatClick = (type: CUSTOMER_SERVICES.Enums) => {
    const key = CUSTOMER_SERVICES.StringKeys[type] as ServiceKey
    const config = configs.value[key]
    if (!config.enable) return

    openLiveChatPopup(config)
  }

  const handleOpenLiveChat = () => {
    openLiveChatPopup()
  }

  const openLiveChatPopup = (config = enableConfig.value) => {
    if (!config || !config.enable) return
    if (config) {
      switch (config.type) {
        case CUSTOMER_SERVICES.Enums.Unus: {
          const width = "350",
            height = "600"
          const { appID: appId, compID: compId } = config
          if (!appId || !compId) return

          // const popupUnus = window.open(
          window.open(
            `https://bundlejs01.unuschat.com/livechatWindow.aspx?code=${appId}&campid=${compId}`,
            "Unus Live Chat",
            `width=${width},height=${height},location=0,menubar=0,resizable=0,scrollbars=0,status=0,toolbar=0`
          )
          break
        }

        case CUSTOMER_SERVICES.Enums.TextLiveChat: {
          // 要預先加載text live chat
          window.LiveChatWidget?.call("maximize")
          break
        }

        case CUSTOMER_SERVICES.Enums.Tawk: {
          const { appID = "", compID = "" } = config as { appID?: string; compID?: string }
          ensureTawkEmbed(appID, compID, true)
          break
        }

        default:
          break
      }
    }
  }

  const handleOpenLineLink = () => {
    if (lineLink) {
      window.open(lineLink, "_blank")
    }
  }

  const showLivechat = () => {
    console.log("show livechat")
    if (!enableConfig.value) return
    switch (enableConfig.value.type) {
      case CUSTOMER_SERVICES.Enums.Unus:
        document
          .getElementById(`chat-container-${enableConfig.value.appID}`)
          ?.style.setProperty("display", "block", "important")
        break
    }
  }

  const hideLivechat = () => {
    console.log("hide livechat")
    if (!enableConfig.value) return
    switch (enableConfig.value.type) {
      case CUSTOMER_SERVICES.Enums.Unus:
        document
          .getElementById(`chat-container-${enableConfig.value.appID}`)
          ?.style.setProperty("display", "none", "important")
        break
    }
  }

  const injectHtml = async (item?: InjectHtml, forceLoad = false) => {
    if (!enableConfig.value) return

    switch (enableConfig.value.type) {
      case CUSTOMER_SERVICES.Enums.Unus:
        // 預設unus手機板不加載
        if (isMobile.value) return
        if (!enableConfig.value.filePath) {
          console.warn(`file url: ${enableConfig.value.filePath} is not found, please check the file url.`)
          return
        }

        try {
          const response = await fetch(enableConfig.value.filePath)
          if (response.ok) {
            const ejsTemplate = await response.text()
            htmlContent.value = ejs.render(ejsTemplate, {
              codeChat: enableConfig.value.appID || "",
              codeCamp: enableConfig.value.compID || ""
            })

            if (htmlContainer.value) {
              // 等DOM更新後執行script
              await nextTick()

              const scripts = htmlContainer.value.querySelectorAll("script")
              scripts.forEach((script) => {
                const newScript = document.createElement("script")
                newScript.textContent = script.textContent

                document.body.appendChild(newScript).parentNode?.removeChild(newScript)
              })
            }
          } else {
            console.error("Failed to load EJS file")
          }
        } catch (error) {
          console.error("Error loading EJS file:", error)
        }
        break
      case CUSTOMER_SERVICES.Enums.TextLiveChat:
        if (!enableConfig.value.filePath) {
          console.warn(`file url: ${enableConfig.value.filePath} is not found, please check the file url.`)
          return
        }

        try {
          const response = await fetch(enableConfig.value.filePath)
          if (response.ok) {
            const ejsTemplate = await response.text()
            htmlContent.value = ejs.render(ejsTemplate, {
              appID: enableConfig.value.appID || ""
            })

            if (htmlContainer.value) {
              // 等DOM更新後執行script
              await nextTick()

              const scripts = htmlContainer.value.querySelectorAll("script")
              scripts.forEach((script) => {
                const newScript = document.createElement("script")
                newScript.textContent = script.textContent

                document.body.appendChild(newScript).parentNode?.removeChild(newScript)
              })
              await nextTick()
              if (item && window.LiveChatWidget) {
                if (item.name) {
                  window.LiveChatWidget.call("set_customer_name", item.name)
                }
                if (item.email) {
                  window.LiveChatWidget.call("set_customer_email", item.email)
                }
              }
            }
          } else {
            console.error("Failed to load EJS file")
          }
        } catch (error) {
          console.error("Error loading EJS file:", error)
        }
        break
      case CUSTOMER_SERVICES.Enums.Tawk:
        if (!forceLoad || tawkEmbedLoaded.value || tawkEmbedLoading.value) return
        ensureTawkEmbed(
          enableConfig.value.appID || "",
          (enableConfig.value as { compID?: string }).compID || "",
          false
        )
        break

      default:
        break
    }
  }

  /**
   * 因 inject html 後需要時間生成 DOM
   * 這裡寫個監聽 body 裡的 element
   * 並使用 setTimeout 做個延遲執行
   */
  let observer: MutationObserver | null = null
  const observeBodyChanges = () => {
    observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const insertedElement = node as HTMLElement
              const appId = enableConfig.value?.appID
              if (insertedElement.id === `chat-container-${appId}`) {
                setTimeout(() => {
                  insertedElement.style.setProperty("display", "block", "important")
                  // 如果啟用 RWD 且是手機版，則隱藏
                  updateLiveChatVisibility()
                }, 3000)
              }
            }
          }
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
  }

  /**
   * 隱藏 LiveChat widget
   */
  const hideLiveChat = () => {
    const appId = enableConfig.value?.appID
    const selectors = [
      `#chat-container-${appId}` // Unus
      // ".widget-visible", // Tawk
      // "#chat-widget-container", // LiveChatInc
      // "[id^='livechat-compact-container']", // LiveChatInc alternative
      // ".lc-container" // LiveChatInc alternative
    ]

    selectors.forEach((selector) => {
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        element.style.setProperty("z-index", "-1", "important")
        element.style.setProperty("visibility", "hidden", "important")
        element.style.setProperty("pointer-events", "none", "important")
      }
    })
  }

  /**
   * 顯示 LiveChat widget
   */
  const showLiveChat = () => {
    const appId = enableConfig.value?.appID
    const selectors = [
      `#chat-container-${appId}` // Unus
      // ".widget-visible", // Tawk
      // "#chat-widget-container", // LiveChatInc
      // "[id^='livechat-compact-container']", // LiveChatInc alternative
      // ".lc-container" // LiveChatInc alternative
    ]

    selectors.forEach((selector) => {
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        element.style.setProperty("z-index", "999", "important")
        element.style.setProperty("visibility", "visible", "important")
        element.style.setProperty("pointer-events", "auto", "important")
      }
    })
  }

  /**
   * 根據 RWD 設定和裝置類型更新 LiveChat 顯示狀態
   */
  const updateLiveChatVisibility = () => {
    if (!isRWDEnabled) {
      // 如果未啟用 RWD，永遠顯示
      showLiveChat()
      return
    }

    // 啟用 RWD 時，根據裝置類型決定
    if (isMobile.value) {
      hideLiveChat()
    } else {
      showLiveChat()
    }
  }

  const unmountObserve = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  watchEffect(() => {
    if (htmlContainer.value) {
      observeBodyChanges()
    }
  })

  // 監聽 isMobile 變化，動態更新 LiveChat 顯示狀態
  watchEffect(() => {
    if (isRWDEnabled && isMobile.value !== undefined) {
      updateLiveChatVisibility()
    }
  })

  onBeforeUnmount(() => {
    unmountObserve()
  })

  return {
    /** 開啟客服連結 */
    handleOpenLiveChat,

    /** 開啟指定網址 */
    handleOpenLineLink,

    /** cms type 6 */
    handleCmsLiveChatClick,

    /** 啟用的第一筆客服連結 */
    enableConfig,

    /** html內容 */
    htmlContent,

    /** html ref */
    htmlContainer,

    /** 注入html檔案 */
    injectHtml,

    /** Tawk embed 是否已載入（全域共享，所有 useLiveChat 實例一致） */
    isTawkScriptLoaded: tawkEmbedLoaded,

    /** Tawk embed 是否載入中（可綁定按鈕 :loading） */
    isTawkScriptLoading: tawkEmbedLoading,

    /** 隱藏 LiveChat */
    // hideLiveChat,

    /** 顯示 LiveChat */
    // showLiveChat,

    /** 更新 LiveChat 顯示狀態 */
    // updateLiveChatVisibility

    /** 顯示livechat */
    showLivechat,

    /** 隱藏livechat */
    hideLivechat
  }
}
