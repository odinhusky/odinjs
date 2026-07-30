import type { MemberManagementTabReturn } from "./useMemberManagementTab"

const MEMBER_MANAGEMENT_CONTEXT_KEY = Symbol("memberManagementContext")

export const provideMemberManagementContext = (ctx: MemberManagementTabReturn) => {
  provide(MEMBER_MANAGEMENT_CONTEXT_KEY, ctx)
}

export const useMemberManagementContext = (): MemberManagementTabReturn => {
  const ctx = inject<MemberManagementTabReturn>(MEMBER_MANAGEMENT_CONTEXT_KEY)
  if (!ctx) throw new Error("useMemberManagementContext must be used inside MembershipManagementPanel")
  return ctx
}
