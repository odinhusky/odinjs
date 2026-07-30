import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import { TOAST_SEVERITY_ENUMS } from "@shared-lib/constants/enums/toast"
export interface MemberActionItem {
  key: string
  label: string
  icon: string
  to?: string
}

const MEMBER_ACTIONS: MemberActionItem[] = [
  { key: "member-center", label: "會員中心", icon: "mdi:account-circle-outline", to: ROUTE_PATH.MEMBER.SUMMARY },
  { key: "profile", label: "個人資訊", icon: "mdi:card-account-details-outline", to: ROUTE_PATH.MEMBER.PROFILE },
  { key: "recharge", label: "充值", icon: "mdi:wallet-plus-outline", to: ROUTE_PATH.DEPOSIT },
  { key: "withdraw", label: "提現", icon: "fluent:wallet-credit-card-20-filled", to: ROUTE_PATH.WITHDRAW },
  { key: "history", label: "歷史", icon: "mdi:history", to: ROUTE_PATH.MEMBER.HISTORY },
  { key: "pending-order", label: "處理中訂單", icon: "mdi:clock-time-eight-outline", to: ROUTE_PATH.MEMBER.ORDERS },
  { key: "message", label: "我的訊息", icon: "mdi:email-outline", to: ROUTE_PATH.MEMBER.MESSAGE },
  { key: "vip", label: "VIP 俱樂部", icon: "mdi:diamond-stone", to: ROUTE_PATH.MEMBER.VIP },
  { key: "member-management", label: "代理中心", icon: "solar:people-nearby-bold", to: ROUTE_PATH.MEMBER.MEMBER_MANAGEMENT },
  // 因 Sally 提的需求暫時隱藏以下項目，先保留原本設定與導頁邏輯
  /*
  { key: "ai-agent", label: "Aif代理人", icon: "mdi:robot-outline", to: ROUTE_PATH.HOME },
  { key: "interest-activity", label: "優惠活動", icon: "mdi:gift-outline", to: ROUTE_PATH.HOME },
  { key: "agent-details", label: "代理詳情", icon: "mdi:account-group-outline", to: ROUTE_PATH.HOME },
  { key: "free-transport", label: "免費遊艇", icon: "mdi:ferry", to: ROUTE_PATH.HOME },
  { key: "cooperative-agent", label: "合夥代理", icon: "mdi:handshake-outline", to: ROUTE_PATH.HOME },
  { key: "recharge-record", label: "上級返水", icon: "mdi:wallet-plus-outline", to: ROUTE_PATH.HOME },
  { key: "member-agent", label: "會員代理", icon: "mdi:account-tie-outline", to: ROUTE_PATH.REFERRAL },
  { key: "rebate", label: "利息寶", icon: "mdi:piggy-bank-outline", to: ROUTE_PATH.HOME },
  */
  { key: "logout", label: "登出", icon: "mdi:logout", to: ROUTE_PATH.LOGIN.PASSWORD }
]

export const useMemberAction = () => {
  const authStore = useAuthStore()
  const userProfileStore = useUserProfileStore()
  const { pushToast } = useToastQueue()
  const { logout, isPending: isLogoutPending } = useLogout()

  // 代理中心：僅 is_member_agent === true 顯示。
  // profile 尚未載入時隱藏，避免非代理短暫看到入口。
  const memberActionItems = computed(() =>
    MEMBER_ACTIONS.filter((item) => {
      if (item.key !== "member-management") return true
      return Boolean(userProfileStore.profile?.is_member_agent)
    })
  )

  const handleMemberAction = async (key: string) => {
    if (key === "logout") {
      if (!authStore.isLoggedIn || isLogoutPending.value) return

      handleGlobalClick({
        target: "handleMemberLogoutClick",
        debounceTimer: 250,
        callback: async () => {
          try {
            await logout()
            pushToast({
              severity: TOAST_SEVERITY_ENUMS.SUCCESS,
              summary: "Logout Success",
              detail: "已成功登出",
              life: 2000
            })
          } catch {
            pushToast({
              severity: TOAST_SEVERITY_ENUMS.ERROR,
              summary: "Logout Failed",
              detail: "登出失敗，請稍後再試",
              life: 2200
            })
          }
        }
      })

      return
    }

    const action = MEMBER_ACTIONS.find((item) => item.key === key)
    if (!action?.to) return

    handleGlobalClick({
      target: `handleMember${action.key.replace(/[^a-zA-Z0-9]/g, "") || "Action"}Click`,
      debounceTimer: 250,
      callback: async () => {
        await navigateTo(action.to)
      }
    })
  }

  return {
    memberActionItems,
    handleMemberAction
  }
}
