export const MEMBER_ASIDE_KEYS = {
  MEMBER_CENTER: "member-center",
  PROFILE: "profile",
  VIP: "vip",
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  BANK_CARD: "bankCard",
  MEMBER_MANAGEMENT: "member-management",
  HISTORY: "history",
  PENDING_ORDER: "pendingOrder",
  INBOX: "inbox",
  INTEREST: "interest"
} as const

export type MemberAsideKey = (typeof MEMBER_ASIDE_KEYS)[keyof typeof MEMBER_ASIDE_KEYS]

export const MEMBER_ASIDE_CONTEXT_KEYS = [
  MEMBER_ASIDE_KEYS.MEMBER_CENTER,
  MEMBER_ASIDE_KEYS.PROFILE,
  MEMBER_ASIDE_KEYS.VIP,
  MEMBER_ASIDE_KEYS.BANK_CARD,
  MEMBER_ASIDE_KEYS.HISTORY,
  MEMBER_ASIDE_KEYS.PENDING_ORDER,
  MEMBER_ASIDE_KEYS.INBOX
] as const

export type MemberAsideContextKey = (typeof MEMBER_ASIDE_CONTEXT_KEYS)[number]
