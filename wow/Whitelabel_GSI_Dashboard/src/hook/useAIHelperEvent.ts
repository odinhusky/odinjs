import { watchEffect, onMounted, onBeforeUnmount, reactive, watch } from "vue"
import { storeToRefs } from "pinia"
import { useSiteStore } from "src/stores/siteStore"
import { useAIHelperStore } from "src/stores/aiHelperStore"
import { injectStrict } from "src/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { AI_HELPER_EVENT, AI_HELPER_EVENT_ROUTES, AI_HELPER_STATUS } from "src/utils/constants"
import type * as Response from "src/api/response.type"

interface IMessage {
  type: "event"
  data: Response.AIHelperEvent
}

type AIHelperEventRoute = () => void

export function useAIHelperEvent(options?: { maxRetry?: number; retryDelay?: number }) {
  const siteStore = useSiteStore()
  const eventbus = injectStrict(EventBusKey)
  const aiHelperStore = useAIHelperStore()
  const {
    iframeOrigin,
    iframeUrl,
    isAIHelperShow,
    isAIHelperIframeShow,
    isAIHelperReady,
    aiHelperNoGreetingsYet,
    aiHelperIframeRef,
    aiHelperEventRouteIndex,
    isAIHelperNewMessage,
    isAIHelperPromotionDetail
  } = storeToRefs(aiHelperStore)

  const maxRetry = options?.maxRetry ?? 10
  const retryDelay = options?.retryDelay ?? 1000
  const retryMap = reactive<Record<string, number>>({})

  const aiHelperEventRoutes: Record<AI_HELPER_EVENT_ROUTES.Enums, AIHelperEventRoute[]> = {
    [AI_HELPER_EVENT_ROUTES.Enums.MEMBER_MANAGEMENT]: [
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.MEMBER_MANAGE })
    ],
    [AI_HELPER_EVENT_ROUTES.Enums.GIFT_DDETAILS_LIST]: [
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.GIFT_DETAIL })
    ],
    [AI_HELPER_EVENT_ROUTES.Enums.PRODUCT_MANAGE]: [
      () => postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.PRODUCT_MANAGE })
    ]
  }

  function postAIHelperIframeEvent(data: Response.AIHelperEvent) {
    const eventKey = data.event
    if (!eventKey) {
      console.warn("[AIHelper] Invalid event name.")
      return
    }

    const tryPost = () => {
      if (!isAIHelperReady.value) {
        const currentRetry = retryMap[eventKey] ?? 0
        if (currentRetry < maxRetry) {
          retryMap[eventKey] = currentRetry + 1
          setTimeout(tryPost, retryDelay)
        } else {
          console.warn(`[AIHelper] Max retry reached for event: ${eventKey}`)
        }
        return
      }

      if (
        isAIHelperShow.value &&
        aiHelperIframeRef.value &&
        aiHelperIframeRef.value.contentWindow &&
        iframeOrigin.value &&
        data.event
      ) {
        if (!isAIHelperIframeShow.value) {
          const storage = localStorage?.getItem("bo_ai_helper_iframe_status")
          if (storage) {
            isAIHelperIframeShow.value = storage === "true"
          } else {
            isAIHelperIframeShow.value = true
          }
        }

        const message: IMessage = {
          type: "event",
          data
        }

        try {
          aiHelperIframeRef.value.contentWindow.postMessage(message, iframeOrigin.value)

          retryMap[eventKey] = 0

          if (data.event === AI_HELPER_EVENT.Enums.GREETING) {
            aiHelperNoGreetingsYet.value = false
          }
        } catch (err) {
          console.error("[AIHelper] Failed to post message:", err)
        }
      }
    }

    retryMap[eventKey] = 0
    tryPost()
  }

  function closeAIHelper() {
    isAIHelperShow.value = false
    isAIHelperIframeShow.value = false
  }

  function handleAIHelperRouteEvent(routeKey: AI_HELPER_EVENT_ROUTES.Enums) {
    const events = aiHelperEventRoutes[routeKey]
    if (!events?.length) return

    const index = aiHelperEventRouteIndex.value.get(routeKey) ?? 0

    try {
      events[index]()
    } catch (err) {
      console.error(`執行 ${routeKey} 的事件失敗`, err)
    }

    const nextIndex = (index + 1) % events.length
    aiHelperEventRouteIndex.value.set(routeKey, nextIndex)
  }

  function handleAIHelperIframeMessage(event: MessageEvent) {
    if (!iframeOrigin.value || event.origin !== iframeOrigin.value) return

    const data = event.data

    if (data?.status === AI_HELPER_STATUS.Enums.CONNECTED && data?.type === AI_HELPER_EVENT.Enums.ASSISTANT_READY) {
      isAIHelperReady.value = true
    }

    if (
      data?.type === AI_HELPER_EVENT.Enums.GIFT_QUOTA_DETAIL_SINGLE ||
      data?.type === AI_HELPER_EVENT.Enums.GIFT_QUOTA_DETAIL_BATCH
    ) {
      eventbus.emit("handleAIAddGiftDetail", data.payload)
    }

    if (data?.type === AI_HELPER_EVENT.Enums.PROMOTION_QUOTA_DETAIL) {
      isAIHelperPromotionDetail.value = true
      eventbus.emit("handleAIAddPromotionDetail", data.payload)
    }

    // 判斷有新訊息時，要顯示紅點
    if (data?.type === AI_HELPER_EVENT.Enums.NEW_MESSAGE) {
      isAIHelperNewMessage.value = true
    }
  }

  // API開關 + 登入才顯示
  watchEffect(async () => {
    if (siteStore.bo_ai_helper) {
      isAIHelperShow.value = true
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch {}
      return
    }

    closeAIHelper()
  })

  watchEffect(() => {
    if (isAIHelperShow.value && aiHelperNoGreetingsYet.value && isAIHelperReady.value) {
      const data: Response.AIHelperEvent = {
        event: AI_HELPER_EVENT.Enums.GREETING
      }

      postAIHelperIframeEvent(data)
    }
  })

  watch(isAIHelperIframeShow, (newVal: boolean) => {
    localStorage.setItem("bo_ai_helper_iframe_status", newVal.toString())
    isAIHelperNewMessage.value = false
  })

  onMounted(() => {
    window.addEventListener("message", handleAIHelperIframeMessage)

    eventbus.on("handleAIHelperEvent", async (data) => {
      if (data) {
        postAIHelperIframeEvent(data)
      }
    })
  })

  onBeforeUnmount(() => {
    window.removeEventListener("message", handleAIHelperIframeMessage)
  })

  return {
    /** iframe 網域 */
    iframeOrigin,

    /** iframe url */
    iframeUrl,

    /** 是否顯示 AI 銷售助手 */
    isAIHelperShow,

    /** 是否顯示 AI 銷售助手 iframe  */
    isAIHelperIframeShow,

    /** 銷售助手是否連線完成 */
    isAIHelperReady,

    /** iframe vue ref */
    aiHelperIframeRef,

    /** 是否有新訊息 */
    isAIHelperNewMessage,

    /** 尚未問候 */
    aiHelperNoGreetingsYet,

    /** 發射 event 給 iframe */
    postAIHelperIframeEvent,

    /** 關閉 AI 銷售助手 */
    closeAIHelper,

    /** 各頁面需要觸發的 AI 銷售助手事件 */
    handleAIHelperRouteEvent
  }
}
