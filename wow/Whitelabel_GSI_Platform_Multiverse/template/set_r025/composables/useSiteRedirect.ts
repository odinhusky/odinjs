import { useAuth } from "src/common/hooks/useAuth"
import { CMS_OPENING_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { Events } from "src/boot/eventbus/types"
import type * as Request from "src/api/request.type"
import { useRouter } from "vue-router"
import { MENU } from "../utils/constants"

const normalizeDid = (did: string) => {
  return did.replace(/-/g, "_").replace(/[A-Z]/g, "_$&").toLowerCase()
}

export function useSiteRedirect() {
  const eventbus = injectStrict(EventBusKey)
  const router = useRouter()
  const { isLogin } = useAuth()

  const handleEventShow = (item: Request.RedirectPayload, eventName: keyof Events) => {
    router.replace({ query: item.query })
    setTimeout(() => {
      eventbus.emit(eventName, true)
    }, 0)
  }

  const handleSiteRedirect = (item: Request.RedirectPayload) => {
    const normalizedDid = normalizeDid(item.did)
    const routerName = MENU.RouterNameMapping[item.did] || MENU.RouterNameMapping[normalizedDid]

    switch (normalizedDid) {
      case "basic_information":
      case "withdrawal_setting":
      case "change_password":
      case "site_message":
      case "vip":
      case "history":
      case "deposit":
      case "withdrawal":
      case "processing_order":
      case "kyc":
      case "affiliate_detail":
      case "strategy_detail":
      case "member_strategy":
      case "referral_rebate":
      case "ai_agent":
      case "member_level":
      case "agent_collaboration_strategy":
        if (!isLogin.value) {
          handleEventShow(item, "openLogin")
          return
        }
        break
      case "register":
        if (!isLogin.value) {
          handleEventShow(item, "openRegister")
          return
        }
        break
      case "forget_password":
        // 忘記密碼彈窗只在未登入狀態下顯示
        if (!isLogin.value) {
          handleEventShow(item, "openForgotPassword")
          return
        }
        break
      case "fb_page":
        if (!routerName) {
          console.warn(`[CMS redirect] router name not found for did: ${item.did}`)
          return
        }
        router.push({ name: routerName, query: item.query })
        return
      default:
        break
    }
    if (!routerName) {
      console.warn(`[CMS redirect] router name not found for did: ${item.did}`)
      return
    }
    if (item.opening_method === CMS_OPENING_METHOD.Enums.NEW_TAB) {
      const routeData = router.resolve({
        name: routerName,
        query: item.query
      })
      window.open(routeData.href, "_blank")
      return
    }
    router.push({ name: routerName, query: item.query })
  }

  return {
    handleSiteRedirect
  }
}
