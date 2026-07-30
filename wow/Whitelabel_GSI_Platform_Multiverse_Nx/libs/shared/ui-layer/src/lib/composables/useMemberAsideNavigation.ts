import { MEMBER_ASIDE_KEYS, type MemberAsideContextKey } from "@shared-lib/constants/memberAside"

const MEMBER_ASIDE_CONTEXT_MAP: Record<MemberAsideContextKey, { pageKey: string; eventPrefix: string }> = {
  [MEMBER_ASIDE_KEYS.MEMBER_CENTER]: { pageKey: MEMBER_ASIDE_KEYS.MEMBER_CENTER, eventPrefix: "Summary" },
  [MEMBER_ASIDE_KEYS.PROFILE]: { pageKey: MEMBER_ASIDE_KEYS.PROFILE, eventPrefix: "Profile" },
  [MEMBER_ASIDE_KEYS.VIP]: { pageKey: MEMBER_ASIDE_KEYS.VIP, eventPrefix: "Vip" },
  [MEMBER_ASIDE_KEYS.BANK_CARD]: { pageKey: MEMBER_ASIDE_KEYS.BANK_CARD, eventPrefix: "BankCard" },
  [MEMBER_ASIDE_KEYS.HISTORY]: { pageKey: MEMBER_ASIDE_KEYS.HISTORY, eventPrefix: "History" },
  [MEMBER_ASIDE_KEYS.PENDING_ORDER]: { pageKey: MEMBER_ASIDE_KEYS.PENDING_ORDER, eventPrefix: "Pending" },
  [MEMBER_ASIDE_KEYS.INBOX]: { pageKey: MEMBER_ASIDE_KEYS.INBOX, eventPrefix: "Inbox" }
}

const normalizeActionKeyForEvent = (value: string) => value.replace(/[^a-zA-Z0-9]/g, "") || "Item"

export const useMemberAsideNavigation = (contextKey: MemberAsideContextKey) => {
  const context = MEMBER_ASIDE_CONTEXT_MAP[contextKey]
  const { isDown } = useCustomBreakpoints()
  const memberAsideStore = useMemberAsideStore()

  const isPhoneViewport = () => Boolean(toValue((isDown as { phone?: boolean }).phone ?? false))

  watchEffect(() => {
    memberAsideStore.syncMobileContentByBreakpoint(isPhoneViewport())
  })

  const handleAsideSelect = (key: string) => {
    if (key === context.pageKey && isPhoneViewport()) {
      handleGlobalClick({
        target: `handleMember${context.eventPrefix}MobileOpenContentClick`,
        debounceTimer: 150,
        callback: () => {
          memberAsideStore.openMobileContent()
        }
      })
      return
    }

    const action = memberAsideStore.getActionByKey(key)
    if (!action?.to) return

    handleGlobalClick({
      target: `handleMember${context.eventPrefix}Aside${normalizeActionKeyForEvent(key)}Click`,
      debounceTimer: 180,
      callback: async () => {
        if (isPhoneViewport()) {
          memberAsideStore.openMobileContent()
        }
        await navigateTo(action.to)
      }
    })
  }

  const handleBackToAside = () => {
    handleGlobalClick({
      target: `handleMember${context.eventPrefix}MobileBackAsideClick`,
      debounceTimer: 150,
      callback: () => {
        memberAsideStore.closeMobileContent()
      }
    })
  }

  return {
    memberAsideActions: computed(() => memberAsideStore.memberAsideActions),
    mobileContentVisible: computed(() => memberAsideStore.mobileContentVisible),
    handleAsideSelect,
    handleBackToAside
  }
}
