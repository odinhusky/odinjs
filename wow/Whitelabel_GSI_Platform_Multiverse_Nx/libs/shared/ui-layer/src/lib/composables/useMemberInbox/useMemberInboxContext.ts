import { useMemberInbox } from "./index"

type MemberInboxContext = ReturnType<typeof useMemberInbox>

const MEMBER_INBOX_CONTEXT_KEY: InjectionKey<MemberInboxContext> = Symbol("member-inbox-context")

export const provideMemberInboxContext = (context: MemberInboxContext) => {
  provide(MEMBER_INBOX_CONTEXT_KEY, context)
}

export const useMemberInboxContext = () => {
  const context = inject(MEMBER_INBOX_CONTEXT_KEY)

  if (!context) {
    throw new Error("useMemberInboxContext must be used under member inbox context provider")
  }

  return context
}
