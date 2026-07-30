import { ROUTE_PATH } from "@shared-lib/constants/routePath"

export type MemberProfileTabKey = "memberProfile" | "changePassword" | "changeWithdrawalPassword"

interface MemberProfileTabItem {
  key: MemberProfileTabKey
  label: string
  to: string
}

const MEMBER_PROFILE_TABS: MemberProfileTabItem[] = [
  { key: "memberProfile", label: "個人資訊", to: ROUTE_PATH.MEMBER.PROFILE },
  { key: "changePassword", label: "登入密碼", to: ROUTE_PATH.MEMBER.CHANGE_PASSWORD },
  { key: "changeWithdrawalPassword", label: "設定出款密碼", to: ROUTE_PATH.MEMBER.CHANGE_WITHDRAWAL_PASSWORD }
]

export const useMemberProfileTabs = () => {
  const route = useRoute()

  const activeTabKey = computed<MemberProfileTabKey>(() => {
    const current = MEMBER_PROFILE_TABS.find((item) => item.to === route.path)
    return current?.key ?? "memberProfile"
  })

  const handleTabChange = (targetKey: MemberProfileTabKey) => {
    const target = MEMBER_PROFILE_TABS.find((item) => item.key === targetKey)
    if (!target || target.to === route.path) return

    handleGlobalClick({
      target: `handleMemberProfileTopTab${targetKey}Click`,
      debounceTimer: 160,
      callback: async () => {
        await navigateTo(target.to)
      }
    })
  }

  return {
    tabOptions: MEMBER_PROFILE_TABS,
    activeTabKey,
    handleTabChange
  }
}
