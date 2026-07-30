import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { MEMBER_ASIDE_KEYS, type MemberAsideKey } from "@shared-lib/constants/memberAside"
import { useUserProfileStore } from "./userProfile"

export interface MemberAsideAction {
  key: MemberAsideKey
  label: string
  icon: string
  to: string
}

const MEMBER_ASIDE_ACTIONS: MemberAsideAction[] = [
  {
    key: MEMBER_ASIDE_KEYS.MEMBER_CENTER,
    label: "總覽",
    icon: "mdi:account-circle-outline",
    to: ROUTE_PATH.MEMBER.SUMMARY
  },
  { key: MEMBER_ASIDE_KEYS.PROFILE, label: "個人資訊", icon: "mdi:account-outline", to: ROUTE_PATH.MEMBER.PROFILE },
  { key: MEMBER_ASIDE_KEYS.VIP, label: "VIP 俱樂部", icon: "mdi:diamond-stone", to: ROUTE_PATH.MEMBER.VIP },
  { key: MEMBER_ASIDE_KEYS.DEPOSIT, label: "充值", icon: "mdi:wallet-plus-outline", to: ROUTE_PATH.DEPOSIT },
  { key: MEMBER_ASIDE_KEYS.WITHDRAW, label: "提現", icon: "fluent:wallet-credit-card-20-filled", to: ROUTE_PATH.WITHDRAW },
  {
    key: MEMBER_ASIDE_KEYS.BANK_CARD,
    label: "提款資訊",
    icon: "mdi:bank",
    to: ROUTE_PATH.MEMBER.BANK_CARD
  },
  {
    key: MEMBER_ASIDE_KEYS.MEMBER_MANAGEMENT,
    label: "代理中心",
    icon: "mdi:account-supervisor-outline",
    to: ROUTE_PATH.MEMBER.MEMBER_MANAGEMENT
  },
  { key: MEMBER_ASIDE_KEYS.HISTORY, label: "歷史", icon: "mdi:history", to: ROUTE_PATH.MEMBER.HISTORY },
  {
    key: MEMBER_ASIDE_KEYS.PENDING_ORDER,
    label: "處理中訂單",
    icon: "mdi:clock-time-eight-outline",
    to: ROUTE_PATH.MEMBER.ORDERS
  },
  { key: MEMBER_ASIDE_KEYS.INBOX, label: "我的訊息", icon: "mdi:email-outline", to: ROUTE_PATH.MEMBER.MESSAGE },
  { key: MEMBER_ASIDE_KEYS.INTEREST, label: "利息寶", icon: "mdi:piggy-bank-outline", to: ROUTE_PATH.MEMBER.INTEREST }
]

export const useMemberAsideStore = defineStore("memberAsideStore", () => {
  const rawActions = ref<MemberAsideAction[]>([...MEMBER_ASIDE_ACTIONS])
  const mobileContentVisible = ref(true)
  const lastPhoneState = ref<boolean | null>(null)

  // 代理中心：僅 is_member_agent === true 顯示，避免非代理看到入口後被 middleware 擋回。
  // 對應 useMemberAction 過濾邏輯，profile 尚未載入時隱藏。
  const userProfileStore = useUserProfileStore()
  const memberAsideActions = computed<MemberAsideAction[]>(() =>
    rawActions.value.filter((item) => {
      if (item.key !== MEMBER_ASIDE_KEYS.MEMBER_MANAGEMENT) return true
      return Boolean(userProfileStore.profile?.is_member_agent)
    })
  )

  const getActionByKey = (key: string) => {
    return memberAsideActions.value.find((item) => item.key === key)
  }

  const syncMobileContentByBreakpoint = (isPhone: boolean) => {
    if (lastPhoneState.value === null) {
      mobileContentVisible.value = true
      lastPhoneState.value = isPhone
      return
    }

    if (lastPhoneState.value === isPhone) {
      return
    }

    mobileContentVisible.value = true
    lastPhoneState.value = isPhone
  }

  const openMobileContent = () => {
    mobileContentVisible.value = true
  }

  const closeMobileContent = () => {
    mobileContentVisible.value = false
  }

  return {
    memberAsideActions,
    mobileContentVisible,
    getActionByKey,
    syncMobileContentByBreakpoint,
    openMobileContent,
    closeMobileContent
  }
})
